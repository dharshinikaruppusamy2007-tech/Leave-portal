const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true, trim: true },
  studentEmail: { type: String, default: '', trim: true },
  regNo: { type: String, default: '' },
  department: { type: String, default: '' },
  section: { type: String, default: '' },
  leaveType: { type: String, enum: ['Medical', 'On-Duty', 'Personal'], required: true },
  fromDate: { type: String, required: true },
  toDate: { type: String, default: '' },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  reviewComment: { type: String, default: '' }
});

leaveSchema.index({ studentId: 1 });
leaveSchema.index({ status: 1 });

module.exports = mongoose.model('Leave', leaveSchema);
