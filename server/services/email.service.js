const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send welcome email
 */
async function sendWelcomeEmail(email, name) {
  try {
    await transporter.sendMail({
      from: `"Influencer Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Influencer Platform! 🎉',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining our platform. We're excited to help you grow your influencer business.</p>
        <p>Get started by creating your store and uploading your first product.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Go to Dashboard</a>
      `,
    });
  } catch (error) {
    console.error('Email send error:', error.message);
  }
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await transporter.sendMail({
      from: `"Influencer Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Email send error:', error.message);
  }
}

/**
 * Send subscription confirmation email
 */
async function sendSubscriptionConfirmation(email, planName) {
  try {
    await transporter.sendMail({
      from: `"Influencer Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Subscription Confirmed - ${planName} Plan`,
      html: `
        <h1>Subscription Confirmed! 🎉</h1>
        <p>Your ${planName} plan is now active.</p>
        <p>Enjoy your enhanced features and grow your business!</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Go to Dashboard</a>
      `,
    });
  } catch (error) {
    console.error('Email send error:', error.message);
  }
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSubscriptionConfirmation,
};
