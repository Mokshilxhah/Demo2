const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${token}`;
  
  // 1. Always log a beautiful card in the server terminal with the verification link for local development
  console.log('\n┌────────────────────────────────────────────────────────┐');
  console.log('│                    📧 EMAIL SIMULATOR                  │');
  console.log('├────────────────────────────────────────────────────────┤');
  console.log(`│ To: ${email.padEnd(51)}│`);
  console.log(`│ Name: ${name.padEnd(49)}│`);
  console.log('│                                                        │');
  console.log('│ Please verify your email by clicking the link below:   │');
  console.log(`│ ${verifyUrl.padEnd(55)} │`);
  console.log('└────────────────────────────────────────────────────────┘\n');

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
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">Thank you for registering. Please click the button below to verify your email and activate your account:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">This link will expire in 24 hours.</p>
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

module.exports = { sendVerificationEmail };
