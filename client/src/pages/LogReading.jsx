import { useState } from 'react';
import ReadingForm from '../components/ReadingForm';
import { addReading, deleteReading, getReadings, updateReading } from '../api';
import { format } from 'date-fns';
import { useEffect } from 'react';

const CONTEXT_LABELS = {
  fasting: 'Fasting',
  pre_meal: 'Pre-meal',
  post_meal: 'Post-meal',
  bedtime: 'Bedtime',
  other: 'Other',
};

function glucoseColor(value, low = 4.0, high = 10.0) {
  if (value < low) return 'text-red-400';
  if (value > high) return 'text-orange-400';
  return 'text-green-400';
}

export default function LogReading() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');

  function flash(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2500);
  }

  useEffect(() => {
    getReadings({ limit: 50 })
      .then(setReadings)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(data) {
    const r = await addReading(data);
    setReadings(prev => [r, ...prev]);
    flash('Reading logged');
  }

  async function handleUpdate(id, data) {
    const r = await updateReading(id, data);
    setReadings(prev => prev.map(x => (x.id === id ? r : x)));
    setEditingId(null);
    flash('Reading updated');
  }

  async function handleDelete(id) {
    if (!confirm('Delete this reading?')) return;
    await deleteReading(id);
    setReadings(prev => prev.filter(x => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">Log a reading</h2>
        <ReadingForm onSave={handleAdd} />
        {success && (
          <p className="mt-3 text-green-400 text-sm">{success}</p>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">Recent readings</h2>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : readings.length === 0 ? (
          <p className="text-gray-500 text-sm">No readings yet.</p>
        ) : (
          <div className="space-y-2">
            {readings.map(r => (
              <div key={r.id}>
                {editingId === r.id ? (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <ReadingForm
                      initial={r}
                      onSave={data => handleUpdate(r.id, data)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
                    <span className={`text-xl font-bold w-16 shrink-0 ${glucoseColor(r.value)}`}>
                      {r.value}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-300">
                          {format(new Date(r.recorded_at), 'EEE d MMM, HH:mm')}
                        </span>
                        {r.meal_context && (
                          <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">
                            {CONTEXT_LABELS[r.meal_context] ?? r.meal_context}
                          </span>
                        )}
                      </div>
                      {r.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{r.notes}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditingId(r.id)}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-xs text-gray-400 hover:text-red-400 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
