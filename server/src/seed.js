require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Project = require('./models/Project');

const sampleProjects = [
  {
    title: 'Casa Lumière',
    slug: 'casa-lumiere',
    client: 'Private Residence',
    location: 'Lisbon, Portugal',
    year: 2024,
    category: 'Residential',
    summary: 'A courtyard house framed by rammed earth walls and filtered daylight.',
    description:
      'Casa Lumière reinterprets the traditional courtyard typology for a steep suburban site. The plan is organised around a shaded garden that draws cool air through the living spaces, while deep reveals and perforated screens modulate the intense afternoon sun.',
    featured: true,
    published: true,
    order: 10,
  },
  {
    title: 'Meridian Tower',
    slug: 'meridian-tower',
    client: 'Meridian Group',
    location: 'Dubai, UAE',
    year: 2023,
    category: 'Commercial',
    summary: 'A 28-storey mixed-use tower with a stepped public podium.',
    description:
      'The tower steps back at every seventh floor to create sky gardens that serve the offices below. The podium opens onto a shaded plaza linking two metro exits.',
    featured: true,
    published: true,
    order: 9,
  },
  {
    title: 'Atelier Nord',
    slug: 'atelier-nord',
    client: 'Atelier Nord SA',
    location: 'Antwerp, Belgium',
    year: 2022,
    category: 'Adaptive Reuse',
    summary: 'A former printworks converted into studios and a public gallery.',
    description:
      'The existing sawtooth roof was retained and lined with acoustic felt. New insertions are expressed in blackened steel so the historic brick shell remains legible.',
    featured: false,
    published: true,
    order: 8,
  },
];

(async () => {
  try {
    await connectDB();

    const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const name = process.env.ADMIN_NAME || 'Studio Admin';

    let admin = await Admin.findOne({ email });
    if (!admin) {
      const passwordHash = await Admin.hashPassword(password);
      admin = await Admin.create({ name, email, passwordHash });
      console.log(`[seed] created admin: ${email}`);
    } else {
      console.log(`[seed] admin already exists: ${email}`);
    }

    for (const p of sampleProjects) {
      const exists = await Project.findOne({ slug: p.slug });
      if (!exists) {
        await Project.create(p);
        console.log(`[seed] created project: ${p.title}`);
      }
    }

    console.log('[seed] done');
    process.exit(0);
  } catch (err) {
    console.error('[seed] failed:', err);
    process.exit(1);
  }
})();
