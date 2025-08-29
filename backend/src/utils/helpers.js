// Utility helper functions

/**
 * Generate a numeric OTP code of given length
 * @param {number} length
 * @returns {string} numeric OTP string
 */
function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

module.exports = {
  generateOTP,
};
