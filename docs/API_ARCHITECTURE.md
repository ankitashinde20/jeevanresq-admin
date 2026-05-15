# API Architecture

## Authentication

- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`

JWT payload:

```json
{
  "sub": "admin-id",
  "role": "SUPER_ADMIN"
}
```

## Mobile App Ingestion

These routes receive all events from the Flutter app and immediately redirect them into the admin dashboard through Socket.IO.

- `POST /api/ingest/sos`
- `POST /api/ingest/missing-person`
- `POST /api/ingest/resource-request`
- `POST /api/ingest/emergency-call`
- `POST /api/ingest/location`

## Admin Modules

- `GET /api/dashboard`
- `GET /api/analytics`
- `GET /api/sos`
- `PATCH /api/sos/:id`
- `GET /api/missing-persons`
- `POST /api/missing-persons`
- `PATCH /api/missing-persons/:id`
- `GET /api/resources`
- `PATCH /api/resources/:id`
- `GET /api/calls`
- `PATCH /api/calls/:id`
- `GET /api/teams`
- `POST /api/teams`
- `PATCH /api/teams/:id`
- `GET /api/camps`
- `POST /api/camps`
- `PATCH /api/camps/:id`
- `GET /api/volunteers`
- `POST /api/volunteers`
- `GET /api/ngos`
- `POST /api/ngos`
- `GET /api/ration`
- `POST /api/ration`
- `GET /api/notifications`
- `POST /api/notifications`
- `GET /api/activity-logs`

## Socket.IO Events

Server emits:

- `sos:new`
- `sos:update`
- `missing:new`
- `missing:update`
- `resource:new`
- `resource:update`
- `call:new`
- `call:update`
- `team:new`
- `team:update`
- `camp:new`
- `camp:update`
- `volunteer:new`
- `ngo:new`
- `ration:new`
- `notification:new`
- `location:update`
- `analytics:update`

## Security Middleware

- Helmet security headers
- CORS restricted by `CLIENT_ORIGIN`
- Rate limiting
- JWT validation
- Role authorization
- zod validation on high-risk ingestion endpoints
- Secure upload type and size filtering
- Audit log writes for all admin actions

