import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, TimeScale);

function pointColor(value, low, high) {
  if (value < low) return '#ef4444';
  if (value > high) return '#f97316';
  return '#22c55e';
}

export default function GlucoseChart({ readings, targetLow, targetHigh, days }) {
  if (!readings || readings.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        No data for this period
      </div>
    );
  }

  const sorted = [...readings].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));

  const labels = sorted.map(r => {
    const d = new Date(r.recorded_at);
    return days <= 7 ? format(d, 'EEE HH:mm') : format(d, 'dd MMM');
  });

  const values = sorted.map(r => r.value);
  const colors = values.map(v => pointColor(v, targetLow, targetHigh));

  const data = {
    labels,
    datasets: [
      {
        label: 'Glucose (mmol/L)',
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.07)',
        pointBackgroundColor: colors,
        pointBorderColor: colors,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => {
            const r = sorted[ctx.dataIndex];
            const ctx_label = r.meal_context ? ` · ${r.meal_context.replace('_', ' ')}` : '';
            return `${ctx.parsed.y} mmol/L${ctx_label}`;
          },
          afterLabel: ctx => {
            const r = sorted[ctx.dataIndex];
            return r.notes ? `Note: ${r.notes}` : '';
          },
        },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#9ca3af' },
        suggestedMin: Math.max(0, targetLow - 2),
        suggestedMax: targetHigh + 3,
        // Draw target range band
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: 10,
          maxRotation: 45,
        },
      },
    },
  };

  return (
    <div className="relative h-56">
      <Line data={data} options={options} />
    </div>
  );
}
