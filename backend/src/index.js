const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { createClient } = require('redis');
const cookieParser = require('cookie-parser');
const config = require('../config/config');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const fraudRoutes = require('./routes/fraudRoutes');
const learningRoutes = require('./routes/learningRoutes');
const communityRoutes = require('./routes/communityRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize Redis client (v4)
const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;
const redisClient = createClient({ url: redisUrl });

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT.WINDOW_MS,
  max: config.RATE_LIMIT.MAX_REQUESTS,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: config.UPLOAD_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: config.UPLOAD_LIMIT }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Attach redis to requests
app.use((req, res, next) => {
  req.redisClient = redisClient;
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);
  
  // Join user to their own room for private messages
  socket.on('join', (userId) => {
    socket.join(userId);
    logger.info(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);
app.set('redisClient', redisClient);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server start
const PORT = config.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Connect Redis
    await redisClient.connect();
    logger.info('Redis client connected');
    
    // Sync all models
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized');
    }
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, { error: err });
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { error: err });
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

startServer();

module.exports = { app, server };
