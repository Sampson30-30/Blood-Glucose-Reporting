export default function TrendBadge({ trend }) {
  if (!trend) return null;

  const { direction, changePercent, change } = trend;
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';
  const color =
    direction === 'up'
      ? 'text-orange-400 bg-orange-400/10'
      : direction === 'down'
      ? 'text-green-400 bg-green-400/10'
      : 'text-gray-400 bg-gray-700';

  const sign = change > 0 ? '+' : '';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {arrow} {sign}{change} mmol/L ({sign}{changePercent}%) vs prior period
    </span>
  );
}
