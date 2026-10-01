import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import MediaGallery from '../components/MediaGallery.jsx';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setProject(null);
    api.get(`/projects/${slug}`)
      .then((r) => setProject(r.data))
      .catch(() => setError('Project not found.'));
  }, [slug]);

  if (error) return <div className="container section"><div className="alert error">{error}</div><Link to="/projects" className="btn">← Back</Link></div>;
  if (!project) return <div className="container section"><div className="empty">Loading…</div></div>;

  return (
    <article className="project-detail">
      <div className="container">
        <Link to="/projects" className="btn small">← All Projects</Link>
        <header className="project-header" style={{ marginTop: 20 }}>
          <span className="tag">{project.category}</span>
          <h1>{project.title}</h1>
          {project.summary && <p className="prose" style={{ color: 'var(--muted)' }}>{project.summary}</p>}
          <div className="project-meta-row">
            {project.client && <div><strong>Client</strong>{project.client}</div>}
            {project.location && <div><strong>Location</strong>{project.location}</div>}
            {project.year && <div><strong>Year</strong>{project.year}</div>}
          </div>
        </header>

        {project.coverImage && (
          <img src={project.coverImage} alt={project.title} style={{ borderRadius: 'var(--radius)', width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
        )}

        {project.description && (
          <div className="prose" style={{ marginTop: 32 }}>
            {project.description.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}

        <MediaGallery media={project.media || []} />
      </div>
    </article>
  );
}
