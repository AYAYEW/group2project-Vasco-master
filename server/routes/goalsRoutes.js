import express from 'express';
import { pool } from '../db.js';
import authGuard from '../authGuard.js';

const router = express.Router();

router.post('/weekly', authGuard, async (req, res) => {
  const userId = req.user.id; // from authGuard
  const {
    title,         
    message,
    stepsGoal,
    weightGoal,
    waterGoal,
    sleepGoal,
    bmiGoal,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  const msg = message || title || null;

  try {
    if (stepsGoal !== undefined && stepsGoal !== '') {
      await pool.query(
        `INSERT INTO steps_goal (user_id, steps_goal_message, steps_goal, steps_goal_time)
         VALUES (?, ?, ?, CURDATE())`,
        [userId, msg, stepsGoal]
      );
    }

    if (weightGoal !== undefined && weightGoal !== '') {
      await pool.query(
        `INSERT INTO weight_goal (user_id, weight_goal_message, weight_goal, weight_goal_time)
         VALUES (?, ?, ?, CURDATE())`,
        [userId, msg, weightGoal]
      );
    }

    if (waterGoal !== undefined && waterGoal !== '') {
      await pool.query(
        `INSERT INTO water_goal (user_id, water_goal_message, water_goal, water_goal_time)
         VALUES (?, ?, ?, CURDATE())`,
        [userId, msg, waterGoal]
      );
    }

    if (sleepGoal !== undefined && sleepGoal !== '') {
      await pool.query(
        `INSERT INTO sleep_goal (user_id, sleep_goal_message, duration_goal, sleep_goal_time)
         VALUES (?, ?, ?, CURDATE())`,
        [userId, msg, sleepGoal]
      );
    }

    if (bmiGoal !== undefined && bmiGoal !== '') {
      await pool.query(
        `INSERT INTO bmi_goal (user_id, bmi_goal_message, bmi_goal, bmi_goal_time)
         VALUES (?, ?, ?, CURDATE())`,
        [userId, msg, bmiGoal]
      );
    }

    res.json({ message: 'Goals saved' });
  } catch (err) {
    console.error('Error saving goals:', err);
    res
      .status(500)
      .json({ message: 'Database error while saving goals' });
  }
});

router.get('/user/:userId', authGuard, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    const [stepsRows] = await pool.query(
      `SELECT * FROM steps_goal
       WHERE user_id = ?
       ORDER BY steps_goal_id DESC
       LIMIT 1`,
      [userId]
    );

    const [weightRows] = await pool.query(
      `SELECT * FROM weight_goal
       WHERE user_id = ?
       ORDER BY weight_goal_id DESC
       LIMIT 1`,
      [userId]
    );

    const [waterRows] = await pool.query(
      `SELECT * FROM water_goal
       WHERE user_id = ?
       ORDER BY water_goal_id DESC
       LIMIT 1`,
      [userId]
    );

    const [sleepRows] = await pool.query(
      `SELECT * FROM sleep_goal
       WHERE user_id = ?
       ORDER BY sleep_goal_id DESC
       LIMIT 1`,
      [userId]
    );

    const [bmiRows] = await pool.query(
      `SELECT * FROM bmi_goal
       WHERE user_id = ?
       ORDER BY bmi_goal_id DESC
       LIMIT 1`,
      [userId]
    );

    res.json({
      steps: stepsRows[0] || null,
      weight: weightRows[0] || null,
      water: waterRows[0] || null,
      sleep: sleepRows[0] || null,
      bmi: bmiRows[0] || null,
    });
  } catch (err) {
    console.error('Error loading goals:', err);
    res
      .status(500)
      .json({ message: 'Database error while loading goals' });
  }
});

export default router;
