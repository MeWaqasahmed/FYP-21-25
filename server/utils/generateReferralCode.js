const { customAlphabet } = require('nanoid');

// Generate URL-safe referral code (8 characters)
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

const generateReferralCode = () => {
  return nanoid();
};

module.exports = generateReferralCode;
