const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

// Seed initial admin if doesn't exist
const seedAdmin = async () => {
  const adminExists = await Admin.findOne({ username: 'admin' });
  if (!adminExists) {
    await Admin.create({ username: 'admin', password: 'password123' });
    console.log('Default admin seeded: admin / password123');
  }
};
seedAdmin();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: 'admin' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
