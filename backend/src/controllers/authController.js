const { User, OTP } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../../config/config');
const logger = require('../utils/logger');
const { sendEmail } = require('../services/emailService');
const { generateOTP } = require('../utils/helpers');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User already exists with this email' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password_hash: password, // Will be hashed by the model hook
      phone,
      role: 'investor', // Default role
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Save verification token to user
    await user.update({
      verification_token: verificationToken,
      verification_expires: new Date(verificationExpires),
    });

    // Send verification email
    const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email - SEBI Guardian AI',
      template: 'email-verification',
      context: {
        name: user.name,
        verificationUrl,
      },
    });

    // Generate JWT
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove sensitive data from response
    user.password_hash = undefined;
    user.verification_token = undefined;
    user.verification_expires = undefined;

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    logger.error(`Signup error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check if password is correct
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        error: 'Please verify your email address',
        requiresVerification: true,
      });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate JWT
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove sensitive data from response
    user.password_hash = undefined;

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash', 'verification_token', 'verification_expires'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/update-details
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if email is being updated and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: req.body.email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use',
        });
      }
      // If email is updated, mark as unverified
      fieldsToUpdate.is_verified = false;
    }

    await user.update(fieldsToUpdate);

    // Remove sensitive data from response
    user.password_hash = undefined;

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Update user details error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check current password
    const isMatch = await user.validatePassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Set new password (will be hashed by the model hook)
    user.password_hash = req.body.newPassword;
    await user.save();

    // Send password change notification email
    await sendEmail({
      to: user.email,
      subject: 'Password Changed - SEBI Guardian AI',
      template: 'password-changed',
      context: {
        name: user.name,
        timestamp: new Date().toLocaleString(),
        ipAddress: req.ip,
      },
    });

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    logger.error(`Update password error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token provided',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.JWT.REFRESH_SECRET);

    // Get user from the token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Generate new access token
    const token = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();

    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`, { error });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Refresh token expired',
      });
    }
    
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      // Don't reveal if the user doesn't exist
      return res.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save reset token to user
    await user.update({
      reset_password_token: resetToken,
      reset_password_expires: new Date(resetExpires),
    });

    // Send reset email
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - SEBI Guardian AI',
      template: 'password-reset',
      context: {
        name: user.name,
        resetUrl,
        expiresIn: '10 minutes',
      },
    });

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Find user by reset token
    const user = await User.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    // Set new password (will be hashed by the model hook)
    user.password_hash = password;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    // Send password changed notification
    await sendEmail({
      to: user.email,
      subject: 'Password Changed Successfully - SEBI Guardian AI',
      template: 'password-reset-success',
      context: {
        name: user.name,
        timestamp: new Date().toLocaleString(),
      },
    });

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Send email verification
// @route   POST /api/auth/send-verification-email
// @access  Private
exports.sendVerificationEmail = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified',
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Save verification token to user
    await user.update({
      verification_token: verificationToken,
      verification_expires: new Date(verificationExpires),
    });

    // Send verification email
    const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email - SEBI Guardian AI',
      template: 'email-verification',
      context: {
        name: user.name,
        verificationUrl,
      },
    });

    res.json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    logger.error(`Send verification email error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Find user by verification token
    const user = await User.findOne({
      where: {
        verification_token: token,
        verification_expires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token',
      });
    }

    // Mark user as verified
    user.is_verified = true;
    user.verification_token = null;
    user.verification_expires = null;
    await user.save();

    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: 'Welcome to SEBI Guardian AI',
      template: 'welcome',
      context: {
        name: user.name,
        loginUrl: `${config.FRONTEND_URL}/login`,
      },
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    logger.error(`Verify email error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res, next) => {
  try {
    const { email, purpose = 'login' } = req.body;
    
    // Generate OTP
    const otp = generateOTP(6);
    const expiresAt = new Date(Date.now() + config.OTP.EXPIRY);

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      expires_at: expiresAt,
      purpose,
    });

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: `Your OTP for ${purpose.replace('_', ' ')} - SEBI Guardian AI`,
      template: 'otp',
      context: {
        otp,
        purpose: purpose.replace('_', ' '),
        expiresIn: '10 minutes',
      },
    });

    res.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    logger.error(`Send OTP error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, purpose = 'login' } = req.body;
    
    // Find the most recent OTP for this email and purpose
    const otpRecord = await OTP.findOne({
      where: {
        email,
        otp,
        purpose,
        is_used: false,
        expires_at: { [Op.gt]: new Date() },
      },
      order: [['created_at', 'DESC']],
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP',
      });
    }

    // Mark OTP as used
    await otpRecord.update({ is_used: true });

    // If this is for login, generate auth tokens
    if (purpose === 'login') {
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Update last login
      await user.update({ last_login: new Date() });

      // Generate tokens
      const token = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      // Set refresh token in cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          is_verified: user.is_verified,
        },
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    logger.error(`Verify OTP error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash', 'verification_token', 'verification_expires'] },
    });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    logger.error(`Get users error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Get single user (Admin only)
// @route   GET /api/auth/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash', 'verification_token', 'verification_expires'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User not found with id of ${req.params.id}`,
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Get user error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User not found with id of ${req.params.id}`,
      });
    }

    // Update user
    const { name, email, role, is_verified } = req.body;
    
    // Check if email is being updated and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use',
        });
      }
    }

    // Update user fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (is_verified !== undefined) updateData.is_verified = is_verified;

    await user.update(updateData);

    // Remove sensitive data from response
    user.password_hash = undefined;
    user.verification_token = undefined;
    user.verification_expires = undefined;

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Update user error: ${error.message}`, { error });
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User not found with id of ${req.params.id}`,
      });
    }

    // Prevent deleting own account
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account',
      });
    }

    await user.destroy();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error(`Delete user error: ${error.message}`, { error });
    next(error);
  }
};
