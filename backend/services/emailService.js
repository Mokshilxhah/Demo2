const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, name, token, otp) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${token}`;
  
  // 1. Log in dev mode only
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log('│                    📧 EMAIL SIMULATOR                  │');
    console.log('├────────────────────────────────────────────────────────┤');
    console.log(`│ To: ${email.padEnd(51)}│`);
    console.log(`│ Name: ${name.padEnd(49)}│`);
    console.log(`│ Verification OTP: ${otp.padEnd(37)}│`);
    console.log('│                                                        │');
    console.log('│ Please verify your email by clicking the link below:   │');
    console.log(`│ ${verifyUrl.padEnd(55)} │`);
    console.log('└────────────────────────────────────────────────────────┘\n');
  }

  // 2. Try sending an actual email if SMTP parameters are configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_HOST) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: parseInt(process.env.EMAIL_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'DevQueue Support'}" <${process.env.EMAIL_FROM || 'noreply@devqueue.studio'}>`,
        to: email,
        subject: 'Verify your DevQueue account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0d0e12; color: #f3f4f6; border-radius: 12px; border: 1px solid #1e293b;">
            <h2 style="color: #8b5cf6; text-align: center;">Welcome to DevQueue, ${name}!</h2>
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">Thank you for registering. Your verification OTP code is:</p>
            <div style="text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 8px; color: #f59e0b; margin: 20px 0; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; border: 1px dashed rgba(255,255,255,0.1);">
              ${otp}
            </div>
            <p style="font-size: 14px; line-height: 1.6; text-align: center;">Alternatively, you can verify your email directly by clicking the button below:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${verifyUrl}" style="background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">This code and link will expire in 24 hours.</p>
            <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;" />
            <p style="font-size: 12px; color: #6b7280; text-align: center;">If you didn't create this account, you can ignore this email.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Actual verification email sent to ${email}`);
    } catch (err) {
      console.error('[EmailService] Failed to send actual email via SMTP:', err.message);
    }
  }
};

const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`;

  // Log in dev mode only
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔑 [PASSWORD RESET SEED LOG]`);
    console.log(`User: ${name} (${email})`);
    console.log(`Reset URL: ${resetUrl}\n`);
  }

  // Send email if SMTP configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_HOST) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: parseInt(process.env.EMAIL_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'DevQueue Support'}" <${process.env.EMAIL_FROM || 'noreply@devqueue.studio'}>`,
        to: email,
        subject: 'Reset your DevQueue password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0d0e12; color: #f3f4f6; border-radius: 12px; border: 1px solid #1e293b;">
            <h2 style="color: #f5a623; text-align: center;">DevQueue Password Reset</h2>
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">Hello ${name},</p>
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">You requested to reset your password. Please click the button below to set a new password:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #f5a623, #d97706); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">This link will expire in 1 hour.</p>
            <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;" />
            <p style="font-size: 12px; color: #6b7280; text-align: center;">If you didn't request a password reset, please ignore this email.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Actual password reset email sent to ${email}`);
    } catch (err) {
      console.error('[EmailService] Failed to send actual password reset email via SMTP:', err.message);
    }
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
