import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../db.js';
import authGuard from '../authGuard.js';

dotenv.config();
const router = express.Router();

const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,        
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
      [email, password_hash, name]
    );

    const user_id = result.insertId;
    const token = jwt.sign({ user_id, email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res
      .cookie('token', token, TOKEN_COOKIE_OPTIONS)
      .status(201)
      .json({
        message: 'Registered successfully',
        user: { user_id, email, display_name: name },
      });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT user_id, email, password_hash, display_name FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res
      .cookie('token', token, TOKEN_COOKIE_OPTIONS)
      .json({
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          email: user.email,
          display_name: user.display_name,
        },
      });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me  (check current user)
router.get('/me', authGuard, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

export default router;
