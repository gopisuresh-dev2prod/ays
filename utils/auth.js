const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// JWT token generation
exports.generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};


// JWT token verification
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};