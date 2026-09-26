const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

const adminProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.role === 'admin') {
        req.user = user;
        next();
      } else {
        res.status(403).json({ message: 'Admin access required' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
};

const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const bookingCount = await Booking.countDocuments();
    res.json({ userCount, trainerCount, bookingCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAllUsers, getAllTrainers, adminProtect };
