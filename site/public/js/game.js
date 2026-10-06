// "Coffee run": a puzzle for the Bug2 robot. Place a few walls and pick which side the
// robot keeps on the wall, so it collects every coffee bean on its way to the flag.
import { cellIndex } from './bug2.js';
import { GRID, LEVELS, MAX_STARS, playLevel } from './levels.js';

const $ = (s, el = document) => el.querySelector(s);
const canvas = $('#bug2');
if (canvas) init();

function init() {
  const ctx = canvas.getContext('2d');
  const CELL = 40;
  const { cols, rows, start, goal } = GRID;
  canvas.width = cols * CELL;
  canvas.height = rows * CELL;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const ui = {
    levels: $('#levelStrip'), title: $('#levelTitle'), hint: $('#levelHint'),
    beans: $('#gameBeans'), walls: $('#gameWalls'), par: $('#gamePar'), side: $('#gameSide'), total: $('#gameStars'),
    run: $('#gameRun'), reset: $('#gameReset'), speed: $('#gameSpeed'), result: $('#gameResult'), next: $('#gameNext'),
    form: $('#scoreForm'), name: $('#scoreName'), submit: $('#scoreSubmit'), board: $('#board'), boardNote: $('#boardNote')
  };

  // progress: { [levelId]: { stars, walls: [...], side } }: your best solution per level, for
  // this visit only. Every refresh starts a fresh game; scores live on the leaderboard.
  let progress = {};
  try { localStorage.removeItem('coffee-run'); } catch (e) {} // progress saved by older versions
  let level = LEVELS[0];
  let placed = new Set();
  let side = 'right';
  let trail = [], eaten = new Set(), robot = { ...start };
  let running = false, timer = null, cursor = { x: 4, y: GRID.mid }, showCursor = false;
  let party = null; // the win celebration: beans burst from the flag and brew into a cup

  const idx = (x, y) => cellIndex(GRID, x, y);
  const fixedSet = () => new Set(level.fixed.map(([x, y]) => idx(x, y)));
  const beanSet = () => new Set(level.beans.map(([x, y]) => idx(x, y)));
  const totalStars = () => LEVELS.reduce((s, l) => s + (progress[l.id]?.stars || 0), 0);

  // ---- Drawing -----------------------------------------------------------------
  const color = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  function draw() {
    const c = { bg: color('--surface'), grid: color('--line'), ink: color('--ink'), accent: color('--accent'), blue: color('--blue'),
      soft: color('--accent-soft'), paper: color('--paper'), faint: color('--faint'), coffee: color('--coffee') || '#6b3b22', crema: color('--crema') || '#c08a5a' };
    ctx.fillStyle = c.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = c.grid;
    for (let y = 0; y <= rows; y++) for (let x = 0; x <= cols; x++) ctx.fillRect(x * CELL - 1, y * CELL - 1, 3, 3);
    // m-line
    ctx.fillStyle = c.soft;
    for (let x = start.x; x <= goal.x; x++) ctx.fillRect(x * CELL + 14, GRID.mid * CELL + 18, 12, 4);
    // trail
    for (const p of trail) { ctx.fillStyle = p.mode === 'wall' ? c.blue : c.accent; ctx.fillRect(p.x * CELL + 15, p.y * CELL + 15, 10, 10); }
    // fixed walls, then your walls
    ctx.fillStyle = c.ink;
    for (const [x, y] of level.fixed) ctx.fillRect(x * CELL + 2, y * CELL + 2, CELL - 4, CELL - 4);
    for (const i of placed) {
      const x = i % cols, y = Math.floor(i / cols);
      ctx.fillStyle = c.accent; ctx.fillRect(x * CELL + 2, y * CELL + 2, CELL - 4, CELL - 4);
      ctx.fillStyle = c.paper; ctx.fillRect(x * CELL + 8, y * CELL + 8, 8, 4); ctx.fillRect(x * CELL + 8, y * CELL + 12, 4, 4);
    }
    // coffee beans
    for (const [x, y] of level.beans) {
      if (eaten.has(idx(x, y))) continue;
      const bx = x * CELL + 10, by = y * CELL + 8;
      ctx.fillStyle = c.coffee;
      ctx.fillRect(bx + 6, by, 8, 4); ctx.fillRect(bx + 2, by + 4, 16, 16); ctx.fillRect(bx, by + 8, 20, 8); ctx.fillRect(bx + 6, by + 20, 8, 4);
      ctx.fillStyle = c.crema; ctx.fillRect(bx + 9, by + 4, 2, 4); ctx.fillRect(bx + 8, by + 8, 2, 8); ctx.fillRect(bx + 9, by + 16, 2, 4);
    }
    // start pad and flag
    ctx.fillStyle = c.blue; ctx.fillRect(start.x * CELL + 4, start.y * CELL + 4, CELL - 8, CELL - 8);
    ctx.fillStyle = c.ink; ctx.fillRect(goal.x * CELL + 10, goal.y * CELL + 4, 4, 32);
    ctx.fillStyle = c.accent; ctx.fillRect(goal.x * CELL + 14, goal.y * CELL + 4, 18, 14);
    // robot
    const rx = robot.x * CELL, ry = robot.y * CELL;
    ctx.fillStyle = c.ink; ctx.fillRect(rx + 8, ry + 10, 24, 20); ctx.fillRect(rx + 18, ry + 4, 4, 6);
    ctx.fillStyle = c.paper; ctx.fillRect(rx + 12, ry + 16, 6, 6); ctx.fillRect(rx + 22, ry + 16, 6, 6);
    ctx.fillStyle = c.accent; ctx.fillRect(rx + 18, ry + 2, 4, 4); ctx.fillRect(rx + 12, ry + 30, 6, 6); ctx.fillRect(rx + 22, ry + 30, 6, 6);
    if (showCursor && !running) { ctx.strokeStyle = c.accent; ctx.lineWidth = 3; ctx.strokeRect(cursor.x * CELL + 2, cursor.y * CELL + 2, CELL - 4, CELL - 4); }
    if (party) drawParty(c, performance.now());
  }

  // ---- Celebration: beans burst out of the flag, fly into a cup, and brew ----------------
  const BURST = 650, POUR = 700, BREW = 600;
  const cup = () => ({ x: canvas.width / 2, y: canvas.height / 2 + 30 });
  function bean(x, y, s, col, crema) {
    ctx.fillStyle = col;
    ctx.fillRect(x - 2 * s, y - 3 * s, 4 * s, s); ctx.fillRect(x - 3 * s, y - 2 * s, 6 * s, 4 * s); ctx.fillRect(x - 2 * s, y + 2 * s, 4 * s, s);
    ctx.fillStyle = crema; ctx.fillRect(x - s / 2, y - 2 * s, s, 4 * s);
  }
  function celebrate(stars) {
    const fx = goal.x * CELL + 20, fy = goal.y * CELL + 10;
    const n = 22 + level.beans.length * 4;
    party = {
      t0: performance.now(), stars,
      beans: Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        const v = 260 + Math.random() * 320;
        return { x0: fx, y0: fy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, delay: (i / n) * 260, s: 2 + Math.round(Math.random()) };
      })
    };
    if (reduceMotion) party.t0 -= BURST + POUR + BREW + 400;
    cancelAnimationFrame(party.raf);
    (function loop() { draw(); if (party && performance.now() - party.t0 < BURST + POUR + BREW + 1600) party.raf = requestAnimationFrame(loop); })();
  }
  function drawParty(c, now) {
    const t = now - party.t0;
    const { x: cx, y: cy } = cup();
    // dim the board so the cup stands out
    const fade = Math.min(1, t / 500);
    ctx.globalAlpha = 0.55 * fade; ctx.fillStyle = c.bg; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.globalAlpha = 1;
    // beans: burst with gravity, then pour into the cup
    let landed = 0;
    for (const b of party.beans) {
      const bt = Math.max(0, t - b.delay) / 1000;
      const burstT = Math.min(bt, BURST / 1000);
      const bx = b.x0 + b.vx * burstT, by = b.y0 + b.vy * burstT + 900 * burstT * burstT;
      const pourK = Math.min(1, Math.max(0, (t - b.delay - BURST) / POUR));
      if (pourK >= 1) { landed++; continue; }
      const e = pourK * pourK * (3 - 2 * pourK); // ease in-out
      const x = bx + (cx - bx) * e, y = by + (cy - 34 - by) * e;
      bean(Math.round(x / 2) * 2, Math.round(y / 2) * 2, b.s, c.coffee, c.crema);
    }
    const fill = landed / party.beans.length;
    // the cup (pixel style): saucer, body, handle, coffee rising with each bean
    const w = 96, h = 72, left = cx - w / 2, top = cy - h / 2;
    ctx.fillStyle = c.ink;
    ctx.fillRect(left - 18, top + h + 6, w + 36, 8);                 // saucer
    ctx.fillRect(left - 6, top - 6, w + 12, 6);                       // rim
    ctx.fillRect(left - 6, top, 6, h); ctx.fillRect(left + w, top, 6, h); ctx.fillRect(left - 6, top + h, w + 12, 6); // body
    ctx.fillRect(left + w + 6, top + 12, 16, 6); ctx.fillRect(left + w + 18, top + 18, 6, 24); ctx.fillRect(left + w + 6, top + 42, 16, 6); // handle
    ctx.fillStyle = c.paper; ctx.fillRect(left, top, w, h);
    const level_h = Math.round((h - 6) * fill / 6) * 6;
    ctx.fillStyle = c.coffee; ctx.fillRect(left, top + h - level_h, w, level_h);
    if (level_h) { ctx.fillStyle = c.crema; ctx.fillRect(left, top + h - level_h, w, 6); }
    // steam and stars once it's brewed
    if (t > BURST + POUR + 200) {
      const on = Math.floor(now / 300) % 2;
      ctx.fillStyle = c.faint || c.ink;
      for (const sx of [left + 26, left + 48, left + 70]) for (let k = 0; k < 3; k++) ctx.fillRect(sx + ((k + on) % 2) * 6, top - 22 - k * 10, 6, 6);
      ctx.fillStyle = c.accent;
      ctx.font = '500 34px "Pixelify Sans", monospace'; ctx.textAlign = 'center';
      ctx.fillText('★'.repeat(party.stars) + '☆'.repeat(3 - party.stars), cx, top - 64);
      ctx.fillStyle = c.ink; ctx.font = '500 22px "Pixelify Sans", monospace';
      ctx.fillText('Brewed!', cx, top + h + 46);
    }
  }
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);

  // ---- Level select and status ---------------------------------------------------
  const starText = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);
  function renderStrip() {
    ui.levels.innerHTML = LEVELS.map((l, i) => {
      const s = progress[l.id]?.stars || 0;
      return `<button type="button" class="lvl${l === level ? ' is-on' : ''}${s ? ' is-done' : ''}" data-level="${i}" aria-pressed="${l === level}" aria-label="Level ${i + 1}: ${l.title}, ${s} of 3 stars">
        <b>${String(i + 1).padStart(2, '0')}</b><span>${starText(s)}</span></button>`;
    }).join('');
    ui.levels.querySelectorAll('[data-level]').forEach((b) => b.addEventListener('click', () => loadLevel(LEVELS[Number(b.dataset.level)])));
    ui.total.textContent = `${totalStars()}/${MAX_STARS}`;
    const got = totalStars();
    document.querySelectorAll('[data-stars]').forEach((el) => { el.textContent = got ? `your stars: ${got}/${MAX_STARS}` : `${LEVELS.length} levels, ${MAX_STARS} stars`; });
  }
  function status(beansGot = 0) {
    ui.beans.textContent = `${beansGot}/${level.beans.length}`;
    ui.walls.textContent = `${placed.size}/${level.budget}`;
    ui.par.textContent = `${level.par}`;
    ui.side.textContent = side === 'right' ? 'Wall on right · goes over ↻' : 'Wall on left · goes under ↺';
    ui.side.setAttribute('aria-pressed', String(side === 'left'));
  }
  function resetRun() {
    clearInterval(timer); running = false; trail = []; eaten = new Set(); robot = { ...start };
    if (party) { cancelAnimationFrame(party.raf); party = null; }
    ui.run.textContent = '▶ Run'; ui.next.hidden = true; ui.result.textContent = '';
    status();
  }
  function loadLevel(l) {
    level = l;
    placed = new Set(); side = 'right';
    ui.title.textContent = `Level ${LEVELS.indexOf(l) + 1} · ${l.title}`;
    ui.hint.textContent = l.hint;
    resetRun(); renderStrip(); draw();
  }

  // ---- Placing walls ---------------------------------------------------------------
  function toggleWall(x, y) {
    if (running || x < 0 || y < 0 || x >= cols || y >= rows) return;
    const i = idx(x, y);
    if (fixedSet().has(i) || beanSet().has(i) || (x === start.x && y === start.y) || (x === goal.x && y === goal.y)) return;
    if (trail.length) resetRun();
    if (placed.has(i)) placed.delete(i);
    else if (placed.size >= level.budget) { ui.result.textContent = `That’s all ${level.budget} walls for this level. Click one to remove it.`; return; }
    else placed.add(i);
    status(); draw();
  }
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    toggleWall(Math.floor((e.clientX - r.left) / r.width * cols), Math.floor((e.clientY - r.top) / r.height * rows));
  });
  canvas.addEventListener('focus', () => { showCursor = true; draw(); });
  canvas.addEventListener('blur', () => { showCursor = false; draw(); });
  canvas.addEventListener('keydown', (e) => {
    const moves = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    if (moves[e.key]) {
      e.preventDefault();
      cursor.x = Math.min(cols - 1, Math.max(0, cursor.x + moves[e.key][0]));
      cursor.y = Math.min(rows - 1, Math.max(0, cursor.y + moves[e.key][1]));
      draw();
    } else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleWall(cursor.x, cursor.y); }
    else if (e.key.toLowerCase() === 'r') { e.preventDefault(); ui.run.click(); }
    else if (e.key.toLowerCase() === 'f') { e.preventDefault(); ui.side.click(); }
  });
  ui.side.addEventListener('click', () => { if (running) return; side = side === 'right' ? 'left' : 'right'; resetRun(); draw(); });
  ui.reset.addEventListener('click', () => { placed = new Set(); resetRun(); draw(); });

  // ---- Running ------------------------------------------------------------------------
  const SPEED = { slow: 140, normal: 70, fast: 25 };
  function finish(res) {
    running = false;
    ui.run.textContent = '↺ Run again';
    status(res.collected.length);
    if (res.win) {
      const best = progress[level.id];
      if (!best || res.stars > best.stars || (res.stars === best.stars && res.wallsUsed < best.walls.length)) {
        progress[level.id] = { stars: res.stars, walls: [...placed], side };
      }
      ui.result.innerHTML = `☕ Every bean collected! <b>${starText(res.stars)}</b> ` +
        (res.stars === 3 ? 'Perfect, that’s par.' : `Par is ${level.par} wall${level.par > 1 ? 's' : ''}. Can you do it with fewer?`);
      ui.next.hidden = LEVELS.indexOf(level) === LEVELS.length - 1;
      celebrate(res.stars);
      ui.form.hidden = leaderboardOffline;
      renderStrip();
    } else if (!res.run.reached) {
      ui.result.textContent = 'The robot couldn’t reach the flag: it circled back to where it hit the wall, so it gave up. Try moving a wall.';
    } else {
      const missed = res.total - res.collected.length;
      ui.result.textContent = `Missed ${missed} bean${missed > 1 ? 's' : ''}. Try another wall, or flip which side the robot hugs.`;
    }
    draw();
  }
  ui.run.addEventListener('click', () => {
    if (running) return;
    resetRun();
    const res = playLevel(level, [...placed], side);
    const beans = beanSet();
    if (reduceMotion) { trail = res.run.path; res.run.path.forEach((p) => beans.has(idx(p.x, p.y)) && eaten.add(idx(p.x, p.y))); robot = res.run.path.at(-1); return finish(res); }
    running = true; ui.run.textContent = 'Running…';
    let k = 0;
    timer = setInterval(() => {
      const p = res.run.path[k];
      robot = { x: p.x, y: p.y }; trail.push(p);
      if (beans.has(idx(p.x, p.y))) eaten.add(idx(p.x, p.y));
      ui.beans.textContent = `${eaten.size}/${level.beans.length}`;
      draw();
      if (++k >= res.run.path.length) { clearInterval(timer); finish(res); }
    }, SPEED[ui.speed.value] || SPEED.normal);
  });
  ui.next.addEventListener('click', () => loadLevel(LEVELS[LEVELS.indexOf(level) + 1]));

  // ---- Leaderboard ----------------------------------------------------------------------
  let leaderboardOffline = false;
  const esc = (v) => String(v).replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[ch]);
  async function loadBoard() {
    try {
      const res = await fetch('/api/scores');
      if (!res.ok) throw new Error(res.status);
      const { scores } = await res.json();
      leaderboardOffline = false;
      ui.boardNote.textContent = scores.length ? '' : 'No one’s on the board yet. Clear a level and be the first.';
      ui.board.innerHTML = scores.map((s, i) => `
        <li><span class="rank">${String(i + 1).padStart(2, '0')}</span><span class="who">${esc(s.name)}</span>
        <span class="pts">★ ${s.stars}/${MAX_STARS} · ${s.levels} level${s.levels === 1 ? '' : 's'}</span></li>`).join('');
    } catch (e) {
      leaderboardOffline = true;
      ui.board.innerHTML = '';
      ui.boardNote.textContent = 'The leaderboard is offline right now, so scores can’t be saved.';
    }
  }
  ui.name.value = store.get('coffee-run-name') || '';
  ui.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = ui.name.value.trim();
    if (!name) { ui.result.textContent = 'Add a name for the leaderboard first.'; ui.name.focus(); return; }
    ui.submit.disabled = true;
    try {
      const solutions = Object.fromEntries(Object.entries(progress).map(([id, p]) => [id, { walls: p.walls, side: p.side }]));
      const res = await fetch('/api/scores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, solutions }) });
      const data = await res.json();
      if (!res.ok) { ui.result.textContent = data.error || 'Could not save your score.'; return; }
      store.set('coffee-run-name', name);
      ui.result.innerHTML = data.improved === false
        ? `You already have <b>★ ${data.stars}</b> on the board as ${esc(data.name)}, at #${data.rank}. Beat it to move up.`
        : `Saved! <b>★ ${data.stars}</b> puts you at <b>#${data.rank}</b>.`;
      ui.form.hidden = true;
      loadBoard();
    } catch (err) {
      ui.result.textContent = 'Could not reach the leaderboard. Try again in a moment.';
    } finally { ui.submit.disabled = false; }
  });

  loadLevel(LEVELS[0]);
  loadBoard();
}
