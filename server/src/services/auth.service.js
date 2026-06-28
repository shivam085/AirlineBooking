const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

class AuthService {
  async register(data) {
    const { firstName, lastName, email, password } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, 'Email already in use');
    }

    // Create user (password is hashed in the User model hook)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token to user in database
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    // Find user with password explicitly included
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(oldRefreshToken) {
    // Check if token exists in DB (revocation check)
    const user = await User.findOne({ where: { refreshToken: oldRefreshToken } });
    
    if (!user) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    // Verify token validity
    const { verifyRefreshToken } = require('../utils/token');
    const decoded = verifyRefreshToken(oldRefreshToken);
    if (!decoded || decoded.id !== user.id) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // Save new refresh token to db
    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}

module.exports = new AuthService();
