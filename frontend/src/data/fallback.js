export const fallback = {
  stats: {
    totalSos: 2,
    activeEmergencies: 2,
    rescuesCompleted: 128,
    missingPersons: 2,
    campOccupancy: 72,
    resourceRequests: 2,
    teamsActive: 2,
    rationStockDays: 2
  },
  sosAlerts: [
    { id: 'sos-1001', userName: 'Aarav Kumar', phone: '+91 90000 10001', location: { lat: 25.5941, lng: 85.1376, address: 'Gandhi Maidan, Patna' }, timestamp: new Date().toISOString(), alertType: 'Flood Rescue', severity: 'CRITICAL', activatedMode: 'Shake SOS', batteryLevel: 18, nearbyHazards: ['Flood zone', 'Power outage'], status: 'NEW' },
    { id: 'sos-1002', userName: 'Nisha Verma', phone: '+91 90000 10002', location: { lat: 25.61, lng: 85.12, address: 'Rajendra Nagar, Patna' }, timestamp: new Date().toISOString(), alertType: 'Medical', severity: 'HIGH', activatedMode: 'Voice SOS', batteryLevel: 42, nearbyHazards: ['Blocked road'], status: 'ASSIGNED' }
  ],
  resourceRequests: [
    { id: 'rr-1', requester: 'Camp Boring Road', category: 'Water', quantity: 1200, unit: 'litres', priority: 'HIGH', status: 'PENDING', deliveryStatus: 'Awaiting approval' },
    { id: 'rr-2', requester: 'Ward 14 Citizen Group', category: 'Medicines', quantity: 45, unit: 'kits', priority: 'CRITICAL', status: 'APPROVED', deliveryStatus: 'In transit' }
  ],
  calls: [
    { id: 'call-1', callerName: 'Imran Ali', phone: '+91 90000 30001', status: 'IN_PROGRESS', incidentType: 'Trapped family', operatorNotes: 'Needs boat rescue near bridge', ticketId: 'TKT-7451' }
  ],
  activityLogs: [
    { id: 'log-1', actor: 'system', action: 'Dashboard initialized', target: 'command-center', timestamp: new Date().toISOString() }
  ]
};

