const express = require('express');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const uploadRoot = path.join(__dirname, '..', '..', 'uploads', 'projects');

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

async function uniqueSlug(base, ignoreId) {
  let slug = base || `project-${Date.now()}`;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const q = { slug };
    if (ignoreId) q._id = { $ne: ignoreId };
    const existing = await Project.findOne(q).select('_id');
    if (!existing) return slug;
    slug = `${base}-${++i}`;
  }
}

function mediaUrl(file) {
  return `/uploads/projects/${file.filename}`;
}

function mediaTypeFromExt(name) {
  const ext = path.extname(name).toLowerCase();
  return ['.mp4', '.webm', '.mov', '.m4v'].includes(ext) ? 'video' : 'image';
}

// Public: list published projects
router.get('/', async (req, res) => {
  try {
    const { category, featured, q } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (q) filter.$text = { $search: q };

    const projects = await Project.find(filter).sort({ order: -1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Public: single project by slug
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true });
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load project' });
  }
});

// Admin: list all (including drafts)
router.get('/admin/all', requireAuth, async (_req, res) => {
  const projects = await Project.find().sort({ order: -1, createdAt: -1 });
  res.json(projects);
});

// Admin: create
router.post(
  '/',
  requireAuth,
  upload.array('media', 30),
  async (req, res) => {
    try {
      const body = parseBody(req.body);
      const files = req.files || [];
      const media = files.map((f) => ({
        type: mediaTypeFromExt(f.originalname),
        url: mediaUrl(f),
        caption: '',
      }));

      const slug = await uniqueSlug(body.slug || slugify(body.title));
      const project = await Project.create({
        ...body,
        slug,
        media: [...media, ...(body.media || [])],
        coverImage: body.coverImage || media.find((m) => m.type === 'image')?.url || '',
      });

      res.status(201).json(project);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message || 'Failed to create project' });
    }
  }
);

// Admin: update (supports adding new media files and removing existing)
router.put(
  '/:id',
  requireAuth,
  upload.array('media', 30),
  async (req, res) => {
    try {
      const body = parseBody(req.body);
      const files = req.files || [];
      const newMedia = files.map((f) => ({
        type: mediaTypeFromExt(f.originalname),
        url: mediaUrl(f),
        caption: '',
      }));

      const existing = await Project.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Not found' });

      const keptMedia = body.media || [];
      const removed = existing.media.filter((m) => !keptMedia.some((k) => k.url === m.url));
      for (const m of removed) deleteFileByUrl(m.url);

      const mergedMedia = [...keptMedia, ...newMedia];
      const slug = body.slug && body.slug !== existing.slug
        ? await uniqueSlug(slugify(body.slug), existing._id)
        : existing.slug;

      Object.assign(existing, body, { slug, media: mergedMedia });
      if (!existing.coverImage && mergedMedia.length) {
        existing.coverImage = mergedMedia.find((m) => m.type === 'image')?.url || mergedMedia[0].url;
      }
      await existing.save();
      res.json(existing);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message || 'Failed to update project' });
    }
  }
);

// Admin: delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    project.media.forEach((m) => deleteFileByUrl(m.url));
    if (project.coverImage) deleteFileByUrl(project.coverImage);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

function parseBody(raw) {
  const out = { ...raw };
  if (typeof out.media === 'string' && out.media.trim()) {
    try { out.media = JSON.parse(out.media); } catch { out.media = []; }
  }
  if (typeof out.featured === 'string') out.featured = out.featured === 'true';
  if (typeof out.published === 'string') out.published = out.published === 'true';
  if (typeof out.year === 'string') out.year = out.year ? Number(out.year) : undefined;
  if (typeof out.order === 'string') out.order = out.order ? Number(out.order) : 0;
  return out;
}

function deleteFileByUrl(url) {
  if (!url || !url.startsWith('/uploads/projects/')) return;
  const filename = url.replace('/uploads/projects/', '');
  const full = path.join(uploadRoot, filename);
  if (full.startsWith(uploadRoot) && fs.existsSync(full)) {
    try { fs.unlinkSync(full); } catch {}
  }
}

module.exports = router;
