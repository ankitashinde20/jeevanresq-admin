export function StatusBadge({ value }) {
  const text = String(value || 'UNKNOWN');
  const tone = text.includes('CRITICAL') || text.includes('NEW') ? 'bg-red-500/15 text-red-200 ring-red-500/30'
    : text.includes('HIGH') || text.includes('PENDING') ? 'bg-amber-500/15 text-amber-200 ring-amber-500/30'
    : text.includes('APPROVED') || text.includes('COMPLETED') || text.includes('GRANTED') ? 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/30'
    : 'bg-slate-500/15 text-slate-200 ring-slate-500/30';
  return <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${tone}`}>{text.replaceAll('_', ' ')}</span>;
}

