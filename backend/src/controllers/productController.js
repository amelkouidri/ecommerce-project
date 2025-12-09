// src/controllers/productController.js
const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Erreur getProducts:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    res.json(product);
  } catch (err) {
    console.error('Erreur getProductById:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/products (utilisateur connecté)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock ?? 0,
      image,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Erreur createProduct:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Erreur updateProduct:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/products/:id (désactivation)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Produit désactivé' });
  } catch (err) {
    console.error('Erreur deleteProduct:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
