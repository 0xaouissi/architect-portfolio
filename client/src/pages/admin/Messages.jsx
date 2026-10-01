import { useEffect, useState } from 'react';
import api from '../../api';
import AdminLayout from './AdminLayout.jsx';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/contact/admin');
      setMessages(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggle(m) {
    if (open === m._id) return setOpen(null);
    setOpen(m._id);
    if (!m.read) {
      await api.patch(`/contact/admin/${m._id}/read`);
      setMessages((prev) => prev.map((x) => (x._id === m._id ? { ...x, read: true } : x)));
    }
  }

  async function remove(id) {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/contact/admin/${id}`);
    load();
  }

  return (
    <AdminLayout>
      <h1>Messages</h1>
      {loading ? <div className="empty">Loading…</div> : !messages.length ? (
        <div className="empty">No messages yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr><th>From</th><th>Subject</th><th>Received</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <>
                <tr key={m._id} style={{ cursor: 'pointer', fontWeight: m.read ? 400 : 600 }} onClick={() => toggle(m)}>
                  <td>{m.name} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>&lt;{m.email}&gt;</span></td>
                  <td>{m.subject || '(no subject)'}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{new Date(m.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="actions" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn small danger" onClick={(e) => { e.stopPropagation(); remove(m._id); }}>Delete</button>
                    </div>
                  </td>
                </tr>
                {open === m._id && (
                  <tr key={`${m._id}-body`}>
                    <td colSpan={4} style={{ background: 'var(--surface-2)' }}>
                      <div style={{ whiteSpace: 'pre-wrap', padding: '8px 0' }}>{m.message}</div>
                      {m.phone && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Phone: {m.phone}</div>}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
