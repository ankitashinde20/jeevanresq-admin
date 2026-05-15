export function StatCard({ label, value, tone = 'cyan', helper }) {
  const tones = {
    red: 'from-red-500/18 to-red-500/4 text-red-200',
    amber: 'from-amber-500/18 to-amber-500/4 text-amber-200',
    green: 'from-emerald-500/18 to-emerald-500/4 text-emerald-200',
    cyan: 'from-cyan-500/18 to-cyan-500/4 text-cyan-200'
  };
  return (
    <div className={`glass rounded-lg bg-gradient-to-br p-4 ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
      {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

