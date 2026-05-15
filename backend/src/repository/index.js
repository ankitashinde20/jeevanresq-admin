import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const now = () => new Date().toISOString();
const passwordHash = bcrypt.hashSync('Jeevan@123', 10);

const db = {
  admins: [
    { id: 'adm-1', username: 'superadmin', passwordHash, role: 'SUPER_ADMIN', name: 'National Control Room', district: 'All India' },
    { id: 'adm-2', username: 'districtadmin', passwordHash, role: 'DISTRICT_ADMIN', name: 'District Admin', district: 'Patna' },
    { id: 'adm-3', username: 'operator', passwordHash, role: 'EMERGENCY_OPERATOR', name: 'Emergency Operator', district: 'Patna' }
  ],
  sosAlerts: [
    { id: 'sos-1001', userName: 'Aarav Kumar', phone: '+91 90000 10001', location: { lat: 25.5941, lng: 85.1376, address: 'Gandhi Maidan, Patna' }, timestamp: now(), alertType: 'Flood Rescue', severity: 'CRITICAL', activatedMode: 'Shake SOS', batteryLevel: 18, nearbyHazards: ['Flood zone', 'Power outage'], status: 'NEW' },
    { id: 'sos-1002', userName: 'Nisha Verma', phone: '+91 90000 10002', location: { lat: 25.61, lng: 85.12, address: 'Rajendra Nagar, Patna' }, timestamp: now(), alertType: 'Medical', severity: 'HIGH', activatedMode: 'Voice SOS', batteryLevel: 42, nearbyHazards: ['Blocked road'], status: 'ASSIGNED' }
  ],
  missingPersons: [
    { id: 'mp-1', type: 'MISSING', name: 'Rohan Singh', age: 9, gender: 'Male', photoUrl: '', lastSeenLocation: 'Kankarbagh Shelter Gate', medicalCondition: 'Asthma', familyContact: '+91 90000 20001', identificationMarks: 'Mole near left eyebrow', status: 'SEARCHING', location: { lat: 25.6004, lng: 85.1549 } },
    { id: 'mp-2', type: 'FOUND', name: 'Unknown elderly woman', age: 68, gender: 'Female', photoUrl: '', lastSeenLocation: 'PMCH Relief Desk', medicalCondition: 'Disoriented', familyContact: 'Unknown', identificationMarks: 'Red shawl, silver bracelet', status: 'FOUND', location: { lat: 25.6207, lng: 85.1442 } }
  ],
  resourceRequests: [
    { id: 'rr-1', requester: 'Camp Boring Road', category: 'Water', quantity: 1200, unit: 'litres', priority: 'HIGH', status: 'PENDING', deliveryStatus: 'Awaiting approval', location: { lat: 25.617, lng: 85.11 } },
    { id: 'rr-2', requester: 'Ward 14 Citizen Group', category: 'Medicines', quantity: 45, unit: 'kits', priority: 'CRITICAL', status: 'APPROVED', deliveryStatus: 'In transit', location: { lat: 25.58, lng: 85.16 } }
  ],
  calls: [
    { id: 'call-1', callerName: 'Imran Ali', phone: '+91 90000 30001', status: 'IN_PROGRESS', incidentType: 'Trapped family', operatorNotes: 'Needs boat rescue near bridge', recordingUrl: '', ticketId: 'TKT-7451', timestamp: now() }
  ],
  teams: [
    { id: 'team-1', name: 'Rescue Alpha', leader: 'Inspector Kavita Rao', members: 8, vehicle: 'Boat-02', medicalKits: 4, status: 'EN_ROUTE', missionId: 'mission-1', location: { lat: 25.604, lng: 85.13 } },
    { id: 'team-2', name: 'Medical Bravo', leader: 'Dr. Sameer Khan', members: 5, vehicle: 'Ambulance-11', medicalKits: 12, status: 'ACTIVE_RESCUE', missionId: 'mission-2', location: { lat: 25.61, lng: 85.145 } }
  ],
  camps: [
    { id: 'camp-1', name: 'Patna College Relief Camp', admin: 'Ritu Sharma', capacity: 850, occupancy: 612, bedsAvailable: 91, waterStatus: 'LOW', electricityStatus: 'STABLE', foodStock: 2, medicalSupport: 'Doctor on site', demographics: { children: 142, women: 251, elderly: 67 }, location: { lat: 25.621, lng: 85.151 } }
  ],
  volunteers: [],
  ngos: [],
  rationLogs: [
    { id: 'ration-1', campId: 'camp-1', campName: 'Patna College Relief Camp', rice: 220, wheat: 160, water: 2400, milk: 180, babyFood: 45, medicines: 30, status: 'GRANTED', createdAt: now() }
  ],
  campEvents: [
    { id: 'camp-event-1', entityType: 'persons', entityId: 1, action: 'seed', title: 'Seed camp citizen registered', payload: { name: 'Asha Devi', camp_name: 'Camp Shakti' }, source: 'camp-management', createdAt: now() }
  ],
  notifications: [
    { id: 'noti-1', title: 'Evacuation warning', message: 'Move to nearest relief camp above flood level.', channel: 'Push', severity: 'HIGH', createdAt: now() }
  ],
  activityLogs: [
    { id: 'log-1', actor: 'system', action: 'Dashboard initialized', target: 'command-center', timestamp: now() }
  ],
  inventory: [
    { id: 'inv-1', item: 'Rice', category: 'Food', available: 8200, reserved: 650, unit: 'kg' },
    { id: 'inv-2', item: 'Water', category: 'Water', available: 18400, reserved: 2100, unit: 'litres' },
    { id: 'inv-3', item: 'Medical kits', category: 'Medicines', available: 430, reserved: 82, unit: 'kits' },
    { id: 'inv-4', item: 'Tents', category: 'Shelter', available: 210, reserved: 37, unit: 'units' }
  ]
};

function addLog(actor, action, target) {
  db.activityLogs.unshift({ id: uuid(), actor, action, target, timestamp: now() });
}

function collection(name) {
  return {
    list: () => db[name],
    get: (id) => db[name].find((item) => item.id === id),
    create: (payload) => {
      const item = { id: uuid(), ...payload, createdAt: payload.createdAt || now() };
      db[name].unshift(item);
      return item;
    },
    update: (id, payload) => {
      const index = db[name].findIndex((item) => item.id === id);
      if (index < 0) return null;
      db[name][index] = { ...db[name][index], ...payload, updatedAt: now() };
      return db[name][index];
    }
  };
}

export const repository = {
  admins: {
    list: () => db.admins.map(({ passwordHash: _passwordHash, ...admin }) => admin),
    findByUsername: (username) => db.admins.find((admin) => admin.username === username),
    findById: (id) => db.admins.find((admin) => admin.id === id)
  },
  sosAlerts: collection('sosAlerts'),
  missingPersons: collection('missingPersons'),
  resourceRequests: collection('resourceRequests'),
  calls: collection('calls'),
  teams: collection('teams'),
  camps: collection('camps'),
  volunteers: collection('volunteers'),
  ngos: collection('ngos'),
  rationLogs: collection('rationLogs'),
  campEvents: collection('campEvents'),
  notifications: collection('notifications'),
  inventory: collection('inventory'),
  logs: { list: () => db.activityLogs, add: addLog },
  analytics: {
    snapshot: () => ({
      totalSos: db.sosAlerts.length,
      activeEmergencies: db.sosAlerts.filter((item) => !['RESOLVED', 'CLOSED'].includes(item.status)).length,
      rescuesCompleted: 128,
      missingPersons: db.missingPersons.filter((item) => item.status !== 'REUNITED').length,
      campOccupancy: Math.round(db.camps.reduce((sum, camp) => sum + camp.occupancy / camp.capacity, 0) / db.camps.length * 100),
      resourceRequests: db.resourceRequests.length,
      teamsActive: db.teams.filter((team) => team.status !== 'COMPLETED').length,
      rationStockDays: Math.min(...db.camps.map((camp) => camp.foodStock))
    })
  }
};
