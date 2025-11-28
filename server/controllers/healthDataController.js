import express from 'express';
import { pool } from '../db.js';
import authGuard from '../authGuard.js';

const router = express.Router();

// Simple health check
router.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/activity', authGuard, async (req, res) => {
  const userId = req.user?.id;
  const { weight, heightCm, water, steps, sleepHours } = req.body || {};

  if (!userId || !weight || !heightCm || !water || !steps || !sleepHours) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // calculate BMI (kg / m^2)
  let bmi = null;
  const h = Number(heightCm) / 100;
  if (h > 0) {
    bmi = Number((Number(weight) / (h * h)).toFixed(1));
  }

  try {
    // Save traits snapshot (weight, water, steps, bmi)
    await pool.query(
      `
      INSERT INTO traits (user_id, weight, bmi, water, daily_steps)
      VALUES (?, ?, ?, ?, ?)
    `,
      [userId, weight, bmi, water, steps]
    );

    // Save sleep info (duration in hours)
    await pool.query(
      `
      INSERT INTO sleep (user_id, duration)
      VALUES (?, ?)
    `,
      [userId, sleepHours]
    );

    res.json({ message: 'Activity saved', bmi });
  } catch (err) {
    console.error('Error saving activity:', err);
    res.status(500).json({ message: 'Database error while saving activity' });
  }
});

router.get('/user/:userId', authGuard, async (req, res) => {
  const { userId } = req.params;

  // only allow user to see their own data
  if (Number(userId) !== Number(req.user?.id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const [traitsRows] = await pool.query(
      `
      SELECT traits_id, weight, bmi, water, daily_steps, created_on
      FROM traits
      WHERE user_id = ?
      ORDER BY traits_id DESC
      LIMIT 7
    `,
      [userId]
    );

    const [sleepRows] = await pool.query(
      `
      SELECT sleep_id, duration, created_on
      FROM sleep
      WHERE user_id = ?
      ORDER BY sleep_id DESC
      LIMIT 7
    `,
      [userId]
    );

    res.json({
      traits: traitsRows,
      sleep: sleepRows,
    });
  } catch (err) {
    console.error('Error loading health data:', err);
    res.status(500).json({ message: 'Database error while loading health data' });
  }
});

export default router;
