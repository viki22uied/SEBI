const winston = require('winston');
const { combine, timestamp, printf, colorize, json } = winston.format;
const path = require('path');
const fs = require('fs');
const config = require('../../config/config');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
  
  // Add stack trace if it exists
  if (stack) {
    log += `\n${stack}`;
  }
  
  // Add metadata if it exists
  if (Object.keys(meta).length > 0) {
    log += `\n${JSON.stringify(meta, null, 2)}`;
  }
  
  return log;
});

// Create console transport for development
const consoleTransport = new winston.transports.Console({
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  level: 'debug', // Log everything to console in development
});

// Create file transports
const fileTransports = [
  // Error logs
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: combine(
      timestamp(),
      json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  // Combined logs
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: combine(
      timestamp(),
      json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'sebi-guardian-backend' },
  transports: process.env.NODE_ENV === 'production' 
    ? fileTransports 
    : [consoleTransport, ...fileTransports],
  exitOnError: false, // Do not exit on handled exceptions
});

// Create a stream for morgan (HTTP request logging)
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // You might want to exit the process or take other actions here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // You might want to exit the process or take other actions here
  // process.exit(1);
});

// Add a method to log API requests
logger.api = (req, res, next) => {
  // Skip health check logs
  if (req.path === '/health') {
    return next();
  }

  const start = Date.now();
  const { method, originalUrl, ip, body, query, params, headers } = req;

  // Log request
  logger.info(`${method} ${originalUrl}`, {
    ip,
    method,
    url: originalUrl,
    query,
    params,
    headers: {
      'user-agent': headers['user-agent'],
      referer: headers.referer,
    },
    body: method === 'GET' ? undefined : body, // Don't log body for GET requests
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    // Skip successful health checks from cluttering the logs
    if (originalUrl === '/health' && statusCode === 200) {
      return;
    }

    const logData = {
      status: statusCode,
      duration: `${duration}ms`,
      method,
      url: originalUrl,
      ip,
      'response-time': `${duration}ms`,
      'content-length': res.get('content-length'),
      'user-agent': headers['user-agent'],
    };

    if (statusCode >= 400) {
      logger.error(`${method} ${originalUrl} ${statusCode}`, logData);
    } else {
      logger.http(`${method} ${originalUrl} ${statusCode}`, logData);
    }
  });

  next();
};

// Add a method to log errors with context
logger.errorWithContext = (message, error, context = {}) => {
  const logData = {
    error: {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...(error.response && { response: error.response.data }),
    },
    context,
  };

  logger.error(message, logData);
};

// Add a method to mask sensitive data in logs
logger.maskSensitiveData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const masked = { ...data };
  const sensitiveFields = [
    'password',
    'password_hash',
    'token',
    'access_token',
    'refresh_token',
    'authorization',
    'api_key',
    'apiKey',
    'secret',
  ];

  Object.keys(masked).forEach((key) => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      masked[key] = '***MASKED***';
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = logger.maskSensitiveData(masked[key]);
    }
  });

  return masked;
};

module.exports = logger;
