const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: admin._id.toString(), email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.sub).select('-passwordHash');
    if (!admin) return res.status(401).json({ error: 'Invalid token' });
    res.json({ admin });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = router;
