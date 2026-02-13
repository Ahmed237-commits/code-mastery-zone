const express = require('express');
const router = express.Router();
const { getDiscussions, getDiscussionById, createDiscussion, toggleLike, addComment } = require('../controllers/discussionController');

router.route('/')
    .get(getDiscussions)
    .post(createDiscussion);

router.route('/:id')
    .get(getDiscussionById);

router.route('/:id/like')
    .put(toggleLike);

router.route('/:id/comments')
    .post(addComment);

module.exports = router;
