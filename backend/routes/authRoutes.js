const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log('REGISTER REQUEST RECEIVED', req.body);
  try {
    const { name, email, password, role, regNo, year, department, section, mobile, parentName, parentMobile } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    let finalEmail = email;

    if (role === 'parent') {
      if (!mobile) {
        return res.status(400).json({ success: false, message: 'Mobile number is required for parent registration.' });
      }
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number.' });
      }
      const existingMobile = await User.findOne({ mobile, role: 'parent' });
      if (existingMobile) {
        return res.status(409).json({ success: false, message: 'An account with this mobile number already exists.' });
      }
      finalEmail = `parent_${mobile}@leaveportal.local`;
    } else {
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
      }
      finalEmail = email.toLowerCase();
      const existingEmail = await User.findOne({ email: finalEmail });
      if (existingEmail) {
        return res.status(409).json({ success: false, message: 'Email already registered.' });
      }
    }

    if (regNo && role === 'student') {
      const existingReg = await User.findOne({ regNo });
      if (existingReg) {
        return res.status(400).json({ success: false, message: 'An account with this register number already exists.' });
      }
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password should be at least 6 characters.' });
    }

    const user = new User({
      name,
      email: finalEmail,
      password,
      role,
      regNo: regNo || '',
      year: year || '',
      department: department || '',
      section: section || '',
      mobile: mobile || '',
      parentName: parentName || '',
      parentMobile: parentMobile || ''
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: user.toJSON()
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.post('/login', async (req, res) => {
  console.log('LOGIN REQUEST RECEIVED', req.body);
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Email, password, and role are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.role !== role) {
      return res.status(401).json({ success: false, message: `This account is registered as ${user.role}, not ${role}.` });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: user.toJSON()
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
