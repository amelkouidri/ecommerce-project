// src/routes/authRoutes.js
const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST http://localhost:5000/api/auth/register
router.post('/register', registerUser);

// POST http://localhost:5000/api/auth/login
router.post('/login', loginUser);

// GET http://localhost:5000/api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
