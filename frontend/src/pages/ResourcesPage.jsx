import { useEffect, useState } from 'react';
import { Check, PackageCheck, X } from 'lucide-react';
import { api } from '../api/client.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';

export function ResourcesPage() {
  const [state, setState] = useState({ requests: [], inventory: [] });
  useEffect(() => { api.get('/resources').then((res) => setState(res.data)).catch(() => null); }, []);

  async function decide(request, status) {
    const deliveryStatus = status === 'APPROVED' ? 'Allocated and ready for dispatch' : 'Rejected by control room';
    const { data } = await api.patch(`/resources/${request.id}`, { status, deliveryStatus }).catch(() => ({ data: { ...request, status, deliveryStatus } }));
    setState((current) => ({ ...current, requests: current.requests.map((item) => item.id === request.id ? data : item) }));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <DataPanel title="Resource Requests & Approvals">
        <div className="space-y-3">
          {state.requests.map((request) => (
            <div key={request.id} className="rounded-lg border border-slate-700 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{request.requester}</p>
                  <p className="text-sm text-slate-400">{request.quantity} {request.unit} · {request.category}</p>
                </div>
                <div className="flex gap-2"><StatusBadge value={request.priority} /><StatusBadge value={request.status} /></div>
              </div>
              <p className="mt-3 text-sm text-slate-400">{request.deliveryStatus}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => decide(request, 'APPROVED')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100"><Check size={16} /> Approve</button>
                <button onClick={() => decide(request, 'REJECTED')} className="inline-flex items-center gap-2 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-100"><X size={16} /> Reject</button>
                <button onClick={() => decide(request, 'DISPATCHED')} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"><PackageCheck size={16} /> Track delivery</button>
              </div>
            </div>
          ))}
        </div>
      </DataPanel>
      <DataPanel title="Inventory Analytics">
        <div className="space-y-4">
          {state.inventory.map((item) => {
            const percent = Math.max(8, Math.round((item.available - item.reserved) / item.available * 100));
            return (
              <div key={item.id}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-white">{item.item}</span>
                  <span className="text-slate-400">{item.available - item.reserved} {item.unit}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-cyan" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </DataPanel>
    </div>
  );
}

