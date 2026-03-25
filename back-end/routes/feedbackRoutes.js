const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addFeedback, getCourseFeedbacks } = require('../controllers/feedbackController');

router.post('/', protect, addFeedback);
router.get('/course/:courseId', getCourseFeedbacks);

module.exports = router;