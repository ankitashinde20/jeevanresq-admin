import { useEffect, useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { api } from '../api/client.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';
import { CommandMap } from '../components/maps/CommandMap.jsx';

export function TeamsPage() {
  const [teams, setTeams] = useState([]);
  useEffect(() => { api.get('/teams').then((res) => setTeams(res.data)).catch(() => null); }, []);

  return (
    <div className="space-y-5">
      <DataPanel title="Rescue Team Live Tracking" action={<button className="inline-flex items-center gap-2 rounded-lg bg-cyan/15 px-3 py-2 text-sm text-cyan-100"><Plus size={16} /> Create team</button>}>
        <div className="grid gap-4 xl:grid-cols-2">
          {teams.map((team) => (
            <article key={team.id} className="rounded-lg border border-slate-700 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white">{team.name}</p>
                  <p className="text-sm text-slate-400">Leader: {team.leader}</p>
                </div>
                <StatusBadge value={team.status} />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                <p>Members: {team.members}</p>
                <p>Vehicle: {team.vehicle}</p>
                <p>Kits: {team.medicalKits}</p>
              </div>
              <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500"><MapPin size={14} /> Mission {team.missionId}</p>
            </article>
          ))}
        </div>
      </DataPanel>
      <DataPanel title="Active Missions Map">
        <CommandMap sosAlerts={[]} teams={teams} height="430px" />
      </DataPanel>
    </div>
  );
}

