import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { repository } from '../repository/index.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = express.Router();

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

authRouter.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid login request' });

  const admin = repository.admins.findByUsername(parsed.data.username);
  if (!admin || !bcrypt.compareSync(parsed.data.password, admin.passwordHash)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { sub: admin.id, role: admin.role },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  repository.logs.add(admin.username, 'Logged in', 'admin-session');
  res.json({
    token,
    user: { id: admin.id, username: admin.username, name: admin.name, role: admin.role, district: admin.district }
  });
});

authRouter.post('/forgot-password', (req, res) => {
  repository.logs.add(req.body?.username || 'unknown', 'Password reset requested', 'admin-account');
  res.json({ message: 'If the account exists, a reset workflow has been triggered.' });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

