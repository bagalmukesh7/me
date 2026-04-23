const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendApplicationEmail = async (to, opportunity) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #FF9933; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%); padding: 20px; text-align: center;">
        <h1 style="color: #000080; margin: 0;">UGOVA</h1>
        <p style="color: #333; margin: 5px 0 0;">Unified Government Opportunities & Verification App</p>
      </div>
      <div style="padding: 20px;">
        <h2 style="color: #000080;">Application Confirmation</h2>
        <p>You have applied for:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Title:</strong> ${opportunity.title}</p>
          <p><strong>Type:</strong> ${opportunity.type}</p>
          <p><strong>Organization:</strong> ${opportunity.organization}</p>
          <p><strong>Last Date:</strong> ${opportunity.last_date || 'N/A'}</p>
        </div>
        <p><a href="${opportunity.official_link}" style="background: #000080; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit Official Portal</a></p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">Complete your application on the official government portal. UGOVA only redirects to official sources.</p>
      </div>
      <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        UGOVA - Empowering Citizens with Government Opportunities
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"UGOVA" <${process.env.SMTP_USER}>`,
    to,
    subject: `UGOVA: Applied for ${opportunity.title}`,
    html,
  });
};

const sendOTP = async (to, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; text-align: center; padding: 20px;">
      <h2 style="color: #000080;">UGOVA Verification</h2>
      <p>Your OTP for mobile verification is:</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h1 style="color: #FF9933; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      <p style="color: #666; font-size: 12px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"UGOVA" <${process.env.SMTP_USER}>`,
    to,
    subject: 'UGOVA: Mobile Verification OTP',
    html,
  });
};

module.exports = { sendApplicationEmail, sendOTP };
