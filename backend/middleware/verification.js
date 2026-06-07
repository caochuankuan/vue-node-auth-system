// In-memory storage for verification codes
// In production, use Redis or database
const verificationCodes = new Map();

// Store verification code with expiration (5 minutes)
const storeVerificationCode = (email, code) => {
  const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
  verificationCodes.set(email, { code, expiresAt: expirationTime });
};

// Verify code
const verifyCode = (email, code) => {
  const stored = verificationCodes.get(email);
  
  if (!stored) {
    return { valid: false, message: '验证码不存在或已过期' };
  }
  
  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(email);
    return { valid: false, message: '验证码已过期' };
  }
  
  if (stored.code !== code) {
    return { valid: false, message: '验证码错误' };
  }
  
  // Delete code after successful verification
  verificationCodes.delete(email);
  return { valid: true, message: '验证成功' };
};

module.exports = {
  storeVerificationCode,
  verifyCode
};
