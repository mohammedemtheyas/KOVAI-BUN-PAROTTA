import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { seedDatabase } from '../seed.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kovai_secret';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const inputUser = (username || '').toLowerCase().trim();

    // Accept username 'admin' or email 'admin@kovaibunparotta.com'
    if (inputUser === 'admin' || inputUser === 'admin@kovaibunparotta.com') {
      const user = await User.findOne({ username: 'admin' });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch || password === 'demo123') {
          const token = jwt.sign(
            { id: user._id, username: user.username, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          return res.json({
            token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username
            }
          });
        }
      }
    }

    return res.status(401).json({ error: 'Invalid username or password. Use: admin / demo123' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/auth/seed
router.post('/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ message: 'Database reset & seeded with 100 historical bills and Kovai Bun Parotta data successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
