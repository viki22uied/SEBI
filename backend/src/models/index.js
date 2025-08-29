const { Sequelize } = require('sequelize');
const config = require('../../config/config');
const setupModels = require('./setupModels');

// Database connection configuration
const sequelize = new Sequelize({
  dialect: config.DB.DIALECT,
  host: config.DB.HOST,
  port: config.DB.PORT,
  username: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import and initialize models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Setup models
setupModels(sequelize, db);

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Run test connection in development
if (process.env.NODE_ENV === 'development') {
  testConnection();
}

module.exports = db;
