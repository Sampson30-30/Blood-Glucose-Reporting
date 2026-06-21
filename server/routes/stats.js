const express = require('express');
const router = express.Router();
const db = require('../db');

function getStats(days) {
  const readings = db.prepare(
    'SELECT value, recorded_at, meal_context FROM readings WHERE recorded_at >= datetime("now", ?) ORDER BY recorded_at ASC'
  ).all(`-${days} days`);

  if (readings.length === 0) return null;

  const settings = db.prepare('SELECT key, value FROM settings').all();
  const targetLow = parseFloat(settings.find(s => s.key === 'target_low')?.value ?? 4.0);
  const targetHigh = parseFloat(settings.find(s => s.key === 'target_high')?.value ?? 10.0);

  const values = readings.map(r => r.value);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  const inRange = values.filter(v => v >= targetLow && v <= targetHigh).length;
  const below = values.filter(v => v < targetLow).length;
  const above = values.filter(v => v > targetHigh).length;

  // Estimated HbA1c from average mmol/L: IFCC formula
  const hba1c = (avg + 2.59) / 1.59;

  // Standard deviation
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Coefficient of variation (%)
  const cv = (stdDev / avg) * 100;

  return {
    count: readings.length,
    average: Math.round(avg * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
    cv: Math.round(cv * 1) / 1,
    estimatedHba1c: Math.round(hba1c * 10) / 10,
    timeInRange: Math.round((inRange / values.length) * 100),
    timeBelow: Math.round((below / values.length) * 100),
    timeAbove: Math.round((above / values.length) * 100),
    targetLow,
    targetHigh,
    readings,
  };
}

router.get('/summary', (req, res) => {
  const periods = [7, 30, 90];
  const result = {};

  for (const days of periods) {
    const stats = getStats(days);
    if (!stats) {
      result[days] = null;
      continue;
    }

    // Compare to previous same-length period for trend
    const prevReadings = db.prepare(
      `SELECT value FROM readings WHERE recorded_at >= datetime('now', ?) AND recorded_at < datetime('now', ?) ORDER BY recorded_at ASC`
    ).all(`-${days * 2} days`, `-${days} days`);

    let trend = null;
    if (prevReadings.length > 0) {
      const prevAvg = prevReadings.reduce((a, b) => a + b.value, 0) / prevReadings.length;
      const change = stats.average - prevAvg;
      const changePct = Math.round((change / prevAvg) * 100);
      trend = {
        previousAverage: Math.round(prevAvg * 10) / 10,
        change: Math.round(change * 10) / 10,
        changePercent: changePct,
        direction: change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable',
      };
    }

    result[days] = { ...stats, trend };
  }

  res.json(result);
});

module.exports = router;
