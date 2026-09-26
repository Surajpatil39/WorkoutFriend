const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'trainer', 'admin'] },
  weight: { type: Number },
  height: { type: Number },
  goal: { type: String },
  phone: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  injuries: { type: String },
  emergencyContact: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
