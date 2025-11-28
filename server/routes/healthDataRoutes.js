import express from 'express';
import { pool } from '../db.js';
import authGuard from '../authGuard.js';


const router = express.Router();


router.post('/activity', authGuard, async (req, res) => {
  const { userId, weight, heightCm, water, steps, sleepHours } = req.body;

  if (!userId || !weight || !water || !steps || !sleepHours) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let bmi = null;
  const h = Number(heightCm);
  if (h && h > 0) {
    const meters = h / 100;
    bmi = Number((Number(weight) / (meters * meters)).toFixed(1));
  }

  try {
    // traits (weight / bmi / water / steps)
    await pool.query(
      `INSERT INTO traits (user_id, weight, bmi, water, daily_steps)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, weight, bmi, water, steps]
    );

    // sleep (hours)
    await pool.query(
      `INSERT INTO sleep (user_id, duration)
       VALUES (?, ?)`,
      [userId, sleepHours]
    );

    res.json({ message: 'Activity saved', bmi });
  } catch (err) {
    console.error('Error saving activity:', err);
    res
      .status(500)
      .json({ message: 'Database error while saving activity' });
  }
});

router.get('/user/:userId', authGuard, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    const [traitsRows] = await pool.query(
      `SELECT traits_id, weight, bmi, water, daily_steps
       FROM traits
       WHERE user_id = ?
       ORDER BY traits_id DESC
       LIMIT 7`,
      [userId]
    );

    const [sleepRows] = await pool.query(
      `SELECT sleep_id, duration
       FROM sleep
       WHERE user_id = ?
       ORDER BY sleep_id DESC
       LIMIT 7`,
      [userId]
    );

    res.json({
      traits: traitsRows,
      sleep: sleepRows,
    });
  } catch (err) {
    console.error('Error loading health data:', err);
    res
      .status(500)
      .json({ message: 'Database error while loading health data' });
  }
});

export default router;
