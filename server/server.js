import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isConnected } from './config/db.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed.js';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import salesRoutes from './routes/salesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sales', salesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'KOVAI BUN PAROTTA POS API Operational', isConnected });
});

// Boot Server
const startServer = async () => {
  try {
    await connectDB();

    if (isConnected) {
      try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log('[Server] Database empty. Seeding...');
          await seedDatabase();
        }
      } catch (e) {
        console.warn('[Server] DB query warning:', e.message);
      }
    }
  } catch (err) {
    console.error('[Server Error]', err);
  } finally {
    app.listen(PORT, () => {
      console.log(`🚀 [Server] KOVAI BUN PAROTTA API running on http://localhost:${PORT}`);
    });
  }
};

startServer();
