import { useEffect, useState } from 'react';
import { Ambulance, Check, Flame, Phone, Shield, Siren } from 'lucide-react';
import { api } from '../api/client.js';
import { fallback } from '../data/fallback.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';
import { CommandMap } from '../components/maps/CommandMap.jsx';

const actions = [
  ['Accept SOS', 'ACCEPTED', Check],
  ['Dispatch Rescue', 'RESCUE_DISPATCHED', Shield],
  ['Call Victim', 'CALLING', Phone],
  ['Send Ambulance', 'AMBULANCE_SENT', Ambulance],
  ['Send Fire Brigade', 'FIRE_SENT', Flame],
  ['Escalate', 'ESCALATED', Siren],
  ['Mark Resolved', 'RESOLVED', Check]
];

export function SosPage() {
  const [alerts, setAlerts] = useState(fallback.sosAlerts);
  const [selected, setSelected] = useState(fallback.sosAlerts[0]);

  useEffect(() => {
    api.get('/sos').then((res) => {
      setAlerts(res.data);
      setSelected(res.data[0]);
    }).catch(() => null);
  }, []);

  async function update(alert, status) {
    const { data } = await api.patch(`/sos/${alert.id}`, { status }).catch(() => ({ data: { ...alert, status } }));
    setAlerts((current) => current.map((item) => item.id === alert.id ? data : item));
    setSelected(data);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <DataPanel title="Real-Time SOS Alert Center">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <button key={alert.id} onClick={() => setSelected(alert)} className={`w-full rounded-lg border p-4 text-left transition ${selected?.id === alert.id ? 'border-red-400 bg-red-500/12' : 'border-slate-700 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{alert.userName}</p>
                  <p className="text-sm text-slate-400">{alert.alertType} · {alert.activatedMode}</p>
                </div>
                <StatusBadge value={alert.severity} />
              </div>
              <p className="mt-3 text-xs text-slate-400">{alert.location.address} · {new Date(alert.timestamp).toLocaleString()} · Battery {alert.batteryLevel}%</p>
            </button>
          ))}
        </div>
      </DataPanel>
      <div className="space-y-5">
        <DataPanel title="Victim Location & Hazards">
          <CommandMap sosAlerts={selected ? [selected] : alerts} height="360px" />
        </DataPanel>
        {selected && (
          <DataPanel title="Operator Actions">
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <Info label="Phone" value={selected.phone} />
              <Info label="Status" value={<StatusBadge value={selected.status} />} />
              <Info label="Nearby Hazards" value={selected.nearbyHazards?.join(', ')} />
              <Info label="Coordinates" value={`${selected.location.lat}, ${selected.location.lng}`} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {actions.map(([label, status, Icon]) => (
                <button key={status} onClick={() => update(selected, status)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-red-400 hover:bg-red-500/10">
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </DataPanel>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return <div className="rounded-lg bg-white/[0.04] p-3"><p className="text-xs text-slate-500">{label}</p><div className="mt-1 text-sm text-slate-100">{value}</div></div>;
}

