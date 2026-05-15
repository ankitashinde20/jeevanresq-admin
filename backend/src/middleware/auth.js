import jwt from 'jsonwebtoken';
import { repository } from '../repository/index.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const admin = repository.admins.findById(payload.sub);
    if (!admin) return res.status(401).json({ message: 'Invalid session' });
    req.user = { id: admin.id, username: admin.username, role: admin.role, district: admin.district };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Insufficient permission' });
    return next();
  };
}

