const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/dashboard - Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get order counts by status
    const statusCountsResult = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const ordersPerStatus = {
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0
    };

    statusCountsResult.forEach(item => {
      ordersPerStatus[item._id] = item.count;
    });

    res.json({
      totalOrders,
      totalRevenue,
      ordersPerStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching dashboard stats', error: error.message });
  }
});

module.exports = router;
