require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const users = [
  {
    name: 'Leave Portal Staff',
    email: 'staff@leaveportal.com',
    password: 'Staff@123',
    role: 'staff'
  },
  {
    name: 'Leave Portal HOD',
    email: 'hod@leaveportal.com',
    password: 'Hod@123',
    role: 'hod'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`User already exists: ${userData.email} (${userData.role})`);
        continue;
      }
      const user = new User(userData);
      await user.save();
      console.log(`Created: ${userData.email} | role: ${userData.role} | name: ${userData.name}`);
    }

    console.log('Seed completed.');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
