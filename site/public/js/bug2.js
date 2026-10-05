// Bug2 on a grid. Shared by the browser game and the Worker, which re-runs it to
// verify leaderboard entries, so both always agree on the result.
//
// The robot starts on the left, the goal is on the right, and the "m-line" is the
// straight row between them. Bug2:
//   1. Move along the m-line toward the goal.
//   2. On hitting a wall, remember the hit point and follow the wall's boundary,
//      keeping the wall on the robot's right (clockwise) or left (counter-clockwise).
//   3. Leave the wall when the robot is back on the m-line, closer to the goal than
//      where it hit. If it returns to the hit point instead, the goal is unreachable.

export function createGrid(cols, rows) {
  const mid = Math.floor(rows / 2);
  return { cols, rows, mid, start: { x: 1, y: mid }, goal: { x: cols - 2, y: mid } };
}

export const cellIndex = (grid, x, y) => y * grid.cols + x;

// Headings, clockwise: north, east, south, west.
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

// Runs Bug2 with a Set of blocked cell indices. `side` is which hand stays on the wall:
// 'right' goes over obstacles (clockwise), 'left' goes under them (counter-clockwise).
// Returns { reached, steps, path, hits }; `path` is a list of { x, y, mode } where
// mode is 'goal' (motion to goal) or 'wall' (following a wall).
export function runBug2(grid, walls, side = 'right') {
  const turns = side === 'left' ? [3, 0, 1, 2] : [1, 0, 3, 2];
  const { cols, rows, mid, start, goal } = grid;
  const maxSteps = cols * rows * 8;
  const blocked = (x, y) => x < 0 || y < 0 || x >= cols || y >= rows || walls.has(y * cols + x);
  let x = start.x, y = start.y;
  let mode = 'goal';
  let heading = 1;
  let hit = null;
  let leftHit = false;
  const path = [{ x, y, mode }];
  const hits = [];

  for (let step = 0; step < maxSteps; step++) {
    if (x === goal.x && y === goal.y) return { reached: true, steps: path.length - 1, path, hits };

    if (mode === 'goal') {
      if (!blocked(x + 1, y)) { x += 1; path.push({ x, y, mode }); continue; }
      // Hit a wall: start following its boundary, facing north (wall on the right)
      // or south (wall on the left).
      hit = { x, y };
      hits.push(hit);
      mode = 'wall';
      heading = side === 'left' ? 2 : 0;
      leftHit = false;
    }

    // Wall following: turn toward the wall first, then straight, away, and back.
    let moved = false;
    for (const turn of turns) {
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
    if (y === mid && x > hit.x) mode = 'goal';
  }
  return { reached: false, steps: path.length - 1, path, hits };
}
