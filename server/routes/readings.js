const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { days, limit, offset = 0 } = req.query;
  let query = 'SELECT * FROM readings';
  const params = [];

  if (days) {
    query += ' WHERE recorded_at >= datetime("now", ?)';
    params.push(`-${days} days`);
  }

  query += ' ORDER BY recorded_at DESC';

  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
  }

  res.json(db.prepare(query).all(...params));
});

router.post('/', (req, res) => {
  const { value, recorded_at, meal_context, notes } = req.body;

  if (!value || !recorded_at) {
    return res.status(400).json({ error: 'value and recorded_at are required' });
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 1.0 || numValue > 33.3) {
    return res.status(400).json({ error: 'value must be between 1.0 and 33.3 mmol/L' });
  }

  const stmt = db.prepare(
    'INSERT INTO readings (value, recorded_at, meal_context, notes) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(numValue, recorded_at, meal_context || null, notes || null);
  const reading = db.prepare('SELECT * FROM readings WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(reading);
});

router.put('/:id', (req, res) => {
  const { value, recorded_at, meal_context, notes } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM readings WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Reading not found' });

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 1.0 || numValue > 33.3) {
    return res.status(400).json({ error: 'value must be between 1.0 and 33.3 mmol/L' });
  }

  db.prepare(
    'UPDATE readings SET value = ?, recorded_at = ?, meal_context = ?, notes = ? WHERE id = ?'
  ).run(numValue, recorded_at, meal_context || null, notes || null, id);

  res.json(db.prepare('SELECT * FROM readings WHERE id = ?').get(id));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM readings WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Reading not found' });
  db.prepare('DELETE FROM readings WHERE id = ?').run(id);
  res.json({ success: true });
});

module.exports = router;
