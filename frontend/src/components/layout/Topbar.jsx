import { Bell, LogOut, Moon, Wifi } from 'lucide-react';
import { useAuth } from '../../state/AuthContext.jsx';
import { useDashboardStream } from '../../hooks/useDashboardStream.js';

export function Topbar() {
  const { user, logout } = useAuth();
  const { connected } = useDashboardStream();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-command/82 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan">Emergency Operations</p>
          <h1 className="text-xl font-bold text-white">JeevanResQ Control Room</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${connected ? 'bg-success/15 text-emerald-200' : 'bg-warning/15 text-amber-200'}`}>
            <Wifi size={15} /> {connected ? 'Live' : 'Syncing'}
          </span>
          <button className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-white/5" title="Dark mode">
            <Moon size={18} />
          </button>
          <button className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-white/5" title="Notifications">
            <Bell size={18} />
          </button>
          <div className="hidden rounded-lg border border-slate-700 px-3 py-2 text-sm sm:block">
            <span className="text-slate-400">{user?.role}</span> <span className="font-semibold">{user?.name || user?.username}</span>
          </div>
          <button onClick={logout} className="rounded-lg bg-white/8 p-2 text-slate-200 hover:bg-white/12" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

