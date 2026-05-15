import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { authRouter } from './routes/auth.routes.js';
import { apiRouter } from './routes/api.routes.js';
import { ingestRouter } from './routes/ingest.routes.js';
import { errorHandler, notFound } from './middleware/error.js';
import { authenticateSocket } from './socket/auth.js';
import { startSimulationFeed } from './socket/simulationFeed.js';

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 8080);
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const io = new Server(server, {
  cors: { origin: clientOrigin, credentials: true }
});

app.set('io', io);
app.use(helmet());
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));
app.use(rateLimit({ windowMs: 60_000, limit: 240, standardHeaders: true, legacyHeaders: false }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'JeevanResQ Admin API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/ingest', ingestRouter);
app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);

io.use(authenticateSocket);
io.on('connection', (socket) => {
  socket.join(`role:${socket.user.role}`);
  socket.emit('system:connected', { message: 'Connected to JeevanResQ command stream' });
});

startSimulationFeed(io);

server.listen(port, () => {
  console.log(`JeevanResQ Admin API running on http://localhost:${port}`);
});

