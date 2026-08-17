const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Leave = require('../models/Leave');

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

    res.json({ success: true, message: 'Leave rejected.', leave });
  } catch (err) {
    console.error('Reject leave error:', err);
    res.status(500).json({ success: false, message: 'Server error rejecting leave.' });
  }
});

module.exports = router;
