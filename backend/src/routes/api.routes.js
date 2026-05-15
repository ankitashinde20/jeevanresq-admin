import express from 'express';
import bcrypt from 'bcryptjs';
import { requireAuth, allowRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { repository } from '../repository/index.js';

export const apiRouter = express.Router();
apiRouter.use(requireAuth);

apiRouter.get('/dashboard', (_req, res) => {
  res.json({
    stats: repository.analytics.snapshot(),
    sosAlerts: repository.sosAlerts.list().slice(0, 8),
    resourceRequests: repository.resourceRequests.list().slice(0, 8),
    calls: repository.calls.list().slice(0, 8),
    activityLogs: repository.logs.list().slice(0, 20)
  });
});

apiRouter.get('/analytics', (_req, res) => res.json(repository.analytics.snapshot()));
apiRouter.get('/sos', (_req, res) => res.json(repository.sosAlerts.list()));
apiRouter.patch('/sos/:id', (req, res) => updateAndBroadcast(req, res, 'sosAlerts', 'sos:update', 'SOS alert updated'));

apiRouter.get('/missing-persons', (_req, res) => res.json(repository.missingPersons.list()));
apiRouter.post('/missing-persons', upload.single('photo'), (req, res) => {
  const person = repository.missingPersons.create({ ...req.body, photoUrl: req.file ? `/uploads/${req.file.filename}` : req.body.photoUrl });
  req.app.get('io').emit('missing:new', person);
  res.status(201).json(person);
});
apiRouter.patch('/missing-persons/:id', (req, res) => updateAndBroadcast(req, res, 'missingPersons', 'missing:update', 'Missing person updated'));

apiRouter.get('/resources', (_req, res) => res.json({ requests: repository.resourceRequests.list(), inventory: repository.inventory.list() }));
apiRouter.patch('/resources/:id', (req, res) => updateAndBroadcast(req, res, 'resourceRequests', 'resource:update', 'Resource request updated'));

apiRouter.get('/calls', (_req, res) => res.json(repository.calls.list()));
apiRouter.patch('/calls/:id', (req, res) => updateAndBroadcast(req, res, 'calls', 'call:update', 'Emergency call updated'));

apiRouter.get('/teams', (_req, res) => res.json(repository.teams.list()));
apiRouter.post('/teams', allowRoles('SUPER_ADMIN', 'DISTRICT_ADMIN'), (req, res) => createAndBroadcast(req, res, 'teams', 'team:new', 'Rescue team created'));
apiRouter.patch('/teams/:id', (req, res) => updateAndBroadcast(req, res, 'teams', 'team:update', 'Rescue team updated'));

apiRouter.get('/camps', (_req, res) => res.json(repository.camps.list()));
apiRouter.post('/camps', allowRoles('SUPER_ADMIN', 'DISTRICT_ADMIN'), (req, res) => createAndBroadcast(req, res, 'camps', 'camp:new', 'Camp created'));
apiRouter.patch('/camps/:id', (req, res) => updateAndBroadcast(req, res, 'camps', 'camp:update', 'Camp updated'));
apiRouter.get('/camp-events', (_req, res) => res.json(repository.campEvents.list()));

apiRouter.get('/volunteers', (_req, res) => res.json(repository.volunteers.list()));
apiRouter.post('/volunteers', upload.array('documents', 5), (req, res) => {
  const username = `vol${Date.now().toString().slice(-6)}`;
  const plainPassword = Math.random().toString(36).slice(-10);
  const volunteer = repository.volunteers.create({
    ...req.body,
    documents: (req.files || []).map((file) => `/uploads/${file.filename}`),
    volunteerId: `JRV-${Date.now()}`,
    username,
    passwordHash: bcrypt.hashSync(plainPassword, 10),
    generatedPassword: plainPassword,
    verificationStatus: 'PENDING'
  });
  repository.logs.add(req.user.username, 'Volunteer credentials generated', volunteer.volunteerId);
  req.app.get('io').emit('volunteer:new', volunteer);
  res.status(201).json(volunteer);
});

apiRouter.get('/ngos', (_req, res) => res.json(repository.ngos.list()));
apiRouter.post('/ngos', upload.array('documents', 5), (req, res) => {
  const username = `ngo${Date.now().toString().slice(-6)}`;
  const plainPassword = Math.random().toString(36).slice(-10);
  const ngo = repository.ngos.create({
    ...req.body,
    documents: (req.files || []).map((file) => `/uploads/${file.filename}`),
    workerId: `JRN-${Date.now()}`,
    username,
    passwordHash: bcrypt.hashSync(plainPassword, 10),
    generatedPassword: plainPassword,
    verificationStatus: 'PENDING'
  });
  req.app.get('io').emit('ngo:new', ngo);
  res.status(201).json(ngo);
});

apiRouter.get('/ration', (_req, res) => res.json(repository.rationLogs.list()));
apiRouter.post('/ration', (req, res) => createAndBroadcast(req, res, 'rationLogs', 'ration:new', 'Ration granted'));

apiRouter.get('/notifications', (_req, res) => res.json(repository.notifications.list()));
apiRouter.post('/notifications', (req, res) => createAndBroadcast(req, res, 'notifications', 'notification:new', 'Notification broadcast'));

apiRouter.get('/activity-logs', (_req, res) => res.json(repository.logs.list()));

function createAndBroadcast(req, res, collection, event, action) {
  const item = repository[collection].create(req.body);
  repository.logs.add(req.user.username, action, item.id);
  req.app.get('io').emit(event, item);
  res.status(201).json(item);
}

function updateAndBroadcast(req, res, collection, event, action) {
  const item = repository[collection].update(req.params.id, req.body);
  if (!item) return res.status(404).json({ message: 'Record not found' });
  repository.logs.add(req.user.username, action, item.id);
  req.app.get('io').emit(event, item);
  res.json(item);
}
