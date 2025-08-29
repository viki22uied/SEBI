const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

// User Model
const User = (sequelize) => {
  class User extends Model {
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password_hash);
    }

    generateAuthToken() {
      const token = jwt.sign(
        { id: this.id, role: this.role },
        config.JWT.SECRET,
        { expiresIn: config.JWT.EXPIRES_IN }
      );
      return token;
    }

    generateRefreshToken() {
      const refreshToken = jwt.sign(
        { id: this.id },
        config.JWT.REFRESH_SECRET,
        { expiresIn: config.JWT.REFRESH_EXPIRES_IN }
      );
      return refreshToken;
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      validate: {
        is: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'investor'),
      defaultValue: 'investor',
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    risk_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    last_login: {
      type: DataTypes.DATE,
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
    },
  });

  return User;
};

// OTP Model
const OTP = (sequelize) => {
  class OTP extends Model {}

  OTP.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    purpose: {
      type: DataTypes.ENUM('signup', 'login', 'reset_password'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'OTP',
    tableName: 'otps',
    timestamps: true,
    underscored: true,
  });

  return OTP;
};

// Fraud Report Model
const FraudReport = (sequelize) => {
  class FraudReport extends Model {}

  FraudReport.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(
        'ponzi_scheme',
        'insider_trading',
        'market_manipulation',
        'fake_ipo',
        'other'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'under_review',
        'resolved',
        'rejected'
      ),
      defaultValue: 'pending',
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium',
    },
    evidence: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Array of file paths
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    sequelize,
    modelName: 'FraudReport',
    tableName: 'fraud_reports',
    timestamps: true,
    underscored: true,
  });

  return FraudReport;
};

// Alert Model
const Alert = (sequelize) => {
  class Alert extends Model {}

  Alert.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(
        'suspicious_activity',
        'fraud_alert',
        'system',
        'account'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium',
    },
    action_url: {
      type: DataTypes.STRING,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    sequelize,
    modelName: 'Alert',
    tableName: 'alerts',
    timestamps: true,
    underscored: true,
  });

  return Alert;
};

// Learning Module Model
const LearningModule = (sequelize) => {
  class LearningModule extends Model {}

  LearningModule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner',
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 10,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    thumbnail_url: {
      type: DataTypes.STRING,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  }, {
    sequelize,
    modelName: 'LearningModule',
    tableName: 'learning_modules',
    timestamps: true,
    underscored: true,
  });

  return LearningModule;
};

// User Progress Model
const UserProgress = (sequelize) => {
  class UserProgress extends Model {}

  UserProgress.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
      defaultValue: 'not_started',
    },
    progress: {
      type: DataTypes.INTEGER, // 0-100
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    score: {
      type: DataTypes.INTEGER, // Quiz score
    },
    completed_at: {
      type: DataTypes.DATE,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    sequelize,
    modelName: 'UserProgress',
    tableName: 'user_progress',
    timestamps: true,
    underscored: true,
  });

  return UserProgress;
};

// Quiz Question Model
const QuizQuestion = (sequelize) => {
  class QuizQuestion extends Model {}

  QuizQuestion.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB, // Array of { id: string, text: string, isCorrect: boolean }
      allowNull: false,
    },
    explanation: {
      type: DataTypes.TEXT,
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      defaultValue: 'medium',
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  }, {
    sequelize,
    modelName: 'QuizQuestion',
    tableName: 'quiz_questions',
    timestamps: true,
    underscored: true,
  });

  return QuizQuestion;
};

// Trusted Contact Model
const TrustedContact = (sequelize) => {
  class TrustedContact extends Model {}

  TrustedContact.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      validate: {
        is: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
      },
    },
    relationship: {
      type: DataTypes.STRING,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'TrustedContact',
    tableName: 'trusted_contacts',
    timestamps: true,
    underscored: true,
  });

  return TrustedContact;
};

// Export all models
module.exports = (sequelize, db) => {
  // Initialize models
  db.User = User(sequelize);
  db.OTP = OTP(sequelize);
  db.FraudReport = FraudReport(sequelize);
  db.Alert = Alert(sequelize);
  db.LearningModule = LearningModule(sequelize);
  db.UserProgress = UserProgress(sequelize);
  db.QuizQuestion = QuizQuestion(sequelize);
  db.TrustedContact = TrustedContact(sequelize);

  // Define associations
  // User has many OTPs
  db.User.hasMany(db.OTP, {
    foreignKey: 'email',
    sourceKey: 'email',
    as: 'otps',
  });

  // User has many Fraud Reports
  db.User.hasMany(db.FraudReport, {
    foreignKey: 'user_id',
    as: 'fraudReports',
  });
  db.FraudReport.belongsTo(db.User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // User has many Alerts
  db.User.hasMany(db.Alert, {
    foreignKey: 'user_id',
    as: 'alerts',
  });
  db.Alert.belongsTo(db.User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // User has many Trusted Contacts
  db.User.hasMany(db.TrustedContact, {
    foreignKey: 'user_id',
    as: 'trustedContacts',
  });
  db.TrustedContact.belongsTo(db.User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // User has many UserProgress
  db.User.hasMany(db.UserProgress, {
    foreignKey: 'user_id',
    as: 'progress',
  });
  db.UserProgress.belongsTo(db.User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // LearningModule has many UserProgress
  db.LearningModule.hasMany(db.UserProgress, {
    foreignKey: 'module_id',
    as: 'userProgress',
  });
  db.UserProgress.belongsTo(db.LearningModule, {
    foreignKey: 'module_id',
    as: 'module',
  });

  // LearningModule has many QuizQuestions
  db.LearningModule.hasMany(db.QuizQuestion, {
    foreignKey: 'module_id',
    as: 'quizQuestions',
  });
  db.QuizQuestion.belongsTo(db.LearningModule, {
    foreignKey: 'module_id',
    as: 'module',
  });
};
