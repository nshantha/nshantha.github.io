// Bug2 on a grid. Shared by the browser game and the Worker, which re-runs it to
// verify leaderboard scores, so both always agree on the result.
//
// The robot starts on the left, the goal is on the right, and the "m-line" is the
// straight row between them. Bug2:
//   1. Move along the m-line toward the goal.
//   2. On hitting a wall, remember the hit point and follow the wall's boundary
//      (keeping the wall on the robot's right).
//   3. Leave the wall when the robot is back on the m-line, closer to the goal than
//      where it hit. If it returns to the hit point instead, the goal is unreachable.

export const COLS = 31;
export const ROWS = 17;
export const MID = Math.floor(ROWS / 2);
export const START = { x: 1, y: MID };
export const GOAL = { x: COLS - 2, y: MID };
export const MAX_WALLS = 120;
const MAX_STEPS = COLS * ROWS * 8;

// Headings, clockwise: north, east, south, west.
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

export const index = (x, y) => y * COLS + x;
const isReserved = (i) => i === index(START.x, START.y) || i === index(GOAL.x, GOAL.y);

// Turns a list of wall indices into a validated Set, or returns an error message.
export function parseWalls(list) {
  if (!Array.isArray(list)) return { error: 'walls must be a list' };
  if (list.length > MAX_WALLS) return { error: `at most ${MAX_WALLS} walls` };
  const walls = new Set();
  for (const i of list) {
    if (!Number.isInteger(i) || i < 0 || i >= COLS * ROWS) return { error: 'wall out of range' };
    if (isReserved(i)) return { error: 'walls cannot cover the start or goal' };
    walls.add(i);
  }
  return { walls };
}

// Runs Bug2 and returns { reached, steps, path, hits }.
// `path` is a list of { x, y, mode } where mode is 'goal' (motion to goal) or 'wall'.
export function runBug2(walls) {
  const blocked = (x, y) => x < 0 || y < 0 || x >= COLS || y >= ROWS || walls.has(index(x, y));
  let x = START.x, y = START.y;
  let mode = 'goal';
  let heading = 1;
  let hit = null;
  let leftHit = false;
  const path = [{ x, y, mode }];
  const hits = [];

  for (let step = 0; step < MAX_STEPS; step++) {
    if (x === GOAL.x && y === GOAL.y) return { reached: true, steps: path.length - 1, path, hits };

    if (mode === 'goal') {
      if (!blocked(x + 1, y)) { x += 1; path.push({ x, y, mode }); continue; }
      // Hit a wall: start following its boundary, facing north so the wall is on the right.
      hit = { x, y };
      hits.push(hit);
      mode = 'wall';
      heading = 0;
      leftHit = false;
    }

    // Wall following with the wall on the right: try right, straight, left, then back.
    let moved = false;
    for (const turn of [1, 0, 3, 2]) {
      const h = (heading + turn) % 4;
      if (!blocked(x + DX[h], y + DY[h])) {
        heading = h; x += DX[h]; y += DY[h]; moved = true;
        break;
      }
    }
    if (!moved) return { reached: false, steps: path.length - 1, path, hits }; // boxed in
    path.push({ x, y, mode });

    if (x === hit.x && y === hit.y) {
      if (leftHit) return { reached: false, steps: path.length - 1, path, hits }; // full loop: unreachable
    } else {
      leftHit = true;
    }
    // Back on the m-line and closer to the goal than the hit point: leave the wall.
    if (y === MID && x > hit.x) mode = 'goal';
  }
  return { reached: false, steps: path.length - 1, path, hits };
}
