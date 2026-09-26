const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, deletePost } = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload');

router.get('/posts', getPosts);
router.post('/posts', protect, upload.single('image'), createPost);
router.put('/posts/:id/like', protect, likePost);
router.delete('/posts/:id', protect, deletePost);

module.exports = router;
