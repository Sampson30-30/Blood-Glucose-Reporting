const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const result = {};
  rows.forEach(r => { result[r.key] = parseFloat(r.value); });
  res.json(result);
});

router.put('/', (req, res) => {
  const { target_low, target_high } = req.body;

  if (target_low !== undefined) {
    const val = parseFloat(target_low);
    if (isNaN(val) || val < 2 || val > 10) {
      return res.status(400).json({ error: 'target_low must be between 2.0 and 10.0 mmol/L' });
    }
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('target_low', val.toString());
  }

  if (target_high !== undefined) {
    const val = parseFloat(target_high);
    if (isNaN(val) || val < 5 || val > 25) {
      return res.status(400).json({ error: 'target_high must be between 5.0 and 25.0 mmol/L' });
    }
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('target_high', val.toString());
  }

  const rows = db.prepare('SELECT key, value FROM settings').all();
  const result = {};
  rows.forEach(r => { result[r.key] = parseFloat(r.value); });
  res.json(result);
});

module.exports = router;
