const logger = require('../utils/logger');
const ErrorResponse = require('../utils/errorResponse');

// Centralized error handler
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Server Error';

  // Log structured error
  logger.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack,
    error: err,
  });

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.data && { data: err.data }),
  });
}

module.exports = { errorHandler };
