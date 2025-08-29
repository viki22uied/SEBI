const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');
const config = require('../../config/config');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT.SECRET);

    // Get user from the token
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash', 'verification_token', 'verification_expires'] },
    });

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if user is active
    if (req.user.status === 'inactive') {
      return next(new ErrorResponse('User account is inactive', 401));
    }

    next();
  } catch (err) {
    logger.error(`Authentication error: ${err.message}`, { error: err });
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Check if user is the owner of the resource or admin
exports.checkOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    // Skip if user is admin
    if (req.user.role === 'admin') {
      return next();
    }

    try {
      const resource = await model.findByPk(req.params[paramName]);

      if (!resource) {
        return next(
          new ErrorResponse(
            `Resource not found with id of ${req.params[paramName]}`,
            404
          )
        );
      }

      // Check if user owns the resource
      if (resource.user_id !== req.user.id) {
        return next(
          new ErrorResponse(
            `User ${req.user.id} is not authorized to update this resource`,
            401
          )
        );
      }

      next();
    } catch (error) {
      logger.error(`Ownership check error: ${error.message}`, { error });
      next(error);
    }
  };
};

// Rate limiting middleware (Redis v4)
exports.rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const key = `rate-limit:${ip}`;

      // Initialize with expiry if not exists
      const exists = await req.redisClient.exists(key);
      if (!exists) {
        await req.redisClient.set(key, '0', { EX: Math.ceil(windowMs / 1000) });
      }

      const current = await req.redisClient.incr(key);
      const ttl = await req.redisClient.ttl(key);
      const remaining = Math.max(0, max - current);

      res.set({
        'X-RateLimit-Limit': max,
        'X-RateLimit-Remaining': remaining,
        'X-RateLimit-Reset': Math.floor(Date.now() / 1000) + (ttl > 0 ? ttl : Math.ceil(windowMs / 1000)),
      });

      if (current > max) {
        const retryAfter = ttl > 0 ? ttl : Math.ceil(windowMs / 1000);
        res.set('Retry-After', retryAfter);
        return next(new ErrorResponse(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`, 429));
      }

      next();
    } catch (err) {
      logger.error('Redis error in rate limiting:', err);
      next();
    }
  };
};

// Request validation middleware
exports.validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message.replace(/['"]/g, ''),
      }));

      return next(
        new ErrorResponse('Validation failed', 400, {
          errors,
        })
      );
    }

    next();
  };
};

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Log to file in production
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack,
    error: err,
  });

  // Handle specific error types
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired';
    error = new ErrorResponse(message, 401);
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    ...(error.errors && { errors: error.errors }),
  });
};

// Async handler to avoid try/catch blocks in controllers
exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Not found middleware
exports.notFound = (req, res, next) => {
  next(new ErrorResponse(`Not Found - ${req.originalUrl}`, 404));
};
