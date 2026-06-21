const BASE = '/api';

export async function getReadings(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/readings${q ? '?' + q : ''}`);
  if (!res.ok) throw new Error('Failed to fetch readings');
  return res.json();
}

export async function addReading(data) {
  const res = await fetch(`${BASE}/readings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add reading');
  }
  return res.json();
}

export async function updateReading(id, data) {
  const res = await fetch(`${BASE}/readings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update reading');
  }
  return res.json();
}

export async function deleteReading(id) {
  const res = await fetch(`${BASE}/readings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete reading');
  return res.json();
}

export async function getSummary() {
  const res = await fetch(`${BASE}/stats/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function getSettings() {
  const res = await fetch(`${BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(data) {
  const res = await fetch(`${BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update settings');
  }
  return res.json();
}
