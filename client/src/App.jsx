import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import LogReading from './pages/LogReading';
import Settings from './pages/Settings';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'log', label: 'Log Reading' },
  { id: 'settings', label: 'Settings' },
];

export default function App() {
  const [tab, setTab] = useState('log');

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Glucose Tracker</h1>
            <p className="text-xs text-gray-500">mmol/L · Type 1</p>
          </div>
          <nav className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'log' && <LogReading />}
        {tab === 'settings' && <Settings />}
      </main>
    </div>
  );
}
