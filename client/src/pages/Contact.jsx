import { useState } from 'react';
import api from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setStatus({ type: '', text: '' });
    try {
      await api.post('/contact', form);
      setStatus({ type: 'success', text: 'Thanks — your message has been sent. We will reply soon.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || 'Failed to send message.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Contact</h1>
        <p className="section-sub">Tell us about your project — we usually reply within two working days.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48 }} className="row">
          <aside>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginTop: 0 }}>Studio</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
              12 Example Street<br />
              Lisbon, Portugal<br /><br />
              hello@studio-arch.example<br />
              +1 (555) 010-0000
            </p>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginTop: 24 }}>Hours</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
              Mon–Fri · 9:00–18:00<br />
              Visits by appointment
            </p>
          </aside>

          <form className="form" onSubmit={submit}>
            {status.text && <div className={`alert ${status.type}`}>{status.text}</div>}
            <div className="row">
              <div className="field">
                <label>Name</label>
                <input name="name" value={form.name} onChange={update} required />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={update} required />
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label>Phone (optional)</label>
                <input name="phone" value={form.phone} onChange={update} />
              </div>
              <div className="field">
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={update} />
              </div>
            </div>
            <div className="field">
              <label>Message</label>
              <textarea name="message" value={form.message} onChange={update} required />
            </div>
            <button className="btn primary" disabled={sending}>
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
