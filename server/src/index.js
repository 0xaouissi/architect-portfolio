require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
