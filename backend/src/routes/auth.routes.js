import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const ADMIN_USER = {
  id: 'super-admin',
  username: 'superadmin',
  password: 'Jeevan@123',
  role: 'super_admin',
  name: 'JeevanResQ Super Admin',
};

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username !== ADMIN_USER.username ||
      password !== ADMIN_USER.password
    ) {
      return res.status(401).json({
        message: 'Invalid username or password',
      });
    }

    const token = jwt.sign(
      {
        id: ADMIN_USER.id,
        username: ADMIN_USER.username,
        role: ADMIN_USER.role,
      },
      process.env.JWT_SECRET || 'jeevanresq-secret',
      {
        expiresIn: '7d',
      },
    );

    return res.json({
      token,
      user: {
        id: ADMIN_USER.id,
        username: ADMIN_USER.username,
        role: ADMIN_USER.role,
        name: ADMIN_USER.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  return res.json({
    message: 'Password reset request received',
  });
});

export const authRouter = router;