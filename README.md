# JeevanResQ Admin Command Center

Separate production-ready web admin dashboard for the JeevanResQ disaster management Flutter app.

## Stack

- Frontend: React + Vite + Tailwind CSS + React Router + Axios + Leaflet/OpenStreetMap
- Backend: Node.js + Express + Socket.IO + JWT + bcrypt + rate limiting
- Database: Firestore-ready repository layer with an in-memory/free local adapter for development
- Hosting: Vercel frontend, Render/Railway backend

## Quick Start

Backend:

```bash
cd admin-web/backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd admin-web/frontend
npm install
cp .env.example .env
npm run dev
```

Demo login:

- Username: `superadmin`
- Password: `Jeevan@123`

## Mobile App Integration

Point the Flutter app API base URL to the backend:

- REST: `http://localhost:8080/api`
- Socket.IO: `http://localhost:8080`

Important ingestion endpoints:

- `POST /api/ingest/sos`
- `POST /api/ingest/missing-person`
- `POST /api/ingest/resource-request`
- `POST /api/ingest/emergency-call`
- `POST /api/ingest/location`

Every event emitted by the app is persisted through the repository layer and broadcast to the admin dashboard using Socket.IO.

## Production Notes

1. Replace `JWT_SECRET` in production.
2. Set `DATABASE_DRIVER=firestore` and provide Firebase Admin credentials.
3. Configure CORS with the deployed Vercel URL.
4. Use HTTPS only.
5. Store uploaded identity documents in Firebase Storage or S3-compatible storage.
6. Enable SMS/email providers in the notification service.

