import { useState } from 'react';
import { format } from 'date-fns';

const MEAL_CONTEXTS = [
  { value: '', label: 'No context' },
  { value: 'fasting', label: 'Fasting' },
  { value: 'pre_meal', label: 'Pre-meal' },
  { value: 'post_meal', label: 'Post-meal' },
  { value: 'bedtime', label: 'Bedtime' },
  { value: 'other', label: 'Other' },
];

export default function ReadingForm({ onSave, initial = null, onCancel }) {
  const now = new Date();
  const localISO = format(now, "yyyy-MM-dd'T'HH:mm");

  const [value, setValue] = useState(initial?.value?.toString() ?? '');
  const [recordedAt, setRecordedAt] = useState(
    initial?.recorded_at ? format(new Date(initial.recorded_at), "yyyy-MM-dd'T'HH:mm") : localISO
  );
  const [mealContext, setMealContext] = useState(initial?.meal_context ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const num = parseFloat(value);
    if (isNaN(num) || num < 1 || num > 33.3) {
      setError('Enter a value between 1.0 and 33.3 mmol/L');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        value: num,
        recorded_at: new Date(recordedAt).toISOString(),
        meal_context: mealContext || null,
        notes: notes || null,
      });
      if (!initial) {
        setValue('');
        setNotes('');
        setMealContext('');
        setRecordedAt(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-1">Reading (mmol/L)</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="33.3"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="e.g. 6.4"
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-1">Date & Time</label>
          <input
            type="datetime-local"
            value={recordedAt}
            onChange={e => setRecordedAt(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Context</label>
        <div className="flex flex-wrap gap-2">
          {MEAL_CONTEXTS.map(ctx => (
            <button
              key={ctx.value}
              type="button"
              onClick={() => setMealContext(ctx.value)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                mealContext === ctx.value
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              {ctx.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Notes</label>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Optional note..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : initial ? 'Update' : 'Log Reading'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
