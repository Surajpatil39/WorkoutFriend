const mongoose = require('mongoose');

const trainerSchema = mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  bio: { type: String },
  experience: { type: Number }, // in years
  profileImage: { type: String, default: 'https://via.placeholder.com/150' },
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    slots: [{ type: String }] // e.g. ["09:00", "10:00", "11:00"]
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Trainer', trainerSchema);
