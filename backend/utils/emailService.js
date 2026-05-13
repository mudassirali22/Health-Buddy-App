import nodemailer from 'nodemailer';

// Singleton transporter - reuse connection
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  
  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials missing: EMAIL_USER or EMAIL_PASS not set in .env');
      throw new Error('Email service not configured. Please set EMAIL_USER and EMAIL_PASS in .env');
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS (more reliable than SSL on port 465)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    // Verify connection on startup
    transporter.verify()
      .then(() => console.log('✅ Email service connected successfully'))
      .catch((err) => {
        console.error('❌ Email service verification failed:', err.message);
        console.error('💡 Tip: Make sure you are using a Gmail App Password, not your regular password.');
        console.error('💡 Generate one at: https://myaccount.google.com/apppasswords');
        transporter = null; // Reset so it retries next time
      });

    return transporter;
  } catch (error) {
    console.error('❌ Email transporter creation failed:', error.message);
    throw error;
  }
};


// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userAgent = 'Unknown') => {
  try {
    const transport = getTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"HealthBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - HealthBuddy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { 
              margin: 0; 
              padding: 0; 
              background: linear-gradient(135deg, #059669 0%, #10b981 100%);
              min-height: 100vh;
              font-family: 'Inter', Arial, sans-serif;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #E1EBEE;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
            }
            .header {
              background: linear-gradient(135deg, #059669 0%, #10b981 100%);
              padding: 50px 40px;
              text-align: center;
            }
            .header h1 {
              color: white;
              font-size: 32px;
              font-weight: 700;
              margin: 0 0 12px 0;
              letter-spacing: -0.5px;
            }
            .header p {
              color: rgba(255,255,255,0.9);
              font-size: 16px;
              margin: 0;
              font-weight: 400;
            }
            .content {
              padding: 48px 40px;
              background: #EDFFFA;
            }
            .welcome-section {
              text-align: center;
              margin-bottom: 40px;
            }
            .welcome-section h2 {
              color: #1f2937;
              font-size: 24px;
              font-weight: 600;
              margin: 0 0 16px 0;
            }
            .welcome-section p {
              color: #6b7280;
              font-size: 16px;
              line-height: 1.6;
              margin: 0;
            }
            .button-container {
              text-align: center;
              margin: 40px 0;
            }
            .reset-button {
              display: inline-block;
              padding: 16px 40px;
              background: linear-gradient(135deg, #059669 0%, #10b981 100%);
              color: #E1EBEE;
              text-decoration: none;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 600;
              border: none;
              min-width: 220px;
              transition: all 0.3s ease;
            }
            .security-card {
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 12px;
              padding: 24px;
              margin: 32px 0;
            }
            .security-content {
              display: flex;
              align-items: flex-start;
              gap: 16px;
            }
            .security-text h4 {
              color: #065f46;
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 8px 0;
            }
            .security-text p {
              color: #047857;
              font-size: 14px;
              margin: 0;
              line-height: 1.5;
            }
            .manual-link-section {
              text-align: center;
              background: #f8fafc;
              padding: 24px;
              border-radius: 12px;
              margin: 32px 0;
              border: 1px solid #e2e8f0;
            }
            .manual-link-section p {
              color: #475569;
              font-size: 14px;
              margin: 0 0 16px 0;
              font-weight: 500;
            }
            .link-code {
              background: white;
              padding: 14px 16px;
              border-radius: 8px;
              font-size: 13px;
              color: #059669;
              word-break: break-all;
              border: 1px solid #d1fae5;
              font-family: 'Courier New', monospace;
              display: block;
              text-align: center;
              line-height: 1.4;
            }
            .footer {
              background: #EDFFFA;
              padding: 40px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .brand h3 {
              color: #059669;
              font-size: 20px;
              font-weight: 700;
              margin: 0 0 8px 0;
            }
            .brand p {
              color: #6b7280;
              font-size: 14px;
              margin: 0;
            }
            .footer-bottom {
              border-top: 1px solid #e2e8f0;
              padding-top: 24px;
              margin-top: 24px;
            }
            .footer-text {
              color: #9ca3af;
              font-size: 12px;
              margin: 0 0 12px 0;
              line-height: 1.5;
            }
            .copyright {
              color: #9ca3af;
              font-size: 12px;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Password Reset</h1>
              <p>Secure access to your HealthBuddy account</p>
            </div>
            <div class="content">
              <div class="welcome-section">
                <h2>Hello there!</h2>
                <p>We received a request to reset your password. Click the button below to create a new secure password.</p>
              </div>
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset Your Password</a>
              </div>
              <div class="security-card">
                <div class="security-content">
                  <div class="security-text">
                    <h4>⚠️ Important Security Notice</h4>
                    <p>This reset link will expire in <strong>15 minutes</strong> for your security. If you didn't request this, please ignore this email.</p>
                  </div>
                </div>
              </div>
              <div class="manual-link-section">
                <p>Or copy and paste this link:</p>
                <code class="link-code">${resetUrl}</code>
              </div>
            </div>
            <div class="footer">
              <div class="brand">
                <h3>HealthBuddy</h3>
                <p>Your Smart Friend for Health</p>
              </div>
              <div class="footer-bottom">
                <p class="footer-text">This is an automated security message from HealthBuddy. Please do not reply to this email.</p>
                <p class="copyright">© ${new Date().getFullYear()} HealthBuddy. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email, '| MessageId:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Could not send reset email. Please try again.');
  }
};

// Send password change confirmation
export const sendPasswordChangedConfirmation = async (email, userAgent = 'Unknown') => {
  try {
    const transport = getTransporter();
    
    const mailOptions = {
      from: `"HealthBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Updated Successfully - HealthBuddy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; padding: 0; 
              background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
              font-family: 'Inter', Arial, sans-serif;
            }
            .email-container {
              max-width: 600px; margin: 0 auto;
              background: #EDFFFA; border-radius: 20px;
              overflow: hidden; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
            }
            .header {
              background: linear-gradient(135deg, #059669 0%, #10b981 100%);
              padding: 50px 40px; text-align: center;
            }
            .header h1 { color: white; font-size: 32px; font-weight: 700; margin: 0 0 12px 0; }
            .header p { color: rgba(255,255,255,0.9); font-size: 16px; margin: 0; }
            .content { padding: 48px 40px; background: #EDFFFA; }
            .success-section { text-align: center; margin-bottom: 40px; }
            .success-section h2 { color: #065f46; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; }
            .success-section p { color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0; }
            .detail-card {
              background: #f0fdf4; padding: 24px; border-radius: 12px;
              text-align: center; border: 1px solid #bbf7d0;
            }
            .detail-card h4 { color: #065f46; font-size: 14px; font-weight: 600; margin: 0 0 8px 0; }
            .detail-card .main-text { color: #1e293b; font-size: 15px; margin: 0; font-weight: 600; }
            .detail-card .sub-text { color: #64748b; font-size: 13px; margin: 4px 0 0 0; }
            .security-alert {
              background: #fef3c7; border: 1px solid #fcd34d;
              border-radius: 12px; padding: 24px; margin: 32px 0;
            }
            .alert-text h4 { color: #92400e; font-size: 16px; font-weight: 600; margin: 0 0 8px 0; }
            .alert-text p { color: #92400e; font-size: 14px; margin: 0; line-height: 1.5; }
            .footer {
              background: #EDFFFA; padding: 40px;
              text-align: center; border-top: 1px solid #e2e8f0;
            }
            .brand h3 { color: #059669; font-size: 20px; font-weight: 700; margin: 0 0 8px 0; }
            .brand p { color: #6b7280; font-size: 14px; margin: 0; }
            .footer-bottom { border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px; }
            .footer-text { color: #9ca3af; font-size: 12px; margin: 0 0 12px 0; }
            .copyright { color: #9ca3af; font-size: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Password Updated!</h1>
              <p>Your account is now more secure</p>
            </div>
            <div class="content">
              <div class="success-section">
                <h2>✅ Security Enhanced Successfully</h2>
                <p>Your HealthBuddy password has been updated securely.</p>
              </div>
              <div class="details-grid">
                <div class="detail-card">
                  <h4>Update Time</h4>
                  <p class="main-text">${new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                  <p class="sub-text">${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                </div>
                <div class="detail-card">
                  <h4>Device Type</h4>
                  <p class="main-text">${userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop/Laptop'}</p>
                </div>
              </div>
              <div class="security-alert">
                <div class="alert-text">
                  <h4>⚠️ Security Notice</h4>
                  <p>If you did not make this change, your account may have been compromised. Please contact our support team immediately.</p>
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="brand">
                <h3>HealthBuddy</h3>
                <p>Your Smart Friend for Health</p>
              </div>
              <div class="footer-bottom">
                <p class="footer-text">This is an automated security notification. Please do not reply.</p>
                <p class="copyright">© ${new Date().getFullYear()} HealthBuddy. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    
    const info = await transport.sendMail(mailOptions);
    console.log('✅ Password change confirmation sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error.message);
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      transporter = null;
    }
    return false;
  }
};

// Send family credentials email
export const sendFamilyCredentialsEmail = async (email, familyData, parentName) => {
  try {
    const transport = getTransporter();
    
    const mailOptions = {
      from: `"HealthBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your HealthBuddy Login Credentials',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f8fafc; padding: 40px; }
            .card { background: white; border-radius: 20px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #059669; font-size: 24px; font-weight: 800; }
            .content { color: #334155; line-height: 1.6; }
            .credentials { background: #f1f5f9; padding: 25px; border-radius: 15px; margin: 25px 0; border: 1px solid #e2e8f0; }
            .label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
            .value { font-size: 18px; font-weight: 700; color: #0f172a; font-family: monospace; }
            .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; }
            .btn { display: inline-block; background: #059669; color: white; padding: 12px 25px; border-radius: 10px; text-decoration: none; font-weight: 700; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="logo">HealthBuddy</div>
              <p style="color: #64748b; margin-top: 5px;">Secure Access Portal</p>
            </div>
            <div class="content">
              <p>Hello <strong>${familyData.name}</strong>,</p>
              <p><strong>${parentName}</strong> has invited you to join their HealthBuddy family circle. Use the following credentials to access your personal health dashboard.</p>
              
              <div class="credentials">
                <div class="label">MR Number (Login ID)</div>
                <div class="value">${familyData.mrNumber}</div>
                <div style="height: 15px;"></div>
                <div class="label">Temporary Password</div>
                <div class="value">${familyData.plainPassword}</div>
              </div>

              <p>Please login at the link below and change your password immediately for security.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/login" class="btn">Login to Dashboard</a>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} HealthBuddy. All records are encrypted and secure.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transport.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send credentials email:', error);
    return false;
  }
};

export default {
  sendPasswordResetEmail,
  sendPasswordChangedConfirmation,
  sendFamilyCredentialsEmail
};
