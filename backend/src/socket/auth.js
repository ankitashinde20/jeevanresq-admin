import jwt from 'jsonwebtoken';
import { repository } from '../repository/index.js';

export function authenticateSocket(socket, next) {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Missing socket token'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const admin = repository.admins.findById(payload.sub);
    if (!admin) return next(new Error('Invalid socket user'));
    socket.user = { id: admin.id, role: admin.role, username: admin.username };
    return next();
  } catch {
    return next(new Error('Invalid socket token'));
  }
}

