/**
 * Middleware to check if the authenticated user has the 'admin' role.
 * Must be used AFTER auth.middleware.js
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  next();
};

module.exports = adminMiddleware;
