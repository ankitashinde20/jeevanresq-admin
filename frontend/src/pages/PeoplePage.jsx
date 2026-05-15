import { useEffect, useState } from 'react';
import { BadgeCheck, FileUp, KeyRound, Plus } from 'lucide-react';
import { api } from '../api/client.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';

export function PeoplePage() {
  const [volunteers, setVolunteers] = useState([]);
  const [ngos, setNgos] = useState([]);
  useEffect(() => {
    api.get('/volunteers').then((res) => setVolunteers(res.data)).catch(() => null);
    api.get('/ngos').then((res) => setNgos(res.data)).catch(() => null);
  }, []);

  async function addVolunteer() {
    const payload = { fullName: 'New Verified Volunteer', mobile: '+91 90000 55555', gender: 'Other', skills: 'Medical, Logistics', bloodGroup: 'O+', assignedCamp: 'Patna College Relief Camp', role: 'Medical' };
    const { data } = await api.post('/volunteers', payload, { headers: { 'Content-Type': 'multipart/form-data' } }).catch(() => ({ data: { id: Date.now(), ...payload, volunteerId: `JRV-${Date.now()}`, username: 'vol-demo', generatedPassword: 'change-me', verificationStatus: 'PENDING' } }));
    setVolunteers((current) => [data, ...current]);
  }

  async function addNgo() {
    const payload = { ngoName: 'Rapid Relief Foundation', workerName: 'NGO Worker', contactInfo: '+91 90000 66666', assignedCamp: 'Patna College Relief Camp', responsibilities: 'Camp management, ration support' };
    const { data } = await api.post('/ngos', payload, { headers: { 'Content-Type': 'multipart/form-data' } }).catch(() => ({ data: { id: Date.now(), ...payload, workerId: `JRN-${Date.now()}`, username: 'ngo-demo', generatedPassword: 'change-me', verificationStatus: 'PENDING' } }));
    setNgos((current) => [data, ...current]);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <DataPanel title="Volunteer Management" action={<button onClick={addVolunteer} className="inline-flex items-center gap-2 rounded-lg bg-cyan/15 px-3 py-2 text-sm text-cyan-100"><Plus size={16} /> Add volunteer</button>}>
        <PeopleList rows={volunteers} empty="No volunteers yet. Add one to generate login credentials." idKey="volunteerId" />
      </DataPanel>
      <DataPanel title="NGO Worker Management" action={<button onClick={addNgo} className="inline-flex items-center gap-2 rounded-lg bg-cyan/15 px-3 py-2 text-sm text-cyan-100"><Plus size={16} /> Add NGO worker</button>}>
        <PeopleList rows={ngos} empty="No NGO workers yet. Add one to assign camps and credentials." idKey="workerId" />
      </DataPanel>
    </div>
  );
}

function PeopleList({ rows, empty, idKey }) {
  if (!rows.length) return <p className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">{empty}</p>;
  return (
    <div className="space-y-3">
      {rows.map((person) => (
        <article key={person.id} className="rounded-lg border border-slate-700 bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-white">{person.fullName || person.workerName || person.ngoName}</p>
              <p className="text-sm text-slate-400">{person[idKey]} · {person.mobile || person.contactInfo}</p>
            </div>
            <StatusBadge value={person.verificationStatus} />
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2"><FileUp size={15} /> Documents</span>
            <span className="inline-flex items-center gap-2"><BadgeCheck size={15} /> Verify identity</span>
            <span className="inline-flex items-center gap-2"><KeyRound size={15} /> {person.username} / {person.generatedPassword}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

