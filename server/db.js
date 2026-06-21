const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const db = new Database(path.join(dataDir, 'glucose.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value REAL NOT NULL,
    recorded_at TEXT NOT NULL,
    meal_context TEXT CHECK(meal_context IN ('fasting', 'pre_meal', 'post_meal', 'bedtime', 'other') OR meal_context IS NULL),
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  INSERT OR IGNORE INTO settings (key, value) VALUES ('target_low', '4.0');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('target_high', '10.0');
`);

module.exports = db;
