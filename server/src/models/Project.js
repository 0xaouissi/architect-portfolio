const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    client: { type: String, default: '' },
    location: { type: String, default: '' },
    year: { type: Number },
    category: { type: String, default: 'Residential' },
    coverImage: { type: String, default: '' },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    media: { type: [mediaSchema], default: [] },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', summary: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);
