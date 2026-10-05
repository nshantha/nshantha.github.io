// Coffee-bean puzzle levels for the Bug2 robot. Shared by the game and the Worker,
// which re-plays every submitted solution. Each level was checked with an exhaustive
// solver: `par` is the fewest walls that collect every bean, using either side.
import { createGrid, runBug2, cellIndex } from './bug2.js';

export const GRID = createGrid(15, 9);

const seg = (x0, y0, x1, y1) => {
  const out = [];
  for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
    for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) out.push([x, y]);
  return out;
};
const WALL = seg(7, 2, 7, 6);
const PILLARS = [...seg(5, 3, 5, 5), ...seg(9, 3, 9, 5)];
const CORRIDOR = [...seg(4, 2, 10, 2), ...seg(4, 6, 10, 6)];
const STEPS = [...seg(4, 4, 4, 6), ...seg(7, 2, 7, 5), ...seg(10, 3, 10, 7)];
const CUP = [...seg(6, 2, 6, 6), ...seg(7, 6, 10, 6), ...seg(10, 2, 10, 5)];

export const LEVELS = [
  { id: 'first-sip', title: 'First sip', par: 1, fixed: [], beans: [[6, 3]],
    hint: 'The robot drives straight for the flag. Put a wall in its way and it walks around it, over the top.' },
  { id: 'over-the-wall', title: 'Over the wall', par: 1, fixed: WALL, beans: [[5, 0], [5, 2]],
    hint: 'When it meets a wall, it hugs the wall all the way around. Change the wall’s shape, change the route.' },
  { id: 'pillars', title: 'Pillars', par: 2, fixed: PILLARS, beans: [[2, 1], [3, 3]],
    hint: 'Two walls this time. Build a little staircase.' },
  { id: 'corridor', title: 'Corridor', par: 2, fixed: CORRIDOR, beans: [[1, 6], [3, 6]],
    hint: 'New trick: flip the robot so it keeps the wall on its left. Then it goes under instead of over.' },
  { id: 'steps', title: 'Steps', par: 2, fixed: STEPS, beans: [[12, 1], [2, 3], [10, 1]],
    hint: 'One bean early, two late. You may need both kinds of help.' },
  { id: 'the-cup', title: 'The cup', par: 2, fixed: CUP, beans: [[4, 8], [7, 8]],
    hint: 'The beans are under the cup.' },
  { id: 'long-way-round', title: 'The long way round', par: 3, fixed: WALL, beans: [[3, 8], [4, 6], [7, 8]],
    hint: 'Three beans, three walls, one very scenic route.' },
  { id: 'bottom-of-the-cup', title: 'Bottom of the cup', par: 3, fixed: CUP, beans: [[1, 6], [8, 8], [3, 6]],
    hint: 'The last cup of the day. Every bean counts.' }
].map((l) => ({ ...l, budget: l.par + 2 }));

export const MAX_STARS = LEVELS.length * 3;
export const levelById = (id) => LEVELS.find((l) => l.id === id);
export const starsFor = (level, wallsUsed) => (wallsUsed <= level.par ? 3 : wallsUsed <= level.par + 1 ? 2 : 1);

// Plays a level. `walls` is a list of cell indices placed by the player, `side` is
// 'right' or 'left'. Returns { error } for invalid input, otherwise the run plus
// which beans were collected, whether the level is won, and the stars earned.
export function playLevel(level, walls, side) {
  if (side !== 'right' && side !== 'left') return { error: 'side must be right or left' };
  if (!Array.isArray(walls)) return { error: 'walls must be a list' };
  if (walls.length > level.budget) return { error: `at most ${level.budget} walls on this level` };
  const fixed = new Set(level.fixed.map(([x, y]) => cellIndex(GRID, x, y)));
  const beans = level.beans.map(([x, y]) => cellIndex(GRID, x, y));
  const reserved = new Set([cellIndex(GRID, GRID.start.x, GRID.start.y), cellIndex(GRID, GRID.goal.x, GRID.goal.y), ...beans]);
  const placed = new Set();
  for (const i of walls) {
    if (!Number.isInteger(i) || i < 0 || i >= GRID.cols * GRID.rows) return { error: 'wall out of range' };
    if (fixed.has(i) || reserved.has(i)) return { error: 'walls can only go on empty cells' };
    placed.add(i);
  }
  const run = runBug2(GRID, new Set([...fixed, ...placed]), side);
  const visited = new Set(run.path.map((p) => cellIndex(GRID, p.x, p.y)));
  const collected = beans.filter((b) => visited.has(b));
  const win = run.reached && collected.length === beans.length;
  return { run, collected, total: beans.length, win, wallsUsed: placed.size, stars: win ? starsFor(level, placed.size) : 0 };
}
