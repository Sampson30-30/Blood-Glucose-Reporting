import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../api';

export default function Settings() {
  const [low, setLow] = useState('');
  const [high, setHigh] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSettings().then(s => {
      setLow(s.target_low?.toString() ?? '4.0');
      setHigh(s.target_high?.toString() ?? '10.0');
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSaved(false);
    try {
      await updateSettings({ target_low: parseFloat(low), target_high: parseFloat(high) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">Target range (mmol/L)</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Low target</label>
              <input
                type="number"
                step="0.1"
                value={low}
                onChange={e => setLow(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">High target</label>
              <input
                type="number"
                step="0.1"
                value={high}
                onChange={e => setHigh(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {saved && <p className="text-green-400 text-sm">Settings saved</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Save
          </button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-sm text-gray-400 space-y-2">
        <p className="font-medium text-gray-300">About the estimates</p>
        <p>HbA1c is estimated from average glucose using the IFCC formula: <span className="font-mono text-gray-300">(avg + 2.59) / 1.59</span>. This is an approximation — your actual HbA1c from a lab test may differ.</p>
        <p>Coefficient of Variation (CV) measures glucose variability. A CV below 36% is generally considered well-controlled variability for Type 1.</p>
      </div>
    </div>
  );
}
