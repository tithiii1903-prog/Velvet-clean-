const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

// Seed initial admin if doesn't exist
const seedAdmin = async () => {
  try {
    let admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      await Admin.create({ username: 'admin', password: 'password123' });
      console.log('Default admin seeded: admin / password123');
    } else {
      // Ensure the password is reset to password123 in case it was changed or corrupted
      admin.password = 'password123';
      await admin.save();
      console.log('Default admin password reset to password123');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log(`Login failed: User ${username} not found`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log(`Login failed: Incorrect password for ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log(`Login successful: ${username}`);
    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: 'admin' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { router, seedAdmin };
