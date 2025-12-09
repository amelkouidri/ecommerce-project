// src/routes/productRoutes.js
const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes publiques (tout le monde peut lire le catalogue)
router.get('/', getProducts);        // GET /api/products
router.get('/:id', getProductById);  // GET /api/products/:id

// Routes protégées (il faut être connecté pour modifier le catalogue)
// Pour simplifier, on ne met pas isAdmin pour l'instant
router.post('/', protect, createProduct);         // POST /api/products
router.put('/:id', protect, updateProduct);       // PUT /api/products/:id
router.delete('/:id', protect, deleteProduct);    // DELETE /api/products/:id

module.exports = router;
