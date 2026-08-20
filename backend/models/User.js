const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'staff', 'parent', 'hod'], required: true },
  regNo: { type: String, trim: true, default: '' },
  year: { type: String, trim: true, default: '' },
  department: { type: String, trim: true, default: '' },
  section: { type: String, trim: true, default: '' },
  mobile: { type: String, trim: true, default: '' },
  parentName: { type: String, trim: true, default: '' },
  parentMobile: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
