// controllers/userController.js
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/* =========================
   Password Helpers
========================= */
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt) {
  if (!password || !salt) throw new Error('Password or salt missing');
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

/* =========================
   Register User
========================= */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  console.log('📝 Register attempt:', { name, email });

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password too short (min 8 characters)' });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);

  const user = await User.create({ 
    name, 
    email, 
    password: hashedPassword, 
    salt, 
    role: 'user' 
  });

  // إنشاء توكن للمستخدم الجديد
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  console.log('✅ User registered successfully:', { id: user._id, email: user.email });

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      role: user.role 
    },
  });
});

/* =========================
   Login User
========================= */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 Login attempt:', { email });

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // البحث عن المستخدم بالإيميل
  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ User not found:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  if (!user.salt) {
    console.log('❌ User has no salt:', email);
    return res.status(500).json({ error: 'User data corrupted' });
  }

  console.log('✅ User found:', { 
    id: user._id, 
    email: user.email,
    hasPassword: !!user.password,
    hasSalt: !!user.salt
  });

  // تشفير الباسورد المدخل ومقارنته مع المخزن
  const hashedPassword = hashPassword(password, user.salt);
  
  if (hashedPassword !== user.password) {
    console.log('❌ Password mismatch for user:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // ✅ التحقق من وجود JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not defined in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  console.log('✅ JWT_SECRET found, length:', process.env.JWT_SECRET.length);

  // إنشاء توكن جديد
  let token;
  try {
    token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    console.log('✅ Token generated successfully');
  } catch (jwtError) {
    console.error('❌ JWT signing error:', jwtError);
    return res.status(500).json({ error: 'Token generation failed' });
  }

  console.log('✅ Login successful for user:', email);

  res.json({
    message: 'Login successful',
    token,
    user: { 
      id: user._id.toString(),
      name: user.name, 
      email: user.email,
      role: user.role 
    },
  });
});

/* =========================
   Get User by ID
========================= */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  console.log('🔍 Fetching user by ID:', id);

  const user = await User.findById(id).select('-password -salt');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  console.log('✅ User found:', user.email);
  res.json(user);
});

/* =========================
   Get Current User (from token)
========================= */
const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user بيتم تعيينه من middleware المصادقة
  const user = await User.findById(req.user.id).select('-password -salt');
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt
  });
});

/* =========================
   Get User by Email (مضاف حديثاً)
========================= */
const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params;
  
  console.log('🔍 Fetching user by email:', email);

  const user = await User.findOne({ email }).select('-password -salt');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  console.log('✅ User found:', user.email);
  res.json(user);
});

module.exports = { 
  registerUser, 
  loginUser, 
  getUserById,
  getCurrentUser,
  getUserByEmail // ✅ دلوقتي موجودة
};