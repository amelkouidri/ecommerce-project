// src/routes/orderRoutes.js
const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateDeliveryStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Route de test SANS auth
router.get('/test', (req, res) => {
  res.json({ message: 'Route /api/orders OK' });
});

// 🛡 À partir d'ici : routes protégées
router.use(protect);

// Créer une commande
router.post('/', createOrder);

// Historique commandes de l'utilisateur
router.get('/my', getMyOrders);

// Détail d'une commande
router.get('/:id', getOrderById);

// Annuler une commande
router.put('/:id/cancel', cancelOrder);

// Mettre à jour le statut de livraison
router.put('/:id/delivery', updateDeliveryStatus);

module.exports = router;
