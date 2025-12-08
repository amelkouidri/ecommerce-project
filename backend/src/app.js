// src/app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { registerUser, loginUser, getMe } = require('./controllers/authController');
const { protect } = require('./middleware/authMiddleware');

const app = express();

// Connexion BDD
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API E-commerce opérationnelle 🚀' });
});

// 🔥 ROUTES D'AUTH ICI

// Inscription
// POST http://localhost:5000/api/auth/register
app.post('/api/auth/register', registerUser);

// Connexion
// POST http://localhost:5000/api/auth/login
app.post('/api/auth/login', loginUser);

// Profil utilisateur connecté
// GET http://localhost:5000/api/auth/me
app.get('/api/auth/me', protect, getMe);

module.exports = app;
  