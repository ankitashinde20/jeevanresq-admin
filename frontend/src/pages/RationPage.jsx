import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api } from '../api/client.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';

export function RationPage() {
  const [logs, setLogs] = useState([]);
  useEffect(() => { api.get('/ration').then((res) => setLogs(res.data)).catch(() => null); }, []);
  async function grant() {
    const payload = { campId: 'camp-1', campName: 'Patna College Relief Camp', rice: 100, wheat: 80, water: 1000, milk: 90, babyFood: 20, medicines: 12, status: 'GRANTED' };
    const { data } = await api.post('/ration', payload).catch(() => ({ data: { id: Date.now(), ...payload, createdAt: new Date().toISOString() } }));
    setLogs((current) => [data, ...current]);
  }
  return (
    <DataPanel title="Ration Distribution System" action={<button onClick={grant} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100"><CheckCircle2 size={16} /> Grant ration</button>}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>{['Camp', 'Rice', 'Wheat', 'Water', 'Milk', 'Baby Food', 'Medicines', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-slate-800">
                <td className="px-3 py-3 text-white">{log.campName}</td>
                <td className="px-3 py-3">{log.rice} kg</td>
                <td className="px-3 py-3">{log.wheat} kg</td>
                <td className="px-3 py-3">{log.water} L</td>
                <td className="px-3 py-3">{log.milk} L</td>
                <td className="px-3 py-3">{log.babyFood}</td>
                <td className="px-3 py-3">{log.medicines}</td>
                <td className="px-3 py-3"><StatusBadge value={log.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataPanel>
  );
}

