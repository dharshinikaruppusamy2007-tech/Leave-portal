require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Leave = require('./models/Leave');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('=== CONNECTED TO MONGODB ===\n');

    // STEP 1: Check all students
    console.log('=== STEP 1: ALL STUDENT USER DOCUMENTS ===');
    const students = await User.find({ role: 'student' }).select('-password -__v');
    for (const s of students) {
      console.log(JSON.stringify({
        _id: s._id,
        name: s.name,
        email: s.email,
        regNo: s.regNo,
        department: s.department,
        section: s.section,
        year: s.year,
        mobile: s.mobile
      }, null, 2));
    }
    if (students.length === 0) console.log('NO STUDENTS FOUND IN DB!');

    // STEP 2: Check ALL leave documents
    console.log('\n=== STEP 2: ALL LEAVE DOCUMENTS ===');
    const leaves = await Leave.find({}).sort({ appliedAt: -1 }).limit(5);
    for (const l of leaves) {
      console.log(JSON.stringify({
        _id: l._id,
        studentId: l.studentId,
        studentName: l.studentName,
        studentEmail: l.studentEmail,
        regNo: l.regNo,
        department: l.department,
        section: l.section,
        leaveType: l.leaveType,
        fromDate: l.fromDate,
        toDate: l.toDate,
        reason: l.reason,
        status: l.status,
        appliedAt: l.appliedAt
      }, null, 2));
    }
    if (leaves.length === 0) console.log('NO LEAVE DOCUMENTS FOUND IN DB!');

    // STEP 3: Check the leave schema fields
    console.log('\n=== STEP 3: LEAVE SCHEMA FIELD NAMES ===');
    const leavePaths = Leave.schema.paths;
    console.log('Leave fields:', Object.keys(leavePaths).filter(k => !k.startsWith('_')));

    // STEP 4: Check a specific student's leaves
    if (students.length > 0) {
      const student = students[0];
      console.log(`\n=== STEP 4: LEAVES FOR STUDENT "${student.name}" (${student._id}) ===`);
      console.log(`Student regNo in User doc: "${student.regNo}"`);
      const studentLeaves = await Leave.find({ studentId: student._id });
      for (const l of studentLeaves) {
        console.log(JSON.stringify({
          _id: l._id,
          studentName: l.studentName,
          regNo: l.regNo,
          status: l.status
        }, null, 2));
      }
      if (studentLeaves.length === 0) console.log('No leaves for this student.');
    }

    // STEP 5: Check pending leaves (what staff sees)
    console.log('\n=== STEP 5: PENDING LEAVE DOCUMENTS (Staff View) ===');
    const pendingLeaves = await Leave.find({ status: 'Pending' }).sort({ appliedAt: -1 });
    for (const l of pendingLeaves) {
      console.log(JSON.stringify({
        _id: l._id,
        studentName: l.studentName,
        regNo: l.regNo,
        department: l.department,
        section: l.section,
        leaveType: l.leaveType,
        status: l.status
      }, null, 2));
    }
    if (pendingLeaves.length === 0) console.log('No pending leaves.');

  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

debug();
