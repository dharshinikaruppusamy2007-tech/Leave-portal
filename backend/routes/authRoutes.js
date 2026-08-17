const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log('REGISTER REQUEST RECEIVED', req.body);
  try {
    const { name, email, password, role, regNo, year, department, section, mobile } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
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
      email: email.toLowerCase(),
      password,
      role,
      regNo: regNo || '',
      year: year || '',
      department: department || '',
      section: section || '',
      mobile: mobile || ''
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
