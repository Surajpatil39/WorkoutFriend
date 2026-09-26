const express = require('express');
const router = express.Router();
const { getTrainers, bookSlot, getMyBookings, getAvailableSlots, cancelBooking } = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/trainers', getTrainers);
router.get('/slots', protect, getAvailableSlots);
router.post('/book', protect, bookSlot);
router.get('/my-bookings', protect, getMyBookings);
router.delete('/bookings/:id', protect, cancelBooking);

module.exports = router;
