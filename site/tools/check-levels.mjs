// Checks every coffee-run level with an exhaustive solver: each level must be
// solvable in exactly `par` walls (using either side) and not in fewer.
// Usage (from site/): node tools/check-levels.mjs
import { LEVELS, GRID, playLevel } from '../public/js/levels.js';
import { cellIndex } from '../public/js/bug2.js';

function* combos(arr, k, start = 0, acc = []) {
  if (acc.length === k) { yield acc; return; }
  for (let i = start; i < arr.length; i++) { acc.push(arr[i]); yield* combos(arr, k, i + 1, acc); acc.pop(); }
}

let failed = false;
for (const level of LEVELS) {
  const taken = new Set([...level.fixed, ...level.beans, [GRID.start.x, GRID.start.y], [GRID.goal.x, GRID.goal.y]]
    .map(([x, y]) => cellIndex(GRID, x, y)));
  const free = [];
  for (let i = 0; i < GRID.cols * GRID.rows; i++) if (!taken.has(i)) free.push(i);
  let best = null, count = 0;
  for (let k = 0; k <= level.par && !best; k++) {
    for (const walls of combos(free, k)) {
      for (const side of ['right', 'left']) {
        if (playLevel(level, [...walls], side).win) { count++; best ??= { k, side }; }
      }
    }
  }
  const ok = best && best.k === level.par;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${level.id.padEnd(18)} par ${level.par}` +
    (best ? ` · solved with ${best.k} (${count} solution${count === 1 ? '' : 's'})` : ' · no solution within par'));
}
process.exit(failed ? 1 : 0);
