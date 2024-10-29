const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key'; // Store in environment variable for security

// Middleware to verify JWT
function auth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add the decoded token data to the request object
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
}

module.exports = auth;
