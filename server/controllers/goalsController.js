import express from 'express';
import { pool } from '../db.js';
import authGuard from '../authGuard.js';

const router = express.Router();

router.post('/', authGuard, async (req, res) => {
  const userId = req.user?.id;
  const {
    title,
    message,
    stepsGoal,
    weightGoal,
    waterGoal,
    sleepGoal,
    bmiGoal,
  } = req.body || {};

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    // steps_goal
    if (stepsGoal != null) {
      await pool.query(
        `
        INSERT INTO steps_goal (user_id, steps_goal_message, steps_goal, steps_goal_time)
        VALUES (?, ?, ?, NOW())
      `,
        [userId, message || null, stepsGoal,]
      );
    }

    // weight_goal
    if (weightGoal != null) {
      await pool.query(
        `
        INSERT INTO weight_goal (user_id, weight_goal_message, weight_goal, weight_goal_time)
        VALUES (?, ?, ?, NOW())
      `,
        [userId, message || null, weightGoal]
      );
    }

    // water_goal
    if (waterGoal != null) {
      await pool.query(
        `
        INSERT INTO water_goal (user_id, water_goal_message, water_goal, water_goal_time)
        VALUES (?, ?, ?, NOW())
      `,
        [userId, message || null, waterGoal]
      );
    }

    // sleep_goal
    if (sleepGoal != null) {
      await pool.query(
        `
        INSERT INTO sleep_goal (user_id, sleep_goal_message, duration_goal, sleep_goal_time)
        VALUES (?, ?, ?, NOW())
      `,
        [userId, message || null, sleepGoal]
      );
    }

    // bmi_goal
    if (bmiGoal != null) {
      await pool.query(
        `
        INSERT INTO bmi_goal (user_id, bmi_goal_message, bmi_goal, bmi_goal_time)
        VALUES (?, ?, ?, NOW())
      `,
        [userId, message || null, bmiGoal]
      );
    }

    res.json({ message: 'Goals saved' });
  } catch (err) {
    console.error('Error saving goals:', err);
    res.status(500).json({ message: 'Database error while saving goals' });
  }
});

// Progress: get latest goals for a user 
router.get('/user/:userId', authGuard, async (req, res) => {
  const { userId } = req.params;

  if (Number(userId) !== Number(req.user?.id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const [stepsGoal] = await pool.query(
      `
      SELECT * FROM steps_goal
      WHERE user_id = ?
      ORDER BY steps_goal_id DESC
      LIMIT 1
    `,
      [userId]
    );

    const [weightGoal] = await pool.query(
      `
      SELECT * FROM weight_goal
      WHERE user_id = ?
      ORDER BY weight_goal_id DESC
      LIMIT 1
    `,
      [userId]
    );

    const [waterGoal] = await pool.query(
      `
      SELECT * FROM water_goal
      WHERE user_id = ?
      ORDER BY water_goal_id DESC
      LIMIT 1
    `,
      [userId]
    );

    const [sleepGoal] = await pool.query(
      `
      SELECT * FROM sleep_goal
      WHERE user_id = ?
      ORDER BY sleep_goal_id DESC
      LIMIT 1
    `,
      [userId]
    );

    const [bmiGoal] = await pool.query(
      `
      SELECT * FROM bmi_goal
      WHERE user_id = ?
      ORDER BY bmi_goal_id DESC
      LIMIT 1
    `,
      [userId]
    );

    res.json({
      stepsGoal: stepsGoal[0] || null,
      weightGoal: weightGoal[0] || null,
      waterGoal: waterGoal[0] || null,
      sleepGoal: sleepGoal[0] || null,
      bmiGoal: bmiGoal[0] || null,
    });
  } catch (err) {
    console.error('Error loading goals:', err);
    res.status(500).json({ message: 'Database error while loading goals' });
  }
});

export default router;
