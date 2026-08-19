require('dotenv').config();
const mongoose = require('mongoose');
const Leave = require('./models/Leave');
const User = require('./models/User');

async function backfill() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const leaves = await Leave.find({});
    let updated = 0;

    for (const leave of leaves) {
      const student = await User.findById(leave.studentId);
      if (!student) continue;

      let needsUpdate = false;
      const updates = {};

      if (!leave.regNo && student.regNo) {
        updates.regNo = student.regNo;
        needsUpdate = true;
      }
      if (!leave.department && student.department) {
        updates.department = student.department;
        needsUpdate = true;
      }
      if (!leave.year && student.year) {
        updates.year = student.year;
        needsUpdate = true;
      }
      if (!leave.section && student.section) {
        updates.section = student.section;
        needsUpdate = true;
      }
      if (!leave.studentEmail && student.email) {
        updates.studentEmail = student.email;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Leave.findByIdAndUpdate(leave._id, { $set: updates });
        console.log(`Updated leave ${leave._id} for ${leave.studentName}:`, updates);
        updated++;
      }
    }

    console.log(`\nBackfill complete. ${updated} leave(s) updated.`);
  } catch (err) {
    console.error('Backfill error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

backfill();
