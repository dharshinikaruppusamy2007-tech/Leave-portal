const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Leave = require('../models/Leave');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');
const { generateOTP, storeOTP, verifyOTP, getOTPExpirySeconds } = require('../services/otpService');
const { sendOTP } = require('../services/smsService');

const router = express.Router();

function isValidIndianMobile(m) {
  return /^[6-9]\d{9}$/.test(m);
}

function normalizeMobile(m) {
  return m.replace(/\D/g, '').slice(-10);
}

router.post('/send-otp', async (req, res) => {
  try {
    let { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }

    mobile = normalizeMobile(mobile);

    if (!isValidIndianMobile(mobile)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    const linkedStudents = await User.find({ parentMobile: mobile, role: 'student' }).select('name regNo');
    if (!linkedStudents || linkedStudents.length === 0) {
      return res.status(404).json({ success: false, message: 'No student found with this parent mobile number. Please ask your ward to register with this mobile number.' });
    }

    const otp = generateOTP();
    const storeResult = storeOTP(mobile, otp);
    if (!storeResult.success) {
      return res.status(429).json({ success: false, message: storeResult.message });
    }

    const smsResult = await sendOTP(mobile, otp);
    if (!smsResult.success) {
      console.error('[OTP] Failed to send OTP:', smsResult.error);
    }

    const expirySeconds = getOTPExpirySeconds();
    const studentNames = linkedStudents.map(s => s.name).join(', ');

    res.json({
      success: true,
      message: `OTP sent to ${mobile}.`,
      expirySeconds,
      linkedStudents: linkedStudents.map(s => ({ name: s.name, regNo: s.regNo }))
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    let { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: 'Mobile number and OTP are required.' });
    }

    mobile = normalizeMobile(mobile);

    if (!isValidIndianMobile(mobile)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    const verifyResult = verifyOTP(mobile, otp);
    if (!verifyResult.success) {
      return res.status(401).json({ success: false, message: verifyResult.message });
    }

    let parentUser = await User.findOne({ mobile, role: 'parent' });

    if (!parentUser) {
      const autoEmail = `parent_${mobile}@leaveportal.local`;
      parentUser = new User({
        name: `Parent (${mobile})`,
        email: autoEmail,
        password: cryptoRandomPassword(),
        role: 'parent',
        mobile
      });
      await parentUser.save();
      console.log(`[OTP] Created parent user for mobile ${mobile}: ${parentUser._id}`);
    }

    const token = jwt.sign({ id: parentUser._id, role: parentUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'OTP verified successfully.',
      token,
      user: parentUser.toJSON()
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

function cryptoRandomPassword() {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('hex');
}

router.get('/wards', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, message: 'Only parents can access this.' });
    }

    const parentMobile = req.user.mobile;
    if (!parentMobile) {
      return res.json([]);
    }

    const wards = await User.find({ parentMobile, role: 'student' }).select('-password -__v');
    res.json(wards);
  } catch (err) {
    console.error('Fetch wards error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching ward information.' });
  }
});

router.get('/ward-leaves', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, message: 'Only parents can access this.' });
    }

    const parentMobile = req.user.mobile;
    const wards = await User.find({ parentMobile, role: 'student' }).select('_id');
    const wardIds = wards.map(w => w._id);

    if (wardIds.length === 0) {
      return res.json([]);
    }

    const leaves = await Leave.find({ studentId: { $in: wardIds } }).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error('Fetch ward leaves error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching leave records.' });
  }
});

router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, message: 'Only parents can access this.' });
    }

    const notifications = await Notification.find({
      $or: [
        { parentUserId: req.user._id },
        { parentMobile: req.user.mobile }
      ]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
  }
});

router.put('/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, message: 'Only parents can access this.' });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, $or: [{ parentUserId: req.user._id }, { parentMobile: req.user.mobile }] },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    res.json({ success: true, notification });
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, message: 'Only parents can access this.' });
    }

    await Notification.updateMany(
      { $or: [{ parentUserId: req.user._id }, { parentMobile: req.user.mobile }], read: false },
      { read: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Mark all notifications read error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
