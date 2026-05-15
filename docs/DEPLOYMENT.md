# Deployment Instructions

## Backend on Render or Railway

1. Create a new Node.js service.
2. Root directory: `admin-web/backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add environment variables:
   - `PORT`
   - `CLIENT_ORIGIN=https://your-vercel-domain.vercel.app`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=8h`
   - `DATABASE_DRIVER=firestore`
   - Firebase service credentials when enabling Firestore.
6. Enable persistent storage or external object storage for uploads.

Current demo mode uses `DATABASE_DRIVER=memory`, which is fine for live demonstration but resets when the backend restarts. For a real production deployment, connect Firestore or MongoDB Atlas and replace the repository adapter.

## Frontend on Vercel

1. Import the repository in Vercel.
2. Root directory: `admin-web/frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-backend.onrender.com`

## Flutter App Integration

Configure the Flutter app to send events to:

- `POST /api/ingest/sos` for SOS button, shake SOS, voice SOS, and other activated modes.
- `POST /api/ingest/missing-person` for missing/found reports.
- `POST /api/ingest/resource-request` for citizen or camp requests.
- `POST /api/ingest/emergency-call` for call center tickets.
- `POST /api/ingest/location` for live location tracking.

## Free Services

- Maps: Leaflet + OpenStreetMap.
- Database: Firebase Firestore free tier or MongoDB Atlas free tier.
- Frontend: Vercel free tier.
- Backend: Render/Railway free tier, subject to current platform limits.
