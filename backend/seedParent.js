require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Notification = require('./models/Notification');

async function seedParent() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existingParent = await User.findOne({ mobile: '9876543210', role: 'parent' });
    if (existingParent) {
      console.log('Parent already exists:', existingParent.name, existingParent.mobile);
      console.log('Parent ID:', existingParent._id);

      const wards = await User.find({ parentMobile: '9876543210', role: 'student' }).select('name regNo');
      console.log('Linked wards:', wards);
      await mongoose.disconnect();
      process.exit(0);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Parent@123', salt);

    const parent = new User({
      name: 'Rajesh Kumar',
      email: 'parent_9876543210@leaveportal.local',
      password: hashedPassword,
      role: 'parent',
      mobile: '9876543210'
    });

    await parent.save();
    console.log('Parent created:', parent.name, parent.mobile);
    console.log('Parent ID:', parent._id);

    const kalai = await User.findOne({ name: 'Kalai', role: 'student' });
    if (kalai) {
      kalai.parentName = 'Rajesh Kumar';
      kalai.parentMobile = '9876543210';
      await kalai.save();
      console.log('Linked Kalai to parent. Kalai parentMobile:', kalai.parentMobile);
    } else {
      console.log('Student Kalai not found. Please create student first.');
    }

    const dharshni = await User.findOne({ name: 'Dharshni', role: 'student' });
    if (dharshni) {
      const existingNotifs = await Notification.find({ parentUserId: parent._id });
      if (existingNotifs.length === 0) {
        const kalaiLeaves = await require('./models/Leave').find({ studentId: kalai ? kalai._id : null });
        for (const leave of kalaiLeaves) {
          const msgEn = leave.status === 'Approved'
            ? "Your ward's leave application has been approved by the staff."
            : leave.status === 'Rejected'
            ? "Your ward's leave application has been rejected by the staff."
            : "Your ward's leave application is pending for staff approval.";
          const msgTa = leave.status === 'Approved'
            ? 'உங்கள் குழந்தையின் விடுப்பு விண்ணப்பம் பணியாளரால் அனுமதிக்கப்பட்டது.'
            : leave.status === 'Rejected'
            ? 'உங்கள் குழந்தையின் விடுப்பு விண்ணப்பம் பணியாளரால் நிராகரிக்கப்பட்டது.'
            : 'உங்கள் குழந்தையின் விடுப்பு விண்ணப்பம் பணியாளர் அனுமதிக்காக காத்திருக்கிறது.';

          await Notification.create({
            parentMobile: '9876543210',
            parentUserId: parent._id,
            studentName: leave.studentName,
            studentId: leave.studentId,
            regNo: leave.regNo,
            department: leave.department,
            year: leave.year,
            section: leave.section,
            leaveType: leave.leaveType,
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            reason: leave.reason,
            status: leave.status,
            leaveId: leave._id,
            messageEn: msgEn,
            messageTa: msgTa
          });
        }
        console.log('Created notifications for existing leave records.');
      }
    }

    console.log('\n=== SEED COMPLETE ===');
    console.log('Parent Login Credentials:');
    console.log('  Mobile: 9876543210');
    console.log('  Password: Parent@123');
    console.log('  Role: Parent Module');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    process.exit(0);
  }
}

seedParent();
