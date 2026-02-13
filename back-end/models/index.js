const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

// Discussion Schema
const discussionSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    category: { type: String, required: true },
    tags: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    tag: { type: String, required: true }, // e.g., 'Beginner', 'Advanced'
    duration: { type: String, required: true },
    ageGroup: { type: String, required: true },
    price: { type: String, default: 'Free' },
    lessons: [{
        title: String,
        content: String,
        videoUrl: String
    }],
    createdAt: { type: Date, default: Date.now }
});

// FAQ Schema
const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' }
});

// Project/Showcase Schema (implied from discussions)
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    demoUrl: { type: String },
    repoUrl: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [String],
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('TheUser', userSchema);
const Discussion = mongoose.model('TheDiscussion', discussionSchema);
const Course = mongoose.model('TheCourse', courseSchema);
const FAQ = mongoose.model('TheFAQ', faqSchema);
const Project = mongoose.model('TheProject', projectSchema);

module.exports = {
    User,
    Discussion,
    Course,
    FAQ,
    Project
};
