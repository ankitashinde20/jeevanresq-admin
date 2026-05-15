import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fallback } from '../../data/fallback.js';

const sosIcon = L.divIcon({ className: '', html: '<div class="marker-sos emergency-pulse"></div>', iconSize: [24, 24] });
const teamIcon = L.divIcon({ className: '', html: '<div style="width:16px;height:16px;border-radius:6px;background:#22d3ee;border:2px solid white;box-shadow:0 0 14px #22d3ee"></div>', iconSize: [20, 20] });
const campIcon = L.divIcon({ className: '', html: '<div style="width:16px;height:16px;border-radius:4px;background:#22c55e;border:2px solid white;box-shadow:0 0 14px #22c55e"></div>', iconSize: [20, 20] });
const adminIcon = L.divIcon({ className: '', html: '<div style="width:18px;height:18px;border-radius:999px;background:#2563eb;border:3px solid white;box-shadow:0 0 18px #60a5fa"></div>', iconSize: [24, 24] });

export function CommandMap({ sosAlerts = fallback.sosAlerts, teams = [], camps = [], userLocation, height = '520px' }) {
  const validSos = sosAlerts.filter((alert) => alert.location?.lat && alert.location?.lng);
  const center = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (validSos.length) return [validSos[0].location.lat, validSos[0].location.lng];
    if (teams.find((team) => team.location)) {
      const team = teams.find((item) => item.location);
      return [team.location.lat, team.location.lng];
    }
    if (camps.find((camp) => camp.location)) {
      const camp = camps.find((item) => item.location);
      return [camp.location.lat, camp.location.lng];
    }
    return [25.604, 85.137];
  }, [camps, teams, userLocation, validSos]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700" style={{ height }}>
      <MapContainer center={center} zoom={12} scrollWheelZoom>
        <RecenterMap center={center} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={[25.6, 85.14]} radius={3200} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.08 }} />
        <Circle center={[25.62, 85.12]} radius={2100} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.08 }} />
        {userLocation && (
          <Marker icon={adminIcon} position={[userLocation.lat, userLocation.lng]}>
            <Popup><strong>Your admin location</strong><br />Browser GPS position</Popup>
          </Marker>
        )}
        {validSos.map((alert) => (
          <Marker key={alert.id} icon={sosIcon} position={[alert.location.lat, alert.location.lng]}>
            <Popup>
              <strong>{alert.userName}</strong><br />
              {alert.alertType}<br />
              {alert.location.address}
            </Popup>
          </Marker>
        ))}
        {teams.map((team) => team.location && (
          <Marker key={team.id} icon={teamIcon} position={[team.location.lat, team.location.lng]}>
            <Popup><strong>{team.name}</strong><br />{team.status}</Popup>
          </Marker>
        ))}
        {camps.map((camp) => camp.location && (
          <Marker key={camp.id} icon={campIcon} position={[camp.location.lat, camp.location.lng]}>
            <Popup><strong>{camp.name}</strong><br />Occupancy {camp.occupancy}/{camp.capacity}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}
