import { useDashboardStream } from '../hooks/useDashboardStream.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';

export function AnalyticsPage() {
  const { data } = useDashboardStream();
  const rows = [
    ['Total SOS', data.stats.totalSos, 92],
    ['Active emergencies', data.stats.activeEmergencies, 64],
    ['Rescues completed', data.stats.rescuesCompleted, 84],
    ['Missing persons', data.stats.missingPersons, 38],
    ['Camp occupancy', `${data.stats.campOccupancy}%`, data.stats.campOccupancy],
    ['Resource consumption', data.stats.resourceRequests, 58],
    ['Hazard trend', 'Rising', 76]
  ];
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
      <DataPanel title="Daily / Weekly / Monthly Reports">
        <div className="space-y-5">
          {rows.map(([label, value, percent]) => (
            <div key={label}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-white">{label}</span>
                <span className="text-slate-400">{value}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800">
                <div className="h-3 rounded-full bg-gradient-to-r from-cyan to-emergency" style={{ width: `${percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </DataPanel>
      <DataPanel title="Performance Analysis">
        <div className="space-y-4 text-sm text-slate-300">
          <p>Average SOS acknowledgement target: under 60 seconds.</p>
          <p>Resource request approval target: under 15 minutes for critical categories.</p>
          <p>Camp shortage model flags camps with food stock below three days or occupancy above 85%.</p>
          <p>Charts are implemented with CSS for a free, dependency-light build; the data source can be switched to Firestore aggregation or scheduled backend reports.</p>
        </div>
      </DataPanel>
    </div>
  );
}

