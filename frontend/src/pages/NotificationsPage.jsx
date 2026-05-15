import { useEffect, useState } from 'react';
import { Megaphone, Send } from 'lucide-react';
import { api } from '../api/client.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: 'Evacuation Warning', message: 'Move immediately to the nearest marked relief camp.', channel: 'Push', severity: 'HIGH' });
  useEffect(() => { api.get('/notifications').then((res) => setNotifications(res.data)).catch(() => null); }, []);

  async function send(event) {
    event.preventDefault();
    const { data } = await api.post('/notifications', form).catch(() => ({ data: { id: Date.now(), ...form, createdAt: new Date().toISOString() } }));
    setNotifications((current) => [data, ...current]);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <DataPanel title="Broadcast Alert">
        <form onSubmit={send} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
          <label className="block text-sm text-slate-300">Message<textarea className="mt-2 min-h-28 w-full rounded-lg border border-slate-700 bg-slate-950/60 p-3 outline-none" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Channel" value={form.channel} onChange={(value) => setForm({ ...form, channel: value })} />
            <Input label="Severity" value={form.severity} onChange={(value) => setForm({ ...form, severity: value })} />
          </div>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emergency px-4 py-3 font-bold text-white"><Send size={17} /> Send broadcast</button>
        </form>
      </DataPanel>
      <DataPanel title="Notification Center">
        <div className="space-y-3">
          {notifications.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-700 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <Megaphone className="mt-1 text-cyan" size={18} />
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.message}</p>
                  </div>
                </div>
                <StatusBadge value={item.severity} />
              </div>
              <p className="mt-3 text-xs text-slate-500">Channels: Push, SMS placeholder, email alerts · Selected: {item.channel}</p>
            </article>
          ))}
        </div>
      </DataPanel>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return <label className="block text-sm text-slate-300">{label}<input className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/60 p-3 outline-none" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

