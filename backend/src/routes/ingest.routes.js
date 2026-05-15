import express from 'express';
import { z } from 'zod';
import { repository } from '../repository/index.js';

export const ingestRouter = express.Router();

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional()
});

ingestRouter.post('/sos', (req, res) => {
  const schema = z.object({
    userName: z.string(),
    phone: z.string().optional(),
    location: locationSchema,
    alertType: z.string(),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('HIGH'),
    activatedMode: z.string(),
    batteryLevel: z.number().min(0).max(100).optional(),
    nearbyHazards: z.array(z.string()).default([])
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid SOS payload', details: parsed.error.flatten() });
  const alert = repository.sosAlerts.create({ ...parsed.data, timestamp: new Date().toISOString(), status: 'NEW' });
  repository.logs.add('mobile-app', 'SOS alert received', alert.id);
  req.app.get('io').emit('sos:new', alert);
  res.status(201).json(alert);
});

ingestRouter.post('/missing-person', (req, res) => {
  const report = repository.missingPersons.create({ ...req.body, status: req.body.status || 'SEARCHING' });
  repository.logs.add('mobile-app', 'Missing/found person report received', report.id);
  req.app.get('io').emit('missing:new', report);
  res.status(201).json(report);
});

ingestRouter.post('/resource-request', (req, res) => {
  const request = repository.resourceRequests.create({ ...req.body, status: 'PENDING', deliveryStatus: 'Awaiting approval' });
  repository.logs.add('mobile-app', 'Resource request received', request.id);
  req.app.get('io').emit('resource:new', request);
  res.status(201).json(request);
});

ingestRouter.post('/emergency-call', (req, res) => {
  const call = repository.calls.create({ ...req.body, status: 'QUEUED', ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}` });
  repository.logs.add('call-gateway', 'Emergency call ticket created', call.ticketId);
  req.app.get('io').emit('call:new', call);
  res.status(201).json(call);
});

ingestRouter.post('/location', (req, res) => {
  req.app.get('io').emit('location:update', req.body);
  res.status(202).json({ accepted: true });
});

ingestRouter.post('/camp-sync', (req, res) => {
  const schema = z.object({
    entityType: z.string(),
    entityId: z.number(),
    action: z.string(),
    payload: z.record(z.any()).default({}),
    source: z.string().default('flutter-camp-management'),
    createdAt: z.string().optional()
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid camp sync payload', details: parsed.error.flatten() });
  }

  const { entityType, entityId, action, payload, source, createdAt } = parsed.data;
  const event = repository.campEvents.create({
    entityType,
    entityId,
    action,
    payload,
    source,
    title: campEventTitle(entityType, payload),
    createdAt: createdAt || new Date().toISOString()
  });

  if (entityType === 'logistics_requests' || entityType === 'requests') {
    const request = repository.resourceRequests.create({
      requester: payload.requested_by ? `Camp user ${payload.requested_by}` : 'Camp Management',
      category: payload.item_name || payload.request_type || 'Camp request',
      quantity: Number.parseInt(payload.quantity, 10) || 1,
      unit: 'units',
      priority: 'HIGH',
      status: 'PENDING',
      deliveryStatus: 'Received from camp management',
      notes: payload.notes || '',
      location: { lat: 25.5941, lng: 85.1376 }
    });
    req.app.get('io').emit('resource:new', request);
  }

  if (entityType === 'ration_logs') {
    const ration = repository.rationLogs.create({
      campId: payload.family_id ? `family-${payload.family_id}` : 'camp-management',
      campName: 'Camp Management',
      rice: payload.quantity || 0,
      wheat: 0,
      water: 0,
      milk: 0,
      babyFood: 0,
      medicines: 0,
      status: payload.status || 'DISTRIBUTED'
    });
    req.app.get('io').emit('ration:new', ration);
  }

  repository.logs.add(source, `Camp sync: ${entityType}`, String(entityId));
  req.app.get('io').emit('camp:event', event);
  res.status(201).json(event);
});

function campEventTitle(entityType, payload) {
  if (entityType === 'persons') return `Citizen registered: ${payload.name || 'Unknown'}`;
  if (entityType === 'families') return `Family record updated: ${payload.family_code || 'Unknown'}`;
  if (entityType === 'health_records') return `Health record added for person ${payload.person_id || ''}`.trim();
  if (entityType === 'ration_logs') return `Ration ${payload.status || 'updated'}: ${payload.quantity || ''}`.trim();
  if (entityType === 'movement_logs') return `Movement: ${payload.from_location || ''} to ${payload.to_location || ''}`.trim();
  if (entityType === 'volunteer_registrations') return `Volunteer registered for event ${payload.event_id || ''}`.trim();
  if (entityType === 'donations') return `Donation received: ${payload.donation_type || 'Unknown'}`;
  if (entityType === 'requests' || entityType === 'logistics_requests') return `Camp request: ${payload.item_name || payload.request_type || 'Resource'}`;
  return `Camp event: ${entityType}`;
}
