const mongoose = require('mongoose');

const garmentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
  },
  garments: [garmentSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
    default: 'RECEIVED',
  },
  estimatedDeliveryDate: {
    type: Date,
    default: () => {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      return deliveryDate;
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
