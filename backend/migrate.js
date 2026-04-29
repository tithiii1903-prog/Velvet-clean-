const mongoose = require('mongoose');
const crypto = require('crypto');
const Order = require('./models/Order');
require('dotenv').config();

async function migrate() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/dry_laundry');
    console.log('Connected to MongoDB');

    const orders = await Order.find({ orderId: { $exists: false } });
    console.log(`Found ${orders.length} orders without an orderId.`);

    for (let order of orders) {
      order.orderId = `ORD-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      await order.save();
      console.log(`Updated order ${order._id} with orderId ${order.orderId}`);
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
