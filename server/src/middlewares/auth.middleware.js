const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/token');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authenticated');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'Not authenticated');
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new ApiError(401, 'Token invalid or expired');
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
