const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');
const { verifyToken } = require('../middleware/authMiddleware');
const { registerRules, loginRules, validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

// Token generation helper
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// Cookie configurations
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // support localhost proxying / cross-site
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, registerRules, validate, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Create verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      name,
      email,
      password, // hashed automatically by pre-save hook
      phone,
      emailVerificationToken: verifyToken,
      emailVerificationExpiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verifyToken);

    // Generate JWT
    const token = generateToken({ id: user._id, role: user.role });

    res
      .status(201)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Account created. Please check your email/terminal to verify.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token (cookie)
 * @access  Public
 */
router.post('/login', authLimiter, loginRules, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user WITH password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    res
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

/**
 * @route   POST /api/auth/admin/login
 * @desc    Authenticate admin user & get token (cookie)
 * @access  Public (Admin only)
 */
router.post('/admin/login', authLimiter, loginRules, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Admin credentials invalid' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Admin credentials invalid' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ id: user._id, role: 'admin' });

    // 8 hour session for administrators
    res
      .cookie('token', token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 })
      .json({
        success: true,
        admin: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'admin'
        }
      });

  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Server error during admin login' });
  }
});

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address using token
 * @access  Public
 */
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token,
      emailVerificationExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token invalid or expired' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ success: false, message: 'Server error during email verification' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user details
 * @access  Private
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Fetch user detail error:', err);
    res.status(500).json({ success: false, message: 'Server error while loading user details' });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Log user out by clearing cookie
 * @access  Private
 */
router.post('/logout', verifyToken, (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })
    .json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
