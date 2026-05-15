import { AlertTriangle, Ambulance, Boxes, CheckCircle2, ClipboardList, Siren, Tent, Users } from 'lucide-react';
import { useDashboardStream } from '../hooks/useDashboardStream.js';
import { StatCard } from '../components/ui/StatCard.jsx';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';
import { CommandMap } from '../components/maps/CommandMap.jsx';

export function DashboardPage() {
  const { data } = useDashboardStream();
  const stats = data.stats;
  const cards = [
    ['Total SOS', stats.totalSos, 'red', Siren],
    ['Active Emergencies', stats.activeEmergencies, 'amber', AlertTriangle],
    ['Rescues Completed', stats.rescuesCompleted, 'green', CheckCircle2],
    ['Missing Persons', stats.missingPersons, 'amber', Users],
    ['Camp Occupancy', `${stats.campOccupancy}%`, 'cyan', Tent],
    ['Resource Requests', stats.resourceRequests, 'cyan', Boxes],
    ['Active Teams', stats.teamsActive, 'green', Ambulance],
    ['Ration Days', stats.rationStockDays, 'red', ClipboardList]
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-red-500/30 bg-red-500/12 p-4 shadow-glow">
        <p className="font-bold text-red-100">Critical priority banner: live SOS alerts require operator acknowledgement within 60 seconds.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, tone, Icon]) => (
          <div key={label} className="relative">
            <StatCard label={label} value={value} tone={tone} />
            <Icon className="absolute right-4 top-4 text-slate-500" size={22} />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DataPanel title="Live Command Map">
          <CommandMap sosAlerts={data.sosAlerts} />
        </DataPanel>
        <DataPanel title="Newest SOS Alerts">
          <div className="space-y-3">
            {data.sosAlerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border border-slate-700 bg-white/[0.03] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{alert.userName}</p>
                    <p className="text-sm text-slate-400">{alert.alertType} via {alert.activatedMode}</p>
                  </div>
                  <StatusBadge value={alert.severity} />
                </div>
                <p className="mt-2 text-xs text-slate-400">{alert.location.address} · Battery {alert.batteryLevel}%</p>
              </div>
            ))}
          </div>
        </DataPanel>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <DataPanel title="Resource Requests">
          <Table rows={data.resourceRequests} columns={['requester', 'category', 'quantity', 'priority', 'status']} />
        </DataPanel>
        <DataPanel title="Activity Logs">
          <Table rows={data.activityLogs} columns={['actor', 'action', 'target', 'timestamp']} />
        </DataPanel>
      </div>
    </div>
  );
}

function Table({ rows, columns }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-slate-500">
          <tr>{columns.map((column) => <th key={column} className="px-3 py-2">{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-800">
              {columns.map((column) => (
                <td key={column} className="px-3 py-3 text-slate-300">{column.includes('status') || column === 'priority' ? <StatusBadge value={row[column]} /> : String(row[column] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

