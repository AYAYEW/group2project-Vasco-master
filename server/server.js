import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import healthDataRoutes from './routes/healthDataRoutes.js';
import goalsRoutes from './routes/goalsRoutes.js';
import { pool } from './db.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthDataRoutes);
app.use('/api/goals', goalsRoutes);

// Health check WITH DB test
app.get('/api/status', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS test');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('DB health check failed:', err.message);
    res.status(500).json({ status: 'error', db: 'failed' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
