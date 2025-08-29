# SEBI Guardian AI - Backend

Backend service for SEBI Guardian AI, a fraud detection and investor protection platform.

## Features

- **User Authentication**: JWT-based authentication with email verification and password reset
- **Role-Based Access Control**: Different permissions for investors and administrators
- **Fraud Detection**: Endpoints for analyzing and reporting fraudulent activities
- **Real-time Alerts**: WebSocket integration for real-time notifications
- **Learning Modules**: Educational content for investors
- **Community Reporting**: Tools for reporting suspicious activities
- **API Integrations**: Integration with financial data providers

## Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.IO
- **Caching**: Redis
- **Logging**: Winston
- **Email**: Nodemailer with Handlebars templates
- **Validation**: Joi
- **Testing**: Jest, Supertest
- **Linting**: ESLint, Prettier

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- Redis (v6+)
- SMTP server or test account (like Ethereal)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sebi-guardian-ai.git
cd sebi-guardian-ai/backend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sebi_guardian
DB_USER=postgres
DB_PASSWORD=your-password
DB_DIALECT=postgres

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_FROM=SEBI Guardian AI <noreply@sebiguardian.ai>

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# File uploads
UPLOAD_LIMIT=10mb

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Set up the database

1. Create a new PostgreSQL database:
   ```bash
   createdb sebi_guardian
   ```

2. Run migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

3. (Optional) Seed the database with initial data:
   ```bash
   npx sequelize-cli db:seed:all
   ```

### 5. Start the development server

```bash
npm run dev
# or
yarn dev
```

The server will be running at `http://localhost:5000` by default.

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Project Structure

```
backend/
├── config/               # Configuration files
├── src/
│   ├── config/          # Configuration loading
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.js         # Application entry point
├── tests/               # Test files
├── .env.example         # Example environment variables
└── package.json         # Project dependencies and scripts
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Application environment | `development` |
| PORT | Port to run the server | `5000` |
| DB_HOST | Database host | `localhost` |
| DB_PORT | Database port | `5432` |
| DB_NAME | Database name | `sebi_guardian` |
| DB_USER | Database user | `postgres` |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | JWT expiration time | `24h` |
| JWT_REFRESH_SECRET | JWT refresh secret key | - |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiration time | `7d` |
| EMAIL_* | Email configuration | - |
| FRONTEND_URL | Frontend URL for email links | `http://localhost:3000` |
| REDIS_* | Redis configuration | - |

## Deployment

### Prerequisites

- Node.js (v14+)
- PM2 (for process management)
- Nginx (as reverse proxy)
- SSL certificate (for HTTPS)

### Steps

1. Clone the repository on your server
2. Install dependencies: `npm install --production`
3. Set up environment variables in `.env`
4. Build the application: `npm run build`
5. Start the server with PM2: `pm2 start npm --name "sebi-guardian-backend" -- start`
6. Set up Nginx as a reverse proxy
7. Configure SSL/TLS (recommended: Let's Encrypt)

## Security

- All API routes are protected by JWT authentication
- Rate limiting is enabled for all endpoints
- Input validation is performed on all requests
- Passwords are hashed using bcrypt
- CORS is configured to only allow requests from trusted origins
- Security headers are set using Helmet
- SQL injection prevention with Sequelize
- XSS protection
- CSRF protection for state-changing operations

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact support@sebiguardian.ai or open an issue on GitHub.
