const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});

// Public routes
router.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
  ],
  validate,
  authController.signup
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  validate,
  authController.login
);

router.post(
  '/refresh-token',
  [check('refreshToken', 'Refresh token is required').not().isEmpty()],
  validate,
  authController.refreshToken
);

router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  validate,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [
    check('token', 'Token is required').not().isEmpty(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
  ],
  validate,
  authController.resetPassword
);

// Protected routes (require authentication)
router.use(authMiddleware.protect);

router.get('/me', authController.getMe);
router.put('/update-details', authController.updateDetails);
router.put('/update-password', authController.updatePassword);
router.post('/logout', authController.logout);

// Email verification
router.post(
  '/send-verification-email',
  authController.sendVerificationEmail
);

router.post(
  '/verify-email',
  [check('token', 'Verification token is required').not().isEmpty()],
  validate,
  authController.verifyEmail
);

// OTP verification
router.post(
  '/send-otp',
  [check('email', 'Please include a valid email').isEmail()],
  validate,
  authController.sendOTP
);

router.post(
  '/verify-otp',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'OTP is required').not().isEmpty(),
  ],
  validate,
  authController.verifyOTP
);

// Admin routes
router.use(authMiddleware.authorize('admin'));

router.get('/users', authController.getUsers);
router.get('/users/:id', authController.getUser);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
