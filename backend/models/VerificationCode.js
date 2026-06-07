const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL Index - 自动删除过期文档
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建复合索引，确保每个邮箱只有一个有效验证码
verificationCodeSchema.index({ email: 1, expiresAt: 1 });

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);
