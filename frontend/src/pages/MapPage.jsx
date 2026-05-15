import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { DataPanel } from '../components/ui/DataPanel.jsx';
import { CommandMap } from '../components/maps/CommandMap.jsx';

export function MapPage() {
  const [state, setState] = useState({ sos: [], teams: [], camps: [] });
  const [userLocation, setUserLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState('');
  useEffect(() => {
    Promise.all([api.get('/sos'), api.get('/teams'), api.get('/camps')])
      .then(([sos, teams, camps]) => setState({ sos: sos.data, teams: teams.data, camps: camps.data }))
      .catch(() => null);
  }, []);

  function locateAdmin() {
    if (!navigator.geolocation) {
      setLocationMessage('Browser location is not supported.');
      return;
    }

    setLocationMessage('Requesting browser location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationMessage('Map centered on your current browser location.');
      },
      () => setLocationMessage('Location permission denied or unavailable.'),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  return (
    <DataPanel
      title="Live Map Command Center"
      action={<button onClick={locateAdmin} className="rounded-lg bg-cyan/15 px-3 py-2 text-sm text-cyan-100">Use my location</button>}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        {['SOS markers', 'Hazard zones', 'Flood zones', 'Fire hotspots', 'Relief camps', 'Rescue teams', 'Geofencing', 'Route tracking'].map((item) => <span key={item} className="rounded-md bg-white/6 px-2 py-1 text-slate-300">{item}</span>)}
        {locationMessage && <span className="rounded-md bg-cyan/10 px-2 py-1 text-cyan-100">{locationMessage}</span>}
      </div>
      <CommandMap sosAlerts={state.sos} teams={state.teams} camps={state.camps} userLocation={userLocation} height="calc(100vh - 220px)" />
    </DataPanel>
  );
}
