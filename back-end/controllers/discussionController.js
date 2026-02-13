const asyncHandler = require('express-async-handler');
const { Discussion, User } = require('../models');
const { formatTimeAgo, generateExcerpt } = require('../utils/helperFunctions');

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Public
const getDiscussions = asyncHandler(async (req, res) => {
    const discussions = await Discussion.find().populate('user', 'name avatar').sort({ createdAt: -1 });

    // Transform data for frontend
    const transformedDiscussions = discussions.map(discussion => ({
        _id: discussion._id,
        title: discussion.title,
        excerpt: discussion.excerpt || generateExcerpt(discussion.content),
        category: discussion.category,
        user: discussion.user,
        likes: discussion.likes,
        comments: discussion.comments.length, // Convert array to count
        time: formatTimeAgo(discussion.createdAt),
        createdAt: discussion.createdAt
    }));

    res.json(transformedDiscussions);
});

// @desc    Get single discussion
// @route   GET /api/discussions/:id
// @access  Public
const getDiscussionById = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id)
        .populate('user', 'name avatar')
        .populate('comments.user', 'name avatar');

    if (discussion) {
        res.json(discussion);
    } else {
        res.status(404);
        throw new Error('Discussion not found');
    }
});

// @desc    Create a discussion
// @route   POST /api/discussions
// @access  Public (for now)
const createDiscussion = asyncHandler(async (req, res) => {
    // For now, accepting userId in body or creating a dummy user if not exists
    // In a real app, this would come from auth middleware
    let user = await User.findOne({ email: 'demo@example.com' });
    if (!user) {
        user = await User.create({
            name: 'Demo User',
            email: 'demo@example.com',
            avatar: 'https://i.pravatar.cc/150?u=demo'
        });
    }

    const { title, content, tags, category } = req.body;

    const discussion = await Discussion.create({
        title,
        content,
        excerpt: generateExcerpt(content),
        category: category || 'general',
        tags,
        user: user._id
    });

    if (discussion) {
        await discussion.populate('user', 'name avatar');
        res.status(201).json(discussion);
    } else {
        res.status(400);
        throw new Error('Invalid discussion data');
    }
});

// @desc    Toggle like on a discussion
// @route   PUT /api/discussions/:id/like
// @access  Public (for now)
const toggleLike = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // For now, using demo user. In production, use authenticated user
    let user = await User.findOne({ email: 'demo@example.com' });
    if (!user) {
        user = await User.create({
            name: 'Demo User',
            email: 'demo@example.com',
            avatar: 'https://i.pravatar.cc/150?u=demo'
        });
    }

    const userId = user._id;
    const hasLiked = discussion.likedBy.includes(userId);

    if (hasLiked) {
        // Unlike: Remove user from likedBy and decrement likes
        discussion.likedBy = discussion.likedBy.filter(id => !id.equals(userId));
        discussion.likes = Math.max(0, discussion.likes - 1);
    } else {
        // Like: Add user to likedBy and increment likes
        discussion.likedBy.push(userId);
        discussion.likes += 1;
    }

    await discussion.save();

    res.json({
        _id: discussion._id,
        likes: discussion.likes,
        liked: !hasLiked
    });
});

// @desc    Add a comment to a discussion
// @route   POST /api/discussions/:id/comments
// @access  Public (for now)
const addComment = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // For now, using demo user. In production, use authenticated user
    let user = await User.findOne({ email: 'demo@example.com' });
    if (!user) {
        user = await User.create({
            name: 'Demo User',
            email: 'demo@example.com',
            avatar: 'https://i.pravatar.cc/150?u=demo'
        });
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
        res.status(400);
        throw new Error('Comment content is required');
    }

    discussion.comments.push({
        user: user._id,
        content: content.trim(),
        createdAt: new Date()
    });

    await discussion.save();

    res.json({
        _id: discussion._id,
        comments: discussion.comments.length
    });
});

module.exports = {
    getDiscussions,
    getDiscussionById,
    createDiscussion,
    toggleLike,
    addComment
};
