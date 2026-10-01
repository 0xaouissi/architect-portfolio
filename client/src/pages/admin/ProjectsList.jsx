import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import AdminLayout from './AdminLayout.jsx';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/projects/admin/all');
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await api.delete(`/projects/${id}`);
    load();
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Projects</h1>
        <Link to="/admin/projects/new" className="btn primary">+ New Project</Link>
      </div>

      {loading ? <div className="empty">Loading…</div> : !projects.length ? (
        <div className="empty">No projects yet. Create your first one.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th><th>Category</th><th>Year</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id}>
                <td>
                  <Link to={`/projects/${p.slug}`} style={{ color: 'var(--accent)' }}>{p.title}</Link>
                  {p.featured && <span className="tag" style={{ marginLeft: 8 }}>Featured</span>}
                </td>
                <td>{p.category}</td>
                <td>{p.year || '—'}</td>
                <td>{p.published ? <span className="tag">Published</span> : <span className="tag">Draft</span>}</td>
                <td>
                  <div className="actions" style={{ justifyContent: 'flex-end' }}>
                    <Link to={`/admin/projects/${p._id}/edit`} className="btn small">Edit</Link>
                    <button className="btn small danger" onClick={() => remove(p._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
