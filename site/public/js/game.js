// "Outsmart my robot": draw walls, watch Bug2 find the goal, chase the longest path.
import { COLS, ROWS, MID, START, GOAL, MAX_WALLS, index, runBug2 } from './bug2.js';

const $ = (s, el = document) => el.querySelector(s);
const canvas = $('#bug2');
if (canvas) init();

function init() {
  const ctx = canvas.getContext('2d');
  const CELL = 20;
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  const ui = {
    mode: $('#gameMode'), steps: $('#gameSteps'), walls: $('#gameWalls'), result: $('#gameResult'),
    run: $('#gameRun'), random: $('#gameRandom'), clear: $('#gameClear'), share: $('#gameShare'), speed: $('#gameSpeed'),
    form: $('#scoreForm'), name: $('#scoreName'), submit: $('#scoreSubmit'), board: $('#board'), boardNote: $('#boardNote')
  };

  let walls = new Set();
  let trail = [];       // cells drawn so far during a run
  let hits = [];
  let robot = { ...START };
  let running = false;
  let lastResult = null; // result of the last finished run, for the leaderboard
  let cursor = { x: 5, y: MID }; // keyboard cursor
  let showCursor = false;
  let timer = null;

  // ---- Drawing -------------------------------------------------------------
  const color = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  function draw() {
    const c = {
      bg: color('--surface'), grid: color('--line'), ink: color('--ink'), accent: color('--accent'),
      blue: color('--blue'), soft: color('--accent-soft'), faint: color('--faint'), paper: color('--paper')
    };
    ctx.fillStyle = c.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    // grid dots
    ctx.fillStyle = c.grid;
    for (let y = 0; y <= ROWS; y++) for (let x = 0; x <= COLS; x++) ctx.fillRect(x * CELL - 1, y * CELL - 1, 2, 2);
    // m-line
    ctx.fillStyle = c.soft;
    for (let x = START.x; x <= GOAL.x; x += 1) if (x % 2 === 0) ctx.fillRect(x * CELL + 6, MID * CELL + 9, 8, 2);
    // trail
    for (const p of trail) {
      ctx.fillStyle = p.mode === 'wall' ? c.blue : c.accent;
      ctx.fillRect(p.x * CELL + 7, p.y * CELL + 7, 6, 6);
    }
    // hit points
    ctx.fillStyle = c.ink;
    for (const h of hits) { ctx.fillRect(h.x * CELL + 4, h.y * CELL + 4, 4, 4); ctx.fillRect(h.x * CELL + 12, h.y * CELL + 12, 4, 4); ctx.fillRect(h.x * CELL + 12, h.y * CELL + 4, 4, 4); ctx.fillRect(h.x * CELL + 4, h.y * CELL + 12, 4, 4); }
    // walls
    ctx.fillStyle = c.ink;
    for (const i of walls) ctx.fillRect((i % COLS) * CELL + 1, Math.floor(i / COLS) * CELL + 1, CELL - 2, CELL - 2);
    // start pad and goal flag
    ctx.fillStyle = c.blue; ctx.fillRect(START.x * CELL + 2, START.y * CELL + 2, CELL - 4, CELL - 4);
    ctx.fillStyle = c.ink; ctx.fillRect(GOAL.x * CELL + 5, GOAL.y * CELL + 2, 2, 16);
    ctx.fillStyle = c.accent; ctx.fillRect(GOAL.x * CELL + 7, GOAL.y * CELL + 2, 9, 7);
    // robot: a little pixel bot
    const rx = robot.x * CELL, ry = robot.y * CELL;
    ctx.fillStyle = c.ink; ctx.fillRect(rx + 4, ry + 5, 12, 10); ctx.fillRect(rx + 9, ry + 2, 2, 3);
    ctx.fillStyle = c.paper; ctx.fillRect(rx + 6, ry + 8, 3, 3); ctx.fillRect(rx + 11, ry + 8, 3, 3);
    ctx.fillStyle = c.accent; ctx.fillRect(rx + 9, ry + 1, 2, 2); ctx.fillRect(rx + 6, ry + 15, 3, 3); ctx.fillRect(rx + 11, ry + 15, 3, 3);
    // keyboard cursor
    if (showCursor && !running) { ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.strokeRect(cursor.x * CELL + 1, cursor.y * CELL + 1, CELL - 2, CELL - 2); }
  }
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);

  function updateReadout(mode = 'ready', steps = 0) {
    ui.mode.textContent = mode;
    ui.steps.textContent = steps;
    ui.walls.textContent = `${walls.size}/${MAX_WALLS}`;
  }

  // ---- Editing ---------------------------------------------------------------
  const reserved = (x, y) => (x === START.x && y === START.y) || (x === GOAL.x && y === GOAL.y);
  function resetRun() {
    clearInterval(timer); running = false; trail = []; hits = []; robot = { ...START }; lastResult = null;
    ui.form.hidden = true; ui.result.textContent = ''; ui.run.textContent = '▶ Run';
    updateReadout();
  }
  function setWall(x, y, on) {
    if (reserved(x, y) || x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
    const i = index(x, y);
    if (on && !walls.has(i)) {
      if (walls.size >= MAX_WALLS) { ui.result.textContent = `That’s all ${MAX_WALLS} walls. Erase some to move them.`; return; }
      walls.add(i);
    } else if (!on) walls.delete(i);
  }
  const cellAt = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: Math.floor((e.clientX - r.left) / r.width * COLS), y: Math.floor((e.clientY - r.top) / r.height * ROWS) };
  };
  let painting = null; // true = adding walls, false = erasing
  canvas.addEventListener('pointerdown', (e) => {
    if (running) return;
    const { x, y } = cellAt(e);
    if (reserved(x, y)) return;
    if (trail.length) resetRun();
    painting = !walls.has(index(x, y));
    setWall(x, y, painting);
    canvas.setPointerCapture(e.pointerId);
    updateReadout(); draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (painting === null) return;
    const { x, y } = cellAt(e);
    setWall(x, y, painting); updateReadout(); draw();
  });
  const stopPaint = () => { painting = null; };
  canvas.addEventListener('pointerup', stopPaint);
  canvas.addEventListener('pointercancel', stopPaint);

  // Keyboard: arrows move a cursor, Space or Enter toggles a wall, R runs.
  canvas.addEventListener('focus', () => { showCursor = true; draw(); });
  canvas.addEventListener('blur', () => { showCursor = false; draw(); });
  canvas.addEventListener('keydown', (e) => {
    const moves = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    if (moves[e.key]) {
      e.preventDefault();
      cursor.x = Math.min(COLS - 1, Math.max(0, cursor.x + moves[e.key][0]));
      cursor.y = Math.min(ROWS - 1, Math.max(0, cursor.y + moves[e.key][1]));
      draw();
    } else if ((e.key === ' ' || e.key === 'Enter') && !running) {
      e.preventDefault();
      if (trail.length) resetRun();
      setWall(cursor.x, cursor.y, !walls.has(index(cursor.x, cursor.y)));
      updateReadout(); draw();
    } else if (e.key.toLowerCase() === 'r') { e.preventDefault(); ui.run.click(); }
  });

  // ---- Running --------------------------------------------------------------
  const SPEED = { slow: 90, normal: 40, fast: 12 };
  function finish(result) {
    running = false; lastResult = result;
    ui.run.textContent = '↺ Run again';
    if (result.reached) {
      ui.result.innerHTML = `Reached the goal in <b>${result.steps}</b> steps with ${walls.size} walls.` +
        (result.steps > 28 ? '' : ' Draw some walls to make it work harder!');
      ui.form.hidden = result.steps <= 28 || leaderboardOffline;
    } else {
      ui.result.innerHTML = `No way through. Bug2 circled back to where it hit the wall, so it knows the goal is unreachable, and gave up after <b>${result.steps}</b> steps.`;
      ui.form.hidden = true;
    }
    updateReadout(result.reached ? 'goal reached' : 'unreachable', result.steps);
    draw();
  }
  ui.run.addEventListener('click', () => {
    if (running) return;
    resetRun();
    const result = runBug2(walls);
    if (reduceMotion) { trail = result.path; hits = result.hits; robot = result.path.at(-1); return finish(result); }
    running = true; ui.run.textContent = 'Running…';
    let k = 0;
    timer = setInterval(() => {
      const p = result.path[k];
      robot = { x: p.x, y: p.y };
      trail.push(p);
      if (p.mode === 'wall' && k > 0 && result.path[k - 1].mode === 'goal') hits.push(result.path[k - 1]);
      updateReadout(p.mode === 'wall' ? 'following wall' : 'motion to goal', k);
      draw();
      k++;
      if (k >= result.path.length) { clearInterval(timer); finish(result); }
    }, SPEED[ui.speed.value] || SPEED.normal);
  });

  // ---- Mazes: random, clear, share -------------------------------------------
  ui.clear.addEventListener('click', () => { walls = new Set(); resetRun(); draw(); });
  ui.random.addEventListener('click', () => {
    for (let attempt = 0; attempt < 30; attempt++) {
      const w = new Set();
      // A few random wall segments, so the maze has real obstacles to follow.
      while (w.size < 90) {
        const vertical = Math.random() < 0.6;
        let x = 3 + Math.floor(Math.random() * (COLS - 6)), y = Math.floor(Math.random() * ROWS);
        const len = 3 + Math.floor(Math.random() * 7);
        for (let s = 0; s < len && w.size < 90; s++) {
          if (!reserved(x, y) && x >= 0 && y >= 0 && x < COLS && y < ROWS) w.add(index(x, y));
          vertical ? y++ : x++;
        }
      }
      if (runBug2(w).reached) { walls = w; break; }
    }
    resetRun(); draw();
  });
  const encode = () => [...walls].sort((a, b) => a - b).map((i) => i.toString(36)).join('.');
  const decode = (s) => s.split('.').map((t) => parseInt(t, 36)).filter((i) => Number.isInteger(i) && i >= 0 && i < COLS * ROWS && !reserved(i % COLS, Math.floor(i / COLS)));
  ui.share.addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#maze=${encode()}`;
    try { await navigator.clipboard.writeText(url); ui.result.textContent = 'Link to this maze copied. Send it to a friend.'; }
    catch (e) { ui.result.textContent = url; }
  });
  function loadMaze(list) {
    walls = new Set(list.slice(0, MAX_WALLS));
    resetRun(); draw();
  }
  const fromHash = location.hash.match(/^#maze=([0-9a-z.]+)$/);
  if (fromHash) { loadMaze(decode(fromHash[1])); requestAnimationFrame(() => $('#play').scrollIntoView()); }

  // ---- Leaderboard ------------------------------------------------------------
  let leaderboardOffline = false;
  const esc = (v) => String(v).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);
  async function loadBoard() {
    try {
      const res = await fetch('/api/scores');
      if (!res.ok) throw new Error(res.status);
      const { scores } = await res.json();
      leaderboardOffline = false;
      ui.boardNote.textContent = scores.length ? '' : 'No scores yet. Be the first.';
      ui.board.innerHTML = scores.map((s, i) => `
        <li><span class="rank">${String(i + 1).padStart(2, '0')}</span><span class="who">${esc(s.name)}</span>
        <span class="pts">${s.steps} steps · ${s.wall_count} walls</span>
        <button type="button" class="chip" data-load="${i}">Try it</button></li>`).join('');
      ui.board.querySelectorAll('[data-load]').forEach((b) => b.addEventListener('click', () => {
        loadMaze(scores[Number(b.dataset.load)].walls);
        ui.result.textContent = `Loaded ${scores[Number(b.dataset.load)].name}’s maze. Run it, then try to beat it.`;
        canvas.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }));
    } catch (e) {
      leaderboardOffline = true;
      ui.board.innerHTML = '';
      ui.boardNote.textContent = 'The leaderboard is offline right now. You can still play.';
    }
  }
  ui.name.value = store.get('bug2-name') || '';
  ui.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!lastResult || !lastResult.reached) return;
    ui.submit.disabled = true;
    try {
      const res = await fetch('/api/scores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: ui.name.value, walls: [...walls] }) });
      const data = await res.json();
      if (!res.ok) { ui.result.textContent = data.error || 'Could not save your score.'; return; }
      store.set('bug2-name', ui.name.value.trim());
      ui.result.innerHTML = data.duplicate
        ? `That exact maze is already on the board, by <b>${esc(data.name)}</b> at #${data.rank}. Change a wall and try again.`
        : `Saved! <b>${data.steps}</b> steps puts you at <b>#${data.rank}</b>.`;
      ui.form.hidden = true;
      loadBoard();
    } catch (err) {
      ui.result.textContent = 'Could not reach the leaderboard. Try again in a moment.';
    } finally { ui.submit.disabled = false; }
  });

  updateReadout();
  draw();
  loadBoard();
}
