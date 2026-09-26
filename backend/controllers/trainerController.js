const Trainer = require('../models/Trainer');
const Booking = require('../models/Booking');

exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { trainerId, date } = req.query;
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    // Use UTC date to avoid timezone shifts that change the day of the week
    const dateParts = date.split('-'); // YYYY-MM-DD
    const utcDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
    const dayName = utcDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

    const trainerAvailability = trainer.availability.find(a => a.day === dayName);

    if (!trainerAvailability) {
      return res.json({ slots: [] });
    }

    const bookedBookings = await Booking.find({ trainer: trainerId, date });
    const bookedSlots = bookedBookings.map(b => b.slot);

    const availableSlots = trainerAvailability.slots.filter(slot => !bookedSlots.includes(slot));
    res.json({ slots: availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { trainerId, date, slot } = req.body;
    
    const existingBooking = await Booking.findOne({ trainer: trainerId, date, slot });
    if (existingBooking) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    const booking = await Booking.create({
      user: req.user,
      trainer: trainerId,
      date,
      slot,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user }).populate('trainer', 'name specialty').sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.user.toString() !== req.user) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await booking.deleteOne();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
