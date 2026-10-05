-- Bug2 leaderboard. `walls` is the sorted, comma-separated list of wall cells; it is
-- unique so the same maze can only be on the board once.
CREATE TABLE scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  steps INTEGER NOT NULL,
  wall_count INTEGER NOT NULL,
  walls TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX scores_rank ON scores (steps DESC, wall_count ASC, created_at ASC);
