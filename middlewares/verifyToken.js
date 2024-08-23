const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'default_secret';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers

  if (!token) {
    return res.status(403).json({ message: 'No token provided' }); // Changed to 403 (Forbidden) for clarity
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    req.user = decoded; // Save decoded user info to request object
    next();
  });
};

module.exports = verifyToken;
