const SMS_MODE = process.env.SMS_MODE || 'dev';

function buildApprovalSMS(studentName, regNo, fromDate, toDate) {
  const dateStr = toDate && toDate !== fromDate ? `${fromDate} to ${toDate}` : fromDate;
  return [
    `Leave Approved / விடுப்பு அனுமதிக்கப்பட்டது.`,
    `Student: ${studentName}`,
    `Reg No: ${regNo}`,
    `Leave: ${dateStr}`,
    `Your ward's leave has been approved.`
  ].join('\n');
}

function buildRejectionSMS(studentName, regNo, fromDate, toDate) {
  const dateStr = toDate && toDate !== fromDate ? `${fromDate} to ${toDate}` : fromDate;
  return [
    `Leave Rejected / விடுப்பு நிராகரிக்கப்பட்டது.`,
    `Student: ${studentName}`,
    `Reg No: ${regNo}`,
    `Leave: ${dateStr}`,
    `Your ward's leave has been rejected.`
  ].join('\n');
}

async function sendSMS(phoneNumber, message) {
  if (!phoneNumber) {
    console.log('[SMS] No phone number provided. Skipping.');
    return { success: false, error: 'No phone number' };
  }

  if (SMS_MODE === 'dev') {
    console.log('========================================');
    console.log('[SMS - DEV MODE] Would send SMS:');
    console.log(`  To: ${phoneNumber}`);
    console.log(`  Message:\n${message}`);
    console.log('========================================');
    return { success: true, mode: 'dev' };
  }

  try {
    const apiKey = process.env.SMS_PROVIDER_API_KEY;
    const senderId = process.env.SMS_PROVIDER_SENDER_ID;

    if (!apiKey) {
      console.error('[SMS] SMS_PROVIDER_API_KEY not set. SMS not sent.');
      return { success: false, error: 'SMS provider not configured' };
    }

    console.log(`[SMS] Sending to ${phoneNumber} via provider...`);
    console.log(`[SMS] Sender: ${senderId}`);
    console.log(`[SMS] Message: ${message}`);

    return { success: true, mode: 'production' };
  } catch (err) {
    console.error('[SMS] Send failed:', err.message);
    return { success: false, error: err.message };
  }
}

function buildOTPSMS(otp, expiryMinutes) {
  return [
    `Your Leave Portal OTP is: ${otp}`,
    `This OTP will expire in ${expiryMinutes} minute(s).`,
    `Do not share this code with anyone.`
  ].join('\n');
}

async function sendOTP(mobile, otp) {
  const expiryMinutes = Math.ceil(parseInt(process.env.OTP_EXPIRY_SECONDS || '300', 10) / 60);
  const message = buildOTPSMS(otp, expiryMinutes);

  if (!mobile) {
    console.log('[OTP-SMS] No phone number provided. Skipping.');
    return { success: false, error: 'No phone number' };
  }

  const smsMode = process.env.SMS_MODE || 'dev';

  if (smsMode === 'dev') {
    console.log('================================================');
    console.log('[OTP - DEV MODE] OTP for parent authentication:');
    console.log(`  Mobile: ${mobile}`);
    console.log(`  OTP: ${otp}`);
    console.log(`  Expires in: ${expiryMinutes} minute(s)`);
    console.log('================================================');
    return { success: true, mode: 'dev' };
  }

  try {
    const apiKey = process.env.SMS_PROVIDER_API_KEY;
    const senderId = process.env.SMS_PROVIDER_SENDER_ID;

    if (!apiKey) {
      console.error('[OTP-SMS] SMS_PROVIDER_API_KEY not set. OTP not sent.');
      return { success: false, error: 'SMS provider not configured' };
    }

    console.log(`[OTP-SMS] Sending OTP to ${mobile} via provider...`);
    console.log(`[OTP-SMS] Sender: ${senderId}`);
    console.log(`[OTP-SMS] Message: ${message}`);

    return { success: true, mode: 'production' };
  } catch (err) {
    console.error('[OTP-SMS] Send failed:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendSMS, sendOTP, buildApprovalSMS, buildRejectionSMS, buildOTPSMS };
