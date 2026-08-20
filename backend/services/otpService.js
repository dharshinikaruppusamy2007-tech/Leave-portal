const crypto = require('crypto');

const OTP_EXPIRY_MS = parseInt(process.env.OTP_EXPIRY_SECONDS || '300', 10) * 1000;
const OTP_LENGTH = 6;
const MAX_VERIFY_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);
const RESEND_COOLDOWN_MS = parseInt(process.env.OTP_RESEND_COOLDOWN || '60', 10) * 1000;

const otpStore = new Map();

function generateOTP() {
  const buffer = crypto.randomBytes(OTP_LENGTH);
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += buffer[i] % 10;
  }
  return otp;
}

function storeOTP(mobile, otp) {
  const now = Date.now();
  const existing = otpStore.get(mobile);
  if (existing && now - existing.createdAt < RESEND_COOLDOWN_MS) {
    return { success: false, message: `Please wait ${Math.ceil((RESEND_COOLDOWN_MS - (now - existing.createdAt)) / 1000)} seconds before requesting a new OTP.` };
  }

  otpStore.set(mobile, {
    otp,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0
  });

  return { success: true };
}

function verifyOTP(mobile, inputOTP) {
  const record = otpStore.get(mobile);

  if (!record) {
    return { success: false, message: 'No OTP found. Please request a new OTP.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(mobile);
    return { success: false, message: 'OTP has expired. Please request a new OTP.' };
  }

  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(mobile);
    return { success: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
  }

  record.attempts += 1;

  if (record.otp !== inputOTP) {
    return { success: false, message: `Invalid OTP. ${MAX_VERIFY_ATTEMPTS - record.attempts} attempts remaining.` };
  }

  otpStore.delete(mobile);
  return { success: true };
}

function getOTPExpirySeconds() {
  return Math.floor(OTP_EXPIRY_MS / 1000);
}

module.exports = { generateOTP, storeOTP, verifyOTP, getOTPExpirySeconds };
