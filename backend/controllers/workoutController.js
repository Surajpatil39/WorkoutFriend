const Workout = require('../models/Workout');

exports.addWorkout = async (req, res) => {
  try {
    const { exercise, sets, reps, weight } = req.body;
    const workout = await Workout.create({
      user: req.user,
      exercise,
      sets,
      reps,
      weight,
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout || workout.user.toString() !== req.user) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    await workout.deleteOne();
    res.json({ message: 'Workout removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
