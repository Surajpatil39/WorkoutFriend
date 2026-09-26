const express = require('express');
const router = express.Router();
const { addMeal, addMeals, analyzeFoodImage, getMeals } = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');
const { foodImageUpload } = require('../middleware/upload');

router.route('/').post(protect, addMeal).get(protect, getMeals);
router.post('/analyze-image', protect, foodImageUpload.single('image'), analyzeFoodImage);
router.post('/batch', protect, addMeals);

module.exports = router;
