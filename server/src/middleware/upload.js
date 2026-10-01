const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadRoot = path.join(__dirname, '..', '..', 'uploads', 'projects');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = crypto.randomBytes(8).toString('hex');
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const allowed = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif',
  '.mp4', '.webm', '.mov', '.m4v',
]);

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.has(ext)) return cb(new Error(`Unsupported file type: ${ext}`));
    cb(null, true);
  },
});

module.exports = upload;
