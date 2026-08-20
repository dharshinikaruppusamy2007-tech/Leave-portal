const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  parentMobile: { type: String, required: true, index: true },
  parentUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  studentName: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  regNo: { type: String, default: '' },
  department: { type: String, default: '' },
  year: { type: String, default: '' },
  section: { type: String, default: '' },
  leaveType: { type: String, default: '' },
  fromDate: { type: String, default: '' },
  toDate: { type: String, default: '' },
  reason: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], required: true },
  leaveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Leave', required: true },
  read: { type: Boolean, default: false },
  messageEn: { type: String, default: '' },
  messageTa: { type: String, default: '' },
  smsSent: { type: Boolean, default: false },
  smsError: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ parentMobile: 1, createdAt: -1 });
notificationSchema.index({ leaveId: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
