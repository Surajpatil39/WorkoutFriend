const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllTrainers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/trainers', protect, admin, getAllTrainers);

module.exports = router;
