import nodemailer from 'nodemailer';

const createTransporter = () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error('Gmail connection failed:', error);
      }
    });

    return transporter;
  } catch (error) {
    console.error('Gmail setup failed:', error);
    throw error;
  }
};


// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userAgent = 'Unknown') => {
  try {
    const transporter = createTransporter();
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
            .brand {
              margin-bottom: 24px;
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
            .support-card {
              background: white;
              border-radius: 12px;
              padding: 20px;
              margin: 24px 0;
              border: 1px solid #e2e8f0;
            }
            .support-header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              margin-bottom: 12px;
            }
            .support-text {
              color: #475569;
              font-size: 14px;
              margin: 0;
              font-weight: 600;
            }
            .support-link {
              color: #059669;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
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
            @media (max-width: 600px) {
              .email-container {
                margin: 20px;
                border-radius: 16px;
              }
              .header {
                padding: 40px 24px;
              }
              .header h1 {
                font-size: 28px;
              }
              .content {
                padding: 32px 24px;
              }
              .reset-button {
                padding: 14px 32px;
                font-size: 15px;
                min-width: 200px;
              }
              .footer {
                padding: 32px 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <h1>Password Reset</h1>
              <p>Secure access to your HealthBuddy account</p>
            </div>

            <!-- Main Content -->
            <div class="content">
              <!-- Welcome Message -->
              <div class="welcome-section">
                <h2>Hello there!</h2>
                <p>We received a request to reset your password. Click the button below to create a new secure password.</p>
              </div>

              <!-- Reset Button -->
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">
                  Reset Your Password
                </a>
              </div>

              <!-- Security Info Card -->
              <div class="security-card">
                <div class="security-content">
                  <div class="security-text">
                    <h4>! Important Security Notice</h4>
                    <p>
                      This reset link will expire in <strong>1 hour</strong> for your security. 
                      If you didn't request this, please ignore this email and ensure your account is secure.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Manual Link -->
              <div class="manual-link-section">
                <p>Or copy and paste this link:</p>
                <code class="link-code">${resetUrl}</code>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="brand">
                <h3>HealthBuddy</h3>
                <p>Your Trusted Health Companion</p>
              </div>

              <!-- Support Card -->
              <div class="support-card">
                <div class="support-header">
                  <p class="support-text">Need Help?</p>
                </div>
                <a href="mailto:${process.env.EMAIL_USER}" class="support-link">
                  Contact our support team
                </a>
              </div>

              <div class="footer-bottom">
                <p class="footer-text">
                  This is an automated security message from HealthBuddy. Please do not reply to this email.
                </p>
                <p class="copyright">© 2025 HealthBuddy. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
  
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Could not send reset email. Please try again.');
  }
};

// Send password change confirmation
export const sendPasswordChangedConfirmation = async (email, userAgent = 'Unknown') => {
  try {

    const transporter = createTransporter();
    
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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { 
              margin: 0; 
              padding: 0; 
              background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
              min-height: 100vh;
              font-family: 'Inter', Arial, sans-serif;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #EDFFFA;
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
              background:#EDFFFA;
            }
            .success-section {
              text-align: center;
              margin-bottom: 40px;
            }
            .success-section h2 {
              color: #065f46;
              font-size: 24px;
              font-weight: 600;
              margin: 0 0 16px 0;
            }
            .success-section p {
              color: #6b7280;
              font-size: 16px;
              line-height: 1.6;
              margin: 0;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 40px 0;
            }
            .detail-card {
              background: #f0fdf4;
              padding: 24px;
              border-radius: 12px;
              text-align: center;
              border: 1px solid #bbf7d0;
            }
            .detail-card h4 {
              color: #065f46;
              font-size: 14px;
              font-weight: 600;
              margin: 0 0 8px 0;
            }
            .detail-card .main-text {
              color: #1e293b;
              font-size: 15px;
              margin: 0;
              font-weight: 600;
            }
            .detail-card .sub-text {
              color: #64748b;
              font-size: 13px;
              margin: 4px 0 0 0;
            }
            .security-alert {
              background: #fef3c7;
              border: 1px solid #fcd34d;
              border-radius: 12px;
              padding: 24px;
              margin: 32px 0;
            }
            .alert-content {
              display: flex;
              align-items: flex-start;
              gap: 16px;
            }
            .alert-text h4 {
              color: #92400e;
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 8px 0;
            }
            .alert-text p {
              color: #92400e;
              font-size: 14px;
              margin: 0;
              line-height: 1.5;
            }
            .next-steps {
              background: #f8fafc;
              border-radius: 12px;
              padding: 24px;
              margin: 32px 0;
              border: 1px solid #e2e8f0;
            }
            .next-steps h4 {
              color: #1e293b;
              font-size: 18px;
              font-weight: 600;
              margin: 0 0 20px 0;
              text-align: center;
            }
            .steps-grid {
              display: grid;
              gap: 16px;
            }
            .step-item {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 16px;
              background: white;
              border-radius: 10px;
              border: 1px solid #e2e8f0;
            }
            .step-number{
              font-size: 14px;
              font-weight: 600;
            }
            .step-content h5 {
              color: #1e293b;
              font-size: 14px;
              font-weight: 600;
              margin: 0 0 4px 0;
            }
            .step-content p {
              color: #64748b;
              font-size: 13px;
              margin: 0;
            }
            .footer {
              background: #EDFFFA;
              padding: 40px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .brand {
              margin-bottom: 24px;
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
            .support-card {
              background: white;
              border-radius: 12px;
              padding: 20px;
              margin: 24px 0;
              border: 1px solid #e2e8f0;
            }
            .support-header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              margin-bottom: 12px;
            }
            .support-text {
              color: #475569;
              font-size: 14px;
              margin: 0;
              font-weight: 600;
            }
            .support-link {
              color: #059669;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
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
            @media (max-width: 600px) {
              .email-container {
                margin: 20px;
                border-radius: 16px;
              }
              .header {
                padding: 40px 24px;
              }
              .header h1 {
                font-size: 28px;
              }
              .content {
                padding: 32px 24px;
              }
              .details-grid {
                grid-template-columns: 1fr;
                gap: 16px;
              }
              .footer {
                padding: 32px 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Success Header -->
            <div class="header">
              <h1>Password Updated!</h1>
              <p>Your account is now more secure</p>
            </div>

            <!-- Main Content -->
            <div class="content">
              <!-- Success Message -->
              <div class="success-section">
                <h2>Security Enhanced Successfully</h2>
                <p>Your HealthBuddy password has been updated securely. Your account is now protected with enhanced security.</p>
              </div>

              <!-- Security Details Grid -->
              <div class="details-grid">
                <div class="detail-card">
                  <h4>Update Time</h4>
                  <p class="main-text">
                    ${new Date().toLocaleString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                  <p class="sub-text">
                    ${new Date().toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <div class="detail-card">
                  <h4>Device Type</h4>
                  <p class="main-text">
                    ${userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop/Laptop'}
                  </p>
                </div>
              </div>

              <!-- Security Alert -->
              <div class="security-alert">
                <div class="alert-content">
                  <div class="alert-text">
                    <h4>! Security Notice</h4>
                    <p>
                      If you did not make this change, your account may have been compromised. 
                      Please contact our support team immediately.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Next Steps -->
              <div class="next-steps">
                <h4>Recommended Next Steps</h4>
                <div class="steps-grid">
                  <div class="step-item">
                    <div class="step-number">1 . </div>
                    <div class="step-content">
                      <h5>Enable 2FA</h5>
                      <p>Add an extra layer of security</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <h4 class="step-number">2 . </h4>
                    <div class="step-content">
                      <h5>Review Activity</h5>
                      <p>Check recent account access</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">3 . </div>
                    <div class="step-content">
                      <h5>Update Recovery</h5>
                      <p>Verify recovery options</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="brand">
                <h3>HealthBuddy</h3>
                <p>Sehat ka Smart Dost</p>
              </div>

              <!-- Support Card -->
              <div class="support-card">
                <div class="support-header">
                  <p class="support-text">Need Help?</p>
                </div>
                <a href="mailto:${process.env.EMAIL_USER}" class="support-link">
                  Contact our support team
                </a>
              </div>

              <div class="footer-bottom">
                <p class="footer-text">
                  This is an automated security notification from HealthBuddy. Please do not reply to this email.
                </p>
                <p class="copyright">© 2025 HealthBuddy. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    console.error('Error details:', error.message);
    return false;
  }
};

export default {
  sendPasswordResetEmail,
  sendPasswordChangedConfirmation
};