// src/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

// Utilitaire pour construire les lignes de commande + total
const buildOrderItemsAndTotal = async (items) => {
  let total = 0;
  const builtItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      throw new Error(`Produit introuvable`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Stock insuffisant pour le produit: ${product.name}`);
    }

    product.stock -= item.quantity;
    await product.save();

    const lineTotal = product.price * item.quantity;
    total += lineTotal;

    builtItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }

  return { builtItems, total };
};

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'La commande doit contenir au moins un produit',
      });
    }

    if (!deliveryAddress) {
      return res
        .status(400)
        .json({ message: 'Adresse de livraison requise' });
    }

    const { builtItems, total } = await buildOrderItemsAndTotal(items);

    const order = await Order.create({
      user: req.user._id,
      items: builtItems,
      totalAmount: total,
      deliveryAddress,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      deliveryStatus: 'pending',
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Erreur createOrder:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error('Erreur getMyOrders:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name price'
    );

    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    res.json(order);
  } catch (err) {
    console.error('Erreur getOrderById:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({ message: 'Commande déjà annulée' });
    }

    order.orderStatus = 'cancelled';
    order.deliveryStatus = 'cancelled';
    order.paymentStatus = 'failed';

    await order.save();

    res.json({ message: 'Commande annulée', order });
  } catch (err) {
    console.error('Erreur cancelOrder:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/orders/:id/delivery
const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;

    if (!deliveryStatus) {
      return res.status(400).json({ message: 'Nouveau statut requis' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    order.deliveryStatus = deliveryStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error('Erreur updateDeliveryStatus:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateDeliveryStatus,
};
