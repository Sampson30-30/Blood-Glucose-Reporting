import StatCard from './StatCard';
import TrendBadge from './TrendBadge';
import GlucoseChart from './GlucoseChart';

function tirColor(pct) {
  if (pct >= 70) return 'text-green-400';
  if (pct >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

export default function PeriodPanel({ days, stats }) {
  if (!stats) {
    return (
      <div className="text-gray-500 text-sm py-8 text-center">
        No readings logged in the last {days} days
      </div>
    );
  }

  const { average, min, max, estimatedHba1c, timeInRange, timeBelow, timeAbove, stdDev, cv, count, trend, readings, targetLow, targetHigh } = stats;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-gray-400">{count} reading{count !== 1 ? 's' : ''}</span>
        <TrendBadge trend={trend} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Average" value={`${average}`} sub="mmol/L" color="text-blue-300" />
        <StatCard label="Est. HbA1c" value={`${estimatedHba1c}%`} sub="IFCC estimate" color="text-purple-300" />
        <StatCard label="Range" value={`${min}–${max}`} sub="mmol/L" />
        <StatCard label="Variability (CV)" value={`${cv}%`} sub={`SD: ${stdDev} mmol/L`} color={cv > 36 ? 'text-orange-400' : 'text-green-400'} />
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Time in range</p>
        <div className="flex rounded-full overflow-hidden h-5 text-xs font-medium">
          {timeBelow > 0 && (
            <div
              className="flex items-center justify-center bg-red-500 text-white"
              style={{ width: `${timeBelow}%` }}
              title={`Below ${targetLow}: ${timeBelow}%`}
            >
              {timeBelow >= 8 ? `${timeBelow}%` : ''}
            </div>
          )}
          {timeInRange > 0 && (
            <div
              className="flex items-center justify-center bg-green-500 text-white"
              style={{ width: `${timeInRange}%` }}
              title={`In range (${targetLow}–${targetHigh}): ${timeInRange}%`}
            >
              {timeInRange >= 8 ? `${timeInRange}%` : ''}
            </div>
          )}
          {timeAbove > 0 && (
            <div
              className="flex items-center justify-center bg-orange-500 text-white"
              style={{ width: `${timeAbove}%` }}
              title={`Above ${targetHigh}: ${timeAbove}%`}
            >
              {timeAbove >= 8 ? `${timeAbove}%` : ''}
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-1.5 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Below {targetLow}: {timeBelow}%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> In range: {timeInRange}%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Above {targetHigh}: {timeAbove}%</span>
        </div>
      </div>

      <GlucoseChart readings={readings} targetLow={targetLow} targetHigh={targetHigh} days={days} />
    </div>
  );
}
