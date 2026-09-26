const express = require('express');
const router = express.Router();
const { addWorkout, getWorkouts, deleteWorkout } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addWorkout).get(protect, getWorkouts);
router.route('/:id').delete(protect, deleteWorkout);

module.exports = router;
