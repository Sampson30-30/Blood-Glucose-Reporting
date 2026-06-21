import { useEffect, useState } from 'react';
import { getSummary } from '../api';
import PeriodPanel from '../components/PeriodPanel';

const PERIODS = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [activePeriod, setActivePeriod] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {PERIODS.map(p => (
          <button
            key={p.days}
            onClick={() => setActivePeriod(p.days)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activePeriod === p.days
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <PeriodPanel days={activePeriod} stats={summary?.[activePeriod]} />
      </div>
    </div>
  );
}
