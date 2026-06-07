const VerificationCode = require('../models/VerificationCode');

// Store verification code with expiration (5 minutes)
const storeVerificationCode = async (email, code) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  
  // Delete any existing verification codes for this email
  await VerificationCode.deleteMany({ email });
  
  // Create new verification code
  await VerificationCode.create({
    email,
    code,
    expiresAt
  });
};

// Verify code
const verifyCode = async (email, code) => {
  // Find the verification code
  const verificationCode = await VerificationCode.findOne({ email });
  
  if (!verificationCode) {
    return { valid: false, message: '验证码不存在或已过期' };
  }
  
  // Check if expired
  if (new Date() > verificationCode.expiresAt) {
    await VerificationCode.deleteOne({ _id: verificationCode._id });
    return { valid: false, message: '验证码已过期' };
  }
  
  // Check if code matches
  if (verificationCode.code !== code) {
    return { valid: false, message: '验证码错误' };
  }
  
  // Delete code after successful verification
  await VerificationCode.deleteOne({ _id: verificationCode._id });
  return { valid: true, message: '验证成功' };
};

module.exports = {
  storeVerificationCode,
  verifyCode
};
