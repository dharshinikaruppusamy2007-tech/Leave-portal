const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Leave = require('../models/Leave');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendSMS, buildApprovalSMS, buildRejectionSMS } = require('../services/smsService');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, endDate, type, reason, leaveType, fromDate, toDate } = req.body;

    const finalFrom = fromDate || date;
    const finalTo = toDate || endDate || '';
    const finalType = leaveType || type;

    if (!finalFrom || !finalType || !reason) {
      return res.status(400).json({ success: false, message: 'From date, leave type, and reason are required.' });
    }

    const leave = new Leave({
      studentId: req.userId,
      studentName: req.user.name || 'Student',
      studentEmail: req.user.email || '',
      regNo: req.user.regNo || '',
      department: req.user.department || '',
      year: req.user.year || '',
      section: req.user.section || '',
      leaveType: finalType,
      fromDate: finalFrom,
      toDate: finalTo,
      reason
    });

    await leave.save();
    res.status(201).json({ success: true, message: 'Leave application submitted successfully.', leave });
  } catch (err) {
    console.error('Submit leave error:', err);
    res.status(500).json({ success: false, message: 'Server error submitting leave request.' });
  }
});

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.userId }).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error('Fetch my leaves error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching leave requests.' });
  }
});

router.get('/pending', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only staff can view pending leaves.' });
    }
    const leaves = await Leave.find({ status: 'Pending' }).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error('Fetch pending leaves error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching pending leaves.' });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only staff can view all leaves.' });
    }
    const leaves = await Leave.find({}).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error('Fetch all leaves error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching leave records.' });
  }
});

router.put('/:id/approve', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only staff can approve leaves.' });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved', reviewedBy: req.userId, reviewedAt: new Date() },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    try {
      const student = await User.findById(leave.studentId);
      const parentMobile = student ? student.parentMobile : '';
      const parentName = student ? student.parentName : '';

      if (parentMobile) {
        const parentUser = await User.findOne({ mobile: parentMobile, role: 'parent' });

        const existingNotification = await Notification.findOne({ leaveId: leave._id, status: 'Approved' });
        if (!existingNotification) {
          await Notification.create({
            parentMobile,
            parentUserId: parentUser ? parentUser._id : null,
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
            status: 'Approved',
            leaveId: leave._id,
            messageEn: "Your ward's leave application has been approved by the staff.",
            messageTa: 'உங்கள் குழந்தையின் விடுப்பு விண்ணப்பம் பணியாளரால் அனுமதிக்கப்பட்டது.'
          });
        }

        const smsMessage = buildApprovalSMS(leave.studentName, leave.regNo, leave.fromDate, leave.toDate);
        const smsResult = await sendSMS(parentMobile, smsMessage);

        if (!smsResult.success) {
          console.error('[SMS] Failed to send approval SMS:', smsResult.error);
        }
      }
    } catch (notifErr) {
      console.error('[Notification/SMS] Error after approval:', notifErr.message);
    }

    res.json({ success: true, message: 'Leave approved.', leave });
  } catch (err) {
    console.error('Approve leave error:', err);
    res.status(500).json({ success: false, message: 'Server error approving leave.' });
  }
});

router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only staff can reject leaves.' });
    }

    const { reviewComment } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected', reviewedBy: req.userId, reviewedAt: new Date(), reviewComment: reviewComment || '' },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    try {
      const student = await User.findById(leave.studentId);
      const parentMobile = student ? student.parentMobile : '';
      const parentName = student ? student.parentName : '';

      if (parentMobile) {
        const parentUser = await User.findOne({ mobile: parentMobile, role: 'parent' });

        const existingNotification = await Notification.findOne({ leaveId: leave._id, status: 'Rejected' });
        if (!existingNotification) {
          await Notification.create({
            parentMobile,
            parentUserId: parentUser ? parentUser._id : null,
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
            status: 'Rejected',
            leaveId: leave._id,
            messageEn: "Your ward's leave application has been rejected by the staff.",
            messageTa: 'உங்கள் குழந்தையின் விடுப்பு விண்ணப்பம் பணியாளரால் நிராகரிக்கப்பட்டது.'
          });
        }

        const smsMessage = buildRejectionSMS(leave.studentName, leave.regNo, leave.fromDate, leave.toDate);
        const smsResult = await sendSMS(parentMobile, smsMessage);

        if (!smsResult.success) {
          console.error('[SMS] Failed to send rejection SMS:', smsResult.error);
        }
      }
    } catch (notifErr) {
      console.error('[Notification/SMS] Error after rejection:', notifErr.message);
    }

    res.json({ success: true, message: 'Leave rejected.', leave });
  } catch (err) {
    console.error('Reject leave error:', err);
    res.status(500).json({ success: false, message: 'Server error rejecting leave.' });
  }
});

module.exports = router;
