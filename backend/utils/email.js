const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // QQ邮箱授权码，不是密码
  }
});

// Generate random verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: `"Verification System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '注册验证码',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">欢迎注册！</h2>
        <p>您的验证码是：</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #666;">验证码有效期为 5 分钟，请尽快使用。</p>
        <p style="color: #999; font-size: 12px;">如果这不是您本人的操作，请忽略此邮件。</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail
};
