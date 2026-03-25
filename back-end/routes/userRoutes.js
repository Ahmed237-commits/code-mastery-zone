// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  getUserByEmail, 
  getUserById,
  getCurrentUser 
} = require('../controllers/userController');

// المسارات العامة (لا تحتاج مصادقة)
router.post('/', registerUser);           // POST /api/users
router.post('/login', loginUser);         // POST /api/users/login
router.get('/email/:email', getUserByEmail); // GET /api/users/email/:email

// المسارات المحمية (تحتاج مصادقة)
router.get('/me', protect, getCurrentUser);     // GET /api/users/me
router.get('/:id', protect, getUserById);       // GET /api/users/:id

module.exports = router;