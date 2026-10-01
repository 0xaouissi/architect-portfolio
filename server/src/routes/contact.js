const express = require('express');
const Message = require('../models/Message');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required' });
    }
    const saved = await Message.create({ name, email, phone, subject, message });
    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.get('/admin', requireAuth, async (_req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

router.patch('/admin/:id/read', requireAuth, async (req, res) => {
  const msg = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!msg) return res.status(404).json({ error: 'Not found' });
  res.json(msg);
});

router.delete('/admin/:id', requireAuth, async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;
