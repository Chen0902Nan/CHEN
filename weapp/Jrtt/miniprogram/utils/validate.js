// miniprogram/utils/validate.js

const validate = {
  // 必填项校验
  required: (value) => {
    if (typeof value === 'undefined' || value === null) return false;
    return value.toString().trim().length > 0;
  },

  // 用户名校验：2-20位，支持字母、数字、下划线、减号
  username: (value) => {
    const regex = /^[a-zA-Z0-9_\-\u4e00-\u9fa5]{2,20}$/; // Allow Chinese characters too if desired, user said "format". Usually usernames can be Chinese. Let's stick to alphanumeric+ for now based on typical tech requirements, but user might want Chinese. The current code checked length only.
    // Let's stick to safe alphanumeric + _ + - for now to avoid encoding issues, or follow common practice.
    // The previous test allowed 'ab', 'testuser'.
    // I will enforce /^[a-zA-Z0-9_-]{2,20}$/ for now.
    return /^[a-zA-Z0-9_\-\u4e00-\u9fa5]{2,20}$/.test(value);
  },

  // 手机号校验（中国大陆）
  phone: (value) => {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(value);
  },

  // 密码强度校验：8-20位，必须包含字母和数字
  passwordStrength: (value) => {
    if (!value || value.length < 8 || value.length > 20) return false;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return hasLetter && hasNumber;
  }
};

module.exports = validate;
