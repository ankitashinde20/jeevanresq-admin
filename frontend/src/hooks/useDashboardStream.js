import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { getSocket } from '../api/socket.js';
import { fallback } from '../data/fallback.js';

export function useDashboardStream() {
  const [data, setData] = useState(fallback);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/dashboard')
      .then((response) => mounted && setData(response.data))
      .catch(() => mounted && setData(fallback));

    const socket = getSocket();
    if (!socket) return undefined;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('analytics:update', (stats) => setData((current) => ({ ...current, stats })));
    socket.on('sos:new', (alert) => setData((current) => ({ ...current, sosAlerts: [alert, ...current.sosAlerts], stats: { ...current.stats, totalSos: current.stats.totalSos + 1, activeEmergencies: current.stats.activeEmergencies + 1 } })));
    socket.on('resource:new', (request) => setData((current) => ({ ...current, resourceRequests: [request, ...current.resourceRequests] })));
    socket.on('call:new', (call) => setData((current) => ({ ...current, calls: [call, ...current.calls] })));

    return () => {
      mounted = false;
      socket.off('connect');
      socket.off('disconnect');
      socket.off('analytics:update');
      socket.off('sos:new');
      socket.off('resource:new');
      socket.off('call:new');
    };
  }, []);

  return { data, connected };
}

