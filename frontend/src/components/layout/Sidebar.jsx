import { NavLink } from 'react-router-dom';
import { Ambulance, Bell, Boxes, ChartNoAxesCombined, ClipboardList, Headphones, Home, Map, RadioTower, ShieldAlert, Tent, Users } from 'lucide-react';

const nav = [
  ['/', 'Overview', Home],
  ['/sos', 'SOS Alerts', ShieldAlert],
  ['/missing', 'Missing Persons', ClipboardList],
  ['/resources', 'Resources', Boxes],
  ['/calls', 'Call Center', Headphones],
  ['/teams', 'Rescue Teams', Ambulance],
  ['/camps', 'Camps', Tent],
  ['/people', 'Volunteers & NGO', Users],
  ['/ration', 'Ration', Boxes],
  ['/map', 'Live Map', Map],
  ['/analytics', 'Analytics', ChartNoAxesCombined],
  ['/notifications', 'Broadcasts', Bell]
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-800 bg-command/90 px-4 py-5 backdrop-blur-xl lg:block">
      <div className="mb-7 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-emergency text-white shadow-glow">
          <RadioTower size={24} />
        </div>
        <div>
          <p className="text-lg font-black tracking-wide">JeevanResQ</p>
          <p className="text-xs uppercase text-slate-400">Admin Command Center</p>
        </div>
      </div>
      <nav className="space-y-1">
        {nav.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive ? 'bg-emergency/16 text-white ring-1 ring-emergency/35' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-emergency/30 bg-emergency/10 p-4">
        <p className="text-sm font-semibold text-red-100">Critical Priority Channel</p>
        <p className="mt-1 text-xs text-slate-300">All mobile app events are routed here through REST ingestion and Socket.IO.</p>
      </div>
    </aside>
  );
}

