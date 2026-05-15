import { useEffect, useState } from 'react';
import { FilePlus2, Mic, PhoneCall } from 'lucide-react';
import { api } from '../api/client.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';

export function CallsPage() {
  const [calls, setCalls] = useState([]);
  useEffect(() => { api.get('/calls').then((res) => setCalls(res.data)).catch(() => null); }, []);

  return (
    <DataPanel title="Emergency Call Center">
      <div className="grid gap-4 xl:grid-cols-2">
        {calls.map((call) => (
          <article key={call.id} className="rounded-lg border border-slate-700 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-white">{call.callerName}</p>
                <p className="text-sm text-slate-400">{call.phone} · Ticket {call.ticketId}</p>
              </div>
              <StatusBadge value={call.status} />
            </div>
            <p className="mt-4 text-sm text-slate-300">{call.incidentType}</p>
            <p className="mt-2 rounded-lg bg-slate-900/60 p-3 text-sm text-slate-400">{call.operatorNotes}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg bg-cyan/15 px-3 py-2 text-sm text-cyan-100"><PhoneCall size={16} /> Connect VoIP</button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"><Mic size={16} /> Recording architecture</button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"><FilePlus2 size={16} /> Generate ticket</button>
            </div>
          </article>
        ))}
      </div>
    </DataPanel>
  );
}

