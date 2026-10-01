# Studio.Arch — Architect Portfolio (React + Express + MongoDB)

A full-stack portfolio website for an architect. Public visitors can browse projects
with image/video galleries, read the studio bio, and send a contact message. The
owner signs in to a protected admin panel to create, edit and delete projects and
to read incoming messages.

## Features

- **Public site**: Home (hero + featured + recent), Projects index with category filter
  and search, Project detail with image/video gallery, About, Contact form.
- **Admin panel** (JWT protected): Dashboard, Projects CRUD with multi-file uploads
  (images + videos via multer), Messages inbox.
- **Backend**: Express + Mongoose, bcrypt-hashed admin password, `jsonwebtoken` sessions,
  static `/uploads` for media, CORS for the Vite dev server.

## Project layout

```
architect-portfolio/
├── server/              Express + MongoDB API
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/      Admin, Project, Message
│   │   ├── routes/      auth, projects, contact
│   │   ├── middleware/  auth (JWT), upload (multer)
│   │   ├── index.js
│   │   └── seed.js      creates admin + sample projects
│   ├── uploads/projects/  uploaded media (gitignored)
│   └── .env.example
└── client/              React + Vite SPA
    ├── src/
    │   ├── components/  Navbar, Footer, ProjectCard, MediaGallery, ProtectedRoute
    │   ├── pages/       Home, Projects, ProjectDetail, About, Contact, Login
    │   ├── pages/admin/ Dashboard, ProjectsList, ProjectForm, Messages
    │   ├── api.js       axios instance with JWT interceptor
    │   ├── auth.jsx     AuthProvider / useAuth
    │   ├── App.jsx      routes
    │   └── styles.css
    └── vite.config.js   proxies /api and /uploads to :5000
```

## Prerequisites

- **Node.js** 18+ (you already have v24 installed)
- **MongoDB** running locally (`mongod`) or a MongoDB Atlas connection string

## Setup

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

Or manually:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | API port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/architect_portfolio` |
| `JWT_SECRET` | Secret used to sign admin tokens — **change this** | — |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_ORIGIN` | Allowed CORS origin(s), comma-separated | `http://localhost:5173` |
| `ADMIN_EMAIL` | Email of the seeded admin | `admin@example.com` |
| `ADMIN_PASSWORD` | Password of the seeded admin — **change this** | `ChangeMe123!` |
| `ADMIN_NAME` | Display name of the seeded admin | `Studio Admin` |

### 3. Seed the database

Creates the admin user and three sample projects:

```bash
npm run seed          # from server/
# or from root:
npm run seed
```

### 4. Run

Start MongoDB first (`mongod` or Atlas), then in two terminals:

```bash
# Terminal 1
npm run dev:server    # http://localhost:5000

# Terminal 2
npm run dev:client    # http://localhost:5173
```

Vite proxies `/api` and `/uploads` to the Express server, so no CORS issues in dev.

### 5. Sign in

Visit `http://localhost:5173/login` and use the credentials from `server/.env`
(defaults: `admin@example.com` / `ChangeMe123!`).

## Admin panel

- **Dashboard** — counts of projects, messages and unread messages.
- **Projects** — list, create, edit, delete. The form accepts multiple image/video
  files at once; existing media can be removed with the × button on each thumbnail.
  Fields: title, slug, client, location, year, category, summary, description,
  cover image URL, featured flag, published flag, sort order.
- **Messages** — inbox of contact-form submissions; click a row to expand the body,
  messages are marked read on open, and can be deleted.

## API reference

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | – | Health check |
| `POST` | `/api/auth/login` | – | Returns JWT |
| `GET` | `/api/auth/me` | Bearer | Current admin |
| `GET` | `/api/projects` | – | Published projects (`?category=&featured=&q=`) |
| `GET` | `/api/projects/:slug` | – | Single published project |
| `GET` | `/api/projects/admin/all` | Bearer | All projects incl. drafts |
| `POST` | `/api/projects` | Bearer | Create (multipart/form-data) |
| `PUT` | `/api/projects/:id` | Bearer | Update (multipart/form-data) |
| `DELETE` | `/api/projects/:id` | Bearer | Delete + remove media files |
| `POST` | `/api/contact` | – | Submit contact message |
| `GET` | `/api/contact/admin` | Bearer | List messages |
| `PATCH` | `/api/contact/admin/:id/read` | Bearer | Mark read |
| `DELETE` | `/api/contact/admin/:id` | Bearer | Delete message |

## Production build

```bash
cd client && npm run build      # outputs client/dist
cd ../server && npm start
```

Serve `client/dist` from any static host (Netlify, Vercel, nginx) and point
`VITE_API_URL` at the deployed API, or serve the built client from Express.

## Notes

- Upload size limit is 100 MB per file (adjustable in `server/src/middleware/upload.js`).
- Allowed extensions: `.jpg .jpeg .png .webp .gif .avif .mp4 .webm .mov .m4v`.
- Uploaded files are stored in `server/uploads/projects/` and served at `/uploads/projects/<filename>`.
- The seed script is idempotent — running it again will not duplicate the admin or sample projects.
