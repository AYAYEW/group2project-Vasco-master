import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        email: user.email,
        displayName: user.display_name || null,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
}
