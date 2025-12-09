// src/app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { registerUser, loginUser, getMe } = require('./controllers/authController');
const { protect } = require('./middleware/authMiddleware');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Connexion BDD
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test racine
app.get('/', (req, res) => {
  res.json({ message: 'API E-commerce opérationnelle 🚀' });
});

// =============== ROUTES AUTH =================

// POST http://localhost:5000/api/auth/register
app.post('/api/auth/register', registerUser);

// POST http://localhost:5000/api/auth/login
app.post('/api/auth/login', loginUser);

// GET http://localhost:5000/api/auth/me
app.get('/api/auth/me', protect, getMe);

// =============== ROUTES PRODUITS =================
app.use('/api/products', productRoutes);

// =============== ROUTES COMMANDES =================
app.use('/api/orders', orderRoutes);

// =============================================
module.exports = app;
