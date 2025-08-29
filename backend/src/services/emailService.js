const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const config = require('../../config/config');
const logger = require('../utils/logger');

// Create a test account for development
let testAccount;

// Create reusable transporter object using the default SMTP transport
let transporter;

// Initialize email service
const initTransporter = async () => {
  if (config.NODE_ENV === 'development' && !config.EMAIL.USER) {
    testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    logger.info(`Ethereal test account created: ${testAccount.user}`);
  } else {
    transporter = nodemailer.createTransport({
      service: config.EMAIL.SERVICE,
      host: config.EMAIL.HOST,
      port: config.EMAIL.PORT,
      secure: config.EMAIL.SECURE,
      auth: {
        user: config.EMAIL.USER,
        pass: config.EMAIL.PASS,
      },
    });
  }
};

// Initialize the transporter when the module is loaded
initTransporter().catch(err => {
  logger.error('Failed to initialize email transporter:', err);
});

// Compile email template
const compileTemplate = async (templateName, context) => {
  try {
    const templatePath = path.join(__dirname, `../../templates/emails/${templateName}.hbs`);
    const templateContent = await fs.promises.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);
    return template(context);
  } catch (error) {
    logger.error(`Failed to compile email template ${templateName}:`, error);
    throw new Error(`Failed to compile email template: ${error.message}`);
  }
};

// Send email
const sendEmail = async (options) => {
  try {
    if (!transporter) {
      await initTransporter();
    }

    const { to, subject, template, context = {}, attachments = [] } = options;
    
    // Default context values
    const emailContext = {
      appName: 'SEBI Guardian AI',
      year: new Date().getFullYear(),
      ...context,
    };

    // Compile the email template
    let html;
    if (template) {
      html = await compileTemplate(template, emailContext);
    }

    // Setup email data
    const mailOptions = {
      from: `"${emailContext.appName}" <${config.EMAIL.FROM || 'noreply@sebiguardian.ai'}>`,
      to,
      subject,
      html,
      text: html ? undefined : emailContext.text,
      attachments,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log the email in development
    if (config.NODE_ENV === 'development') {
      logger.info('Email sent:', {
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
      });
    }

    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Email templates
const emailTemplates = {
  // Send welcome email
  async sendWelcomeEmail(user, password = null) {
    const subject = 'Welcome to SEBI Guardian AI';
    const context = {
      name: user.name,
      email: user.email,
      loginUrl: `${config.FRONTEND_URL}/login`,
      ...(password && { password }), // Include password if provided (for admin-created users)
    };

    return sendEmail({
      to: user.email,
      subject,
      template: 'welcome',
      context,
    });
  },

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    return sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        name: user.name,
        resetUrl,
        expiresIn: '1 hour',
      },
    });
  },

  // Send password changed confirmation
  async sendPasswordChangedEmail(user, ipAddress) {
    return sendEmail({
      to: user.email,
      subject: 'Your Password Has Been Changed',
      template: 'password-changed',
      context: {
        name: user.name,
        timestamp: new Date().toLocaleString(),
        ipAddress: ipAddress || 'Unknown',
        contactEmail: 'support@sebiguardian.ai',
      },
    });
  },

  // Send email verification
  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    return sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      context: {
        name: user.name,
        verificationUrl,
        expiresIn: '24 hours',
      },
    });
  },

  // Send OTP email
  async sendOTPEmail(email, otp, purpose = 'verification') {
    const purposeMap = {
      'verification': 'verify your email address',
      'login': 'log in to your account',
      'reset-password': 'reset your password',
      '2fa': 'complete two-factor authentication',
    };

    const purposeText = purposeMap[purpose] || 'complete your request';
    
    return sendEmail({
      to: email,
      subject: `Your OTP to ${purposeText}`,
      template: 'otp',
      context: {
        otp,
        purpose: purposeText,
        expiresIn: '10 minutes',
      },
    });
  },

  // Send fraud alert email
  async sendFraudAlertEmail(user, alertDetails) {
    return sendEmail({
      to: user.email,
      subject: `Fraud Alert: ${alertDetails.title}`,
      template: 'fraud-alert',
      context: {
        name: user.name,
        ...alertDetails,
        timestamp: new Date().toLocaleString(),
        dashboardUrl: `${config.FRONTEND_URL}/dashboard`,
      },
    });
  },

  // Send account activity notification
  async sendAccountActivityEmail(user, activity) {
    return sendEmail({
      to: user.email,
      subject: 'New Account Activity',
      template: 'account-activity',
      context: {
        name: user.name,
        activity,
        timestamp: new Date().toLocaleString(),
        ipAddress: activity.ipAddress || 'Unknown',
        device: activity.device || 'Unknown device',
        location: activity.location || 'Unknown location',
        manageDevicesUrl: `${config.FRONTEND_URL}/settings/security`,
      },
    });
  },

  // Send admin notification
  async sendAdminNotification(subject, message, data = {}) {
    if (!config.ADMIN_EMAIL) {
      logger.warn('No admin email configured. Skipping admin notification.');
      return null;
    }

    return sendEmail({
      to: config.ADMIN_EMAIL,
      subject: `[Admin] ${subject}`,
      template: 'admin-notification',
      context: {
        subject,
        message,
        data: JSON.stringify(data, null, 2),
        timestamp: new Date().toLocaleString(),
      },
    });
  },
};

module.exports = {
  sendEmail,
  ...emailTemplates,
};
