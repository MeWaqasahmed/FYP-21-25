const User = require('../models/User.model');
const Subscription = require('../models/Subscription.model');
const generateToken = require('../utils/generateToken');
const apiResponse = require('../utils/apiResponse');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/email.service');
const crypto = require('crypto');

/**
 * Register new influencer
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return apiResponse(res, 409, false, null, 'User with this email or username already exists');
    }

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password,
      role: 'influencer',
    });

    // Create free subscription
    await Subscription.create({
      user: user._id,
      plan: 'free',
      status: 'active',
    });

    // Send welcome email
    sendWelcomeEmail(email, name);

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return apiResponse(res, 201, true, {
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    }, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return apiResponse(res, 401, false, null, 'Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      return apiResponse(res, 403, false, null, 'Account is suspended');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return apiResponse(res, 401, false, null, 'Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return apiResponse(res, 200, true, {
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return apiResponse(res, 404, false, null, 'User not found');
    }

    return apiResponse(res, 200, true, { user });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PATCH /api/auth/me
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, socialLinks, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(socialLinks && { socialLinks }),
        ...(avatar && { avatar }),
      },
      { new: true, runValidators: true }
    ).select('-password');

    return apiResponse(res, 200, true, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password - send reset email
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return apiResponse(res, 200, true, null, 'If email exists, reset link has been sent');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    sendPasswordResetEmail(email, resetToken);

    return apiResponse(res, 200, true, null, 'If email exists, reset link has been sent');
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password/:token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token to compare
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return apiResponse(res, 400, false, null, 'Invalid or expired reset token');
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return apiResponse(res, 200, true, null, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout (client-side token removal)
 * POST /api/auth/logout
 */
exports.logout = async (req, res, next) => {
  try {
    return apiResponse(res, 200, true, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};
