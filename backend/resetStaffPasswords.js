require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function resetPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const staff = await User.findOne({ email: 'staff@leaveportal.com' });
    if (staff) {
      staff.password = 'Staff@123';
      await staff.save();
      console.log('Staff password reset successfully');
    } else {
      console.log('Staff account not found');
    }

    const hod = await User.findOne({ email: 'hod@leaveportal.com' });
    if (hod) {
      hod.password = 'Hod@123';
      await hod.save();
      console.log('HOD password reset successfully');
    } else {
      console.log('HOD account not found');
    }
  } catch (err) {
    console.error('Reset error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

resetPasswords();
