import { useEffect, useState } from 'react';
import { Droplets, HeartPulse, PlugZap, Users } from 'lucide-react';
import { api } from '../api/client.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';
import { CommandMap } from '../components/maps/CommandMap.jsx';

export function CampsPage() {
  const [camps, setCamps] = useState([]);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    api.get('/camps').then((res) => setCamps(res.data)).catch(() => null);
    api.get('/camp-events').then((res) => setEvents(res.data)).catch(() => null);
  }, []);
  return (
    <div className="space-y-5">
      <DataPanel title="Camp Management System">
        <div className="grid gap-4 xl:grid-cols-2">
          {camps.map((camp) => (
            <article key={camp.id} className="rounded-lg border border-slate-700 bg-white/[0.03] p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{camp.name}</p>
                  <p className="text-sm text-slate-400">Admin: {camp.admin}</p>
                </div>
                <StatusBadge value={camp.waterStatus === 'LOW' ? 'SHORTAGE' : 'STABLE'} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <Metric icon={Users} label="Occupancy" value={`${camp.occupancy}/${camp.capacity}`} />
                <Metric icon={Droplets} label="Water" value={camp.waterStatus} />
                <Metric icon={PlugZap} label="Power" value={camp.electricityStatus} />
                <Metric icon={HeartPulse} label="Medical" value={camp.medicalSupport} />
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-cyan" style={{ width: `${Math.round(camp.occupancy / camp.capacity * 100)}%` }} />
              </div>
            </article>
          ))}
        </div>
      </DataPanel>
      <DataPanel title="Camp Locations">
        <CommandMap sosAlerts={[]} camps={camps} height="420px" />
      </DataPanel>
      <DataPanel title="Live Camp App Events">
        <div className="space-y-3">
          {events.map((event) => (
            <article key={event.id} className="rounded-lg border border-slate-700 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{event.title}</p>
                  <p className="text-sm text-slate-400">{event.entityType} #{event.entityId} · {event.action}</p>
                </div>
                <StatusBadge value={event.source} />
              </div>
              <p className="mt-3 break-words text-xs text-slate-500">{JSON.stringify(event.payload)}</p>
            </article>
          ))}
        </div>
      </DataPanel>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return <div className="rounded-lg bg-slate-950/45 p-3"><Icon size={17} className="text-cyan" /><p className="mt-2 text-xs text-slate-500">{label}</p><p className="text-sm font-semibold text-white">{value}</p></div>;
}
