const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');

// GET /api/orders - Get all orders, filterable by status, customerName, phone
router.get('/', async (req, res) => {
  try {
    const { status, search, isHistory } = req.query;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    let filters = [];

    // 1. Handle History vs Active vs Manual Status
    if (isHistory === 'true') {
      // History mode: ONLY delivered and older than 24h
      filters.push({ status: 'DELIVERED' });
      filters.push({ updatedAt: { $lt: twentyFourHoursAgo } });
    } else if (isHistory === 'false') {
      // Active mode: All non-delivered + delivered within 24h
      if (status && status !== 'ALL') {
        // If they specifically filter status in active view
        if (status === 'DELIVERED') {
          filters.push({ status: 'DELIVERED', updatedAt: { $gte: twentyFourHoursAgo } });
        } else {
          filters.push({ status: status });
        }
      } else {
        // Default active view (ALL)
        filters.push({
          $or: [
            { status: { $ne: 'DELIVERED' } },
            { status: 'DELIVERED', updatedAt: { $gte: twentyFourHoursAgo } }
          ]
        });
      }
    } else if (status && status !== 'ALL') {
      // Fallback if isHistory is not specified but status is
      filters.push({ status: status });
    }

    // 2. Handle Search
    if (search) {
      filters.push({
        $or: [
          { customerName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { orderId: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const query = filters.length > 0 ? { $and: filters } : {};
    
    // For debugging - remove in production
    // console.log('Final Query:', JSON.stringify(query, null, 2));

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching orders', error: error.message });
  }
});

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, garments } = req.body;

    if (!customerName || !phone || !garments || garments.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate total amount
    let totalAmount = 0;
    garments.forEach(item => {
      totalAmount += item.quantity * item.price;
    });

    const orderId = `ORD-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const newOrder = new Order({
      orderId,
      customerName,
      phone,
      garments,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error: error.message });
  }
});

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting order', error: error.message });
  }
});

module.exports = router;
