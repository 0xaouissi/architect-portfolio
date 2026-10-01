import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProjectCard from '../components/ProjectCard.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/projects?featured=true').then((r) => setFeatured(r.data.slice(0, 3))).catch(() => {});
    api.get('/projects').then((r) => setRecent(r.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Architecture that<br />frames everyday life.</h1>
          <p>
            We design residential, cultural and commercial buildings with a focus on light,
            material honesty and the quiet rituals of the people who use them.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="btn primary">View Projects</Link>
            <Link to="/contact" className="btn">Start a Conversation</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Selected Work</h2>
          <p className="section-sub">A few recent projects from the studio.</p>
          {recent.length ? (
            <div className="grid projects">
              {recent.map((p) => <ProjectCard key={p._id} project={p} />)}
            </div>
          ) : (
            <div className="empty">No projects yet. Sign in to the admin panel to add some.</div>
          )}
          <div style={{ marginTop: 32 }}>
            <Link to="/projects" className="btn">All Projects →</Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <h2 className="section-title">Featured</h2>
            <div className="grid projects">
              {featured.map((p) => <ProjectCard key={p._id} project={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
