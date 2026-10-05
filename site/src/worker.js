// Serves ./public, and sends every other hostname (www, the old onemorelayer.dev
// subdomain) and any plain-http request to https://nitesh.fyi with a permanent redirect.
// Also hosts a small API: the Bug2 leaderboard (D1) and the latest Substack posts.
import { COLS, parseWalls, runBug2 } from '../public/js/bug2.js';

const CANONICAL_HOST = 'nitesh.fyi';
const FEED_URL = 'https://onemorelayer.dev/feed';

// Hostnames that should be served as-is: local dev and *.workers.dev previews.
const isDevHost = (host) => host === 'localhost' || host === '127.0.0.1' || host.endsWith('.workers.dev');

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const wrongHost = url.hostname !== CANONICAL_HOST && !isDevHost(url.hostname);
    const insecure = url.protocol === 'http:' && !isDevHost(url.hostname);
    if (wrongHost || insecure) {
      return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
    }

    if (url.pathname.startsWith('/api/')) return withSecurityHeaders(await handleApi(request, url, env, ctx));
    return withSecurityHeaders(await env.ASSETS.fetch(request));
  }
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function handleApi(request, url, env, ctx) {
  try {
    if (url.pathname === '/api/scores' && request.method === 'GET') return await topScores(env);
    if (url.pathname === '/api/scores' && request.method === 'POST') return await submitScore(request, env);
    if (url.pathname === '/api/posts' && request.method === 'GET') return await latestPosts(ctx);
    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('api error', url.pathname, err);
    return json({ error: 'Something went wrong' }, 500);
  }
}

// ---- Leaderboard -----------------------------------------------------------

const NAME_RE = /^[A-Za-z0-9 _.-]{2,16}$/;
const BLOCKED = ['fuck', 'shit', 'cunt', 'nigg', 'fag', 'rape', 'nazi', 'bitch', 'dick', 'cock', 'pussy', 'whore', 'slut'];
const cleanName = (raw) => {
  const name = String(raw ?? '').trim().replace(/\s+/g, ' ');
  if (!NAME_RE.test(name)) return null;
  const squashed = name.toLowerCase().replace(/[^a-z]/g, '');
  return BLOCKED.some((w) => squashed.includes(w)) ? null : name;
};

async function topScores(env) {
  if (!env.DB) return json({ error: 'Leaderboard is offline' }, 503);
  const { results } = await env.DB.prepare(
    'SELECT name, steps, wall_count, walls, created_at FROM scores ORDER BY steps DESC, wall_count ASC, created_at ASC LIMIT 10'
  ).all();
  return json({ scores: results.map((r) => ({ ...r, walls: r.walls ? r.walls.split(',').map(Number) : [] })) });
}

async function submitScore(request, env) {
  if (!env.DB) return json({ error: 'Leaderboard is offline' }, 503);
  if (env.SCORE_LIMIT) {
    const { success } = await env.SCORE_LIMIT.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' });
    if (!success) return json({ error: 'Too many submissions. Try again in a minute.' }, 429);
  }
  const body = await request.text();
  if (body.length > 4096) return json({ error: 'Maze too large' }, 413);
  let data;
  try { data = JSON.parse(body); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const name = cleanName(data.name);
  if (!name) return json({ error: 'Names are 2–16 letters, numbers, spaces, dots, dashes or underscores.' }, 400);
  const parsed = parseWalls(data.walls);
  if (parsed.error) return json({ error: parsed.error }, 400);

  // Never trust the client's score: re-run Bug2 on the submitted maze.
  const result = runBug2(parsed.walls);
  if (!result.reached) return json({ error: 'The robot never reached the goal in that maze.' }, 400);
  if (result.steps <= COLS - 3) return json({ error: 'Draw some walls in the robot’s way first.' }, 400);

  const key = [...parsed.walls].sort((a, b) => a - b).join(',');
  const existing = await env.DB.prepare('SELECT name, steps FROM scores WHERE walls = ?').bind(key).first();
  if (existing) return json({ duplicate: true, name: existing.name, steps: existing.steps, rank: await rankOf(env, existing.steps) });

  await env.DB.prepare('INSERT INTO scores (name, steps, wall_count, walls) VALUES (?, ?, ?, ?)')
    .bind(name, result.steps, parsed.walls.size, key).run();
  return json({ name, steps: result.steps, rank: await rankOf(env, result.steps) }, 201);
}

async function rankOf(env, steps) {
  const row = await env.DB.prepare('SELECT COUNT(*) AS better FROM scores WHERE steps > ?').bind(steps).first();
  return row.better + 1;
}

// ---- Substack feed -------------------------------------------------------------

const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .trim();
const toIsoDate = (s) => { const d = new Date(s); return Number.isNaN(d.getTime()) ? '' : d.toISOString(); };
const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`)); return m ? decode(m[1]) : ''; };

async function latestPosts(ctx) {
  const cache = caches.default;
  const cacheKey = new Request(`https://${CANONICAL_HOST}/api/posts`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const res = await fetch(FEED_URL, { headers: { 'User-Agent': 'nitesh.fyi feed reader' } });
  if (!res.ok) return json({ posts: [], error: 'Feed unavailable' }, 502);
  const xml = await res.text();
  const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3).map(([, item]) => ({
    title: tag(item, 'title'),
    description: tag(item, 'description'),
    url: tag(item, 'link'),
    date: toIsoDate(tag(item, 'pubDate'))
  })).filter((p) => p.url.startsWith('https://onemorelayer.dev/'));

  const response = json({ posts }, 200, { 'Cache-Control': 'public, max-age=3600' });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
