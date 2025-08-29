require('dotenv').config();

module.exports = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // Database Configuration
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'postgres',
    NAME: process.env.DB_NAME || 'sebi_guardian',
    PORT: process.env.DB_PORT || 5432,
    DIALECT: 'postgres',
  },
  
  // JWT Configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // OTP Configuration
  OTP: {
    LENGTH: 6,
    EXPIRY: 10 * 60 * 1000, // 10 minutes in milliseconds
  },
  
  // Email Configuration (SMTP)
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: process.env.EMAIL_PORT || 587,
    SECURE: process.env.EMAIL_SECURE === 'true',
    USER: process.env.EMAIL_USER || '',
    PASS: process.env.EMAIL_PASS || '',
    FROM: process.env.EMAIL_FROM || 'noreply@sebiguardian.ai',
  },
  
  // API Keys
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '9C7KWUPRK7YWXY5X',
  
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
  },
  
  // File Uploads
  UPLOAD_LIMIT: '10mb',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Frontend URL for email links and callbacks
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Admin email for notifications (optional)
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
};

// Validate required environment variables
const requiredVars = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'EMAIL_USER',
  'EMAIL_PASS'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn('Warning: The following required environment variables are not set:');
  missingVars.forEach(varName => console.warn(`- ${varName}`));
  console.warn('Please set these variables in the .env file.');
}
