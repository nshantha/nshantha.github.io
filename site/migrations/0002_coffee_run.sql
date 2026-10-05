-- The leaderboard moved from free-draw mazes to the coffee-run puzzle levels.
-- One row per player name (case-insensitive), keeping their best result.
DROP TABLE IF EXISTS scores;
CREATE TABLE players (
  name TEXT PRIMARY KEY COLLATE NOCASE,
  stars INTEGER NOT NULL,
  levels INTEGER NOT NULL,
  walls INTEGER NOT NULL,
  solutions TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX players_rank ON players (stars DESC, walls ASC, updated_at ASC);
