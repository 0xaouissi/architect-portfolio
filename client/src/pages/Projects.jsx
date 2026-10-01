import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import ProjectCard from '../components/ProjectCard.jsx';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/projects')
      .then((r) => setProjects(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchCat = category === 'All' || p.category === category;
      const matchQ = !q || [p.title, p.location, p.summary, p.client].some((v) => (v || '').toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [projects, category, query]);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Projects</h1>
        <p className="section-sub">Browse the studio's built and in-progress work.</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          {categories.map((c) => (
            <button
              key={c}
              className={`btn small ${category === c ? 'primary' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
          <input
            type="search"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginLeft: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 14px', borderRadius: 999, fontSize: 13, minWidth: 180 }}
          />
        </div>

        {loading ? (
          <div className="empty">Loading…</div>
        ) : filtered.length ? (
          <div className="grid projects">
            {filtered.map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
        ) : (
          <div className="empty">No projects match your filters.</div>
        )}
      </div>
    </section>
  );
}
