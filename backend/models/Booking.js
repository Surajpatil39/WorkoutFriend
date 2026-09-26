const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  date: { type: String, required: true }, // ISO format YYYY-MM-DD
  slot: { type: String, required: true }, // e.g. "10:00"
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
