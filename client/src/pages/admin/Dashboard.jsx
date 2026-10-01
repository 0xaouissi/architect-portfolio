import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import AdminLayout from './AdminLayout.jsx';
import { useAuth } from '../../auth.jsx';

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/projects/admin/all').catch(() => ({ data: [] })),
      api.get('/contact/admin').catch(() => ({ data: [] })),
    ]).then(([p, m]) => {
      setStats({
        projects: p.data.length,
        messages: m.data.length,
        unread: m.data.filter((x) => !x.read).length,
      });
    });
  }, []);

  return (
    <AdminLayout>
      <h1>Welcome, {admin?.name || 'Admin'}</h1>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard label="Projects" value={stats.projects} to="/admin/projects" />
        <StatCard label="Messages" value={stats.messages} to="/admin/messages" />
        <StatCard label="Unread" value={stats.unread} to="/admin/messages" />
      </div>
      <div style={{ marginTop: 32 }}>
        <Link to="/admin/projects/new" className="btn primary">+ New Project</Link>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, to }) {
  return (
    <Link to={to} className="card" style={{ padding: 20 }}>
      <div className="card-meta">{label}</div>
      <div style={{ fontSize: 36, fontWeight: 500, marginTop: 6 }}>{value}</div>
    </Link>
  );
}
