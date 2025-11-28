import jwt from 'jsonwebtoken';


export default function authGuard(req, res, next) {
  const token = req.cookies.token;


  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
  id: decoded.user_id,
  email: decoded.email
};


    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
