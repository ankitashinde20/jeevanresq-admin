import { useEffect, useState } from 'react';
import { CheckCircle2, FileText, Search } from 'lucide-react';
import { api } from '../api/client.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';
import { CommandMap } from '../components/maps/CommandMap.jsx';

export function MissingPage() {
  const [records, setRecords] = useState([]);
  useEffect(() => { api.get('/missing-persons').then((res) => setRecords(res.data)).catch(() => setRecords([])); }, []);

  async function markFound(record) {
    const { data } = await api.patch(`/missing-persons/${record.id}`, { status: 'FOUND' }).catch(() => ({ data: { ...record, status: 'FOUND' } }));
    setRecords((current) => current.map((item) => item.id === record.id ? data : item));
  }

  return (
    <div className="space-y-5">
      <DataPanel title="Missing & Found Person Reunification">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => (
            <article key={record.id} className="rounded-lg border border-slate-700 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white">{record.name}</p>
                  <p className="text-sm text-slate-400">{record.age} years · {record.gender}</p>
                </div>
                <StatusBadge value={record.status} />
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p><span className="text-slate-500">Last seen:</span> {record.lastSeenLocation}</p>
                <p><span className="text-slate-500">Medical:</span> {record.medicalCondition}</p>
                <p><span className="text-slate-500">Contact:</span> {record.familyContact}</p>
                <p><span className="text-slate-500">Marks:</span> {record.identificationMarks}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => markFound(record)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100"><CheckCircle2 size={16} /> Mark found</button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"><Search size={16} /> Match</button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"><FileText size={16} /> Report</button>
              </div>
            </article>
          ))}
        </div>
      </DataPanel>
      <DataPanel title="Map View">
        <CommandMap sosAlerts={records.filter((item) => item.location).map((item) => ({ id: item.id, userName: item.name, alertType: item.type, activatedMode: item.status, location: item.location, severity: 'HIGH' }))} height="420px" />
      </DataPanel>
    </div>
  );
}

