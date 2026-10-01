import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api';
import AdminLayout from './AdminLayout.jsx';

const EMPTY = {
  title: '', slug: '', client: '', location: '', year: '', category: 'Residential',
  summary: '', description: '', coverImage: '', media: [], featured: false, published: true, order: 0,
};

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInput = useRef(null);

  const [form, setForm] = useState(EMPTY);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/projects/admin/all`)
      .then((r) => {
        const p = r.data.find((x) => x._id === id);
        if (p) setForm({ ...EMPTY, ...p, year: p.year || '' });
      })
      .catch(() => setError('Failed to load project'));
  }, [id, isEdit]);

  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function onFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
  }

  function removeNewFile(idx) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeExistingMedia(url) {
    setForm((f) => ({ ...f, media: f.media.filter((m) => m.url !== url) }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === '_id' || k === 'createdAt' || k === 'updatedAt' || k === '__v') return;
        if (k === 'media') fd.append('media', JSON.stringify(v || []));
        else if (typeof v === 'boolean') fd.append(k, String(v));
        else if (v !== '' && v != null) fd.append(k, v);
      });
      newFiles.forEach((f) => fd.append('media', f));

      if (isEdit) await api.put(`/projects/${id}`, fd);
      else await api.post('/projects', fd);

      navigate('/admin/projects');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>{isEdit ? 'Edit Project' : 'New Project'}</h1>
        <Link to="/admin/projects" className="btn small">← Back</Link>
      </div>

      <form className="form" onSubmit={submit} style={{ maxWidth: '100%' }}>
        {error && <div className="alert error">{error}</div>}

        <div className="row">
          <div className="field">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={update} required />
          </div>
          <div className="field">
            <label>Slug</label>
            <input name="slug" value={form.slug} onChange={update} placeholder="auto-generated if empty" />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Client</label>
            <input name="client" value={form.client} onChange={update} />
          </div>
          <div className="field">
            <label>Location</label>
            <input name="location" value={form.location} onChange={update} />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Year</label>
            <input type="number" name="year" value={form.year} onChange={update} />
          </div>
          <div className="field">
            <label>Category</label>
            <select name="category" value={form.category} onChange={update}>
              {['Residential', 'Commercial', 'Cultural', 'Adaptive Reuse', 'Interior', 'Landscape', 'Other']
                .map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Summary (short, shown on cards)</label>
          <textarea name="summary" value={form.summary} onChange={update} style={{ minHeight: 70 }} />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={update} style={{ minHeight: 180 }} />
        </div>

        <div className="field">
          <label>Cover image URL (optional — first uploaded image is used if empty)</label>
          <input name="coverImage" value={form.coverImage} onChange={update} placeholder="/uploads/projects/…" />
        </div>

        <div className="field">
          <label>Media (images & videos)</label>
          <input ref={fileInput} type="file" multiple accept="image/*,video/*" onChange={onFilesSelected} />
          <div className="media-list">
            {form.media.map((m) => (
              <div key={m.url} className="media-thumb">
                {m.type === 'video'
                  ? <video src={m.url} muted preload="metadata" />
                  : <img src={m.url} alt="" />}
                <button type="button" onClick={() => removeExistingMedia(m.url)} title="Remove">×</button>
              </div>
            ))}
            {newFiles.map((f, i) => (
              <div key={i} className="media-thumb">
                {f.type.startsWith('video/')
                  ? <video src={URL.createObjectURL(f)} muted preload="metadata" />
                  : <img src={URL.createObjectURL(f)} alt="" />}
                <button type="button" onClick={() => removeNewFile(i)} title="Remove">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="row">
          <label className="checkbox">
            <input type="checkbox" name="featured" checked={form.featured} onChange={update} />
            Featured on home page
          </label>
          <label className="checkbox">
            <input type="checkbox" name="published" checked={form.published} onChange={update} />
            Published (visible on site)
          </label>
        </div>

        <div className="field" style={{ maxWidth: 160 }}>
          <label>Order</label>
          <input type="number" name="order" value={form.order} onChange={update} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save Project'}</button>
          <Link to="/admin/projects" className="btn">Cancel</Link>
        </div>
      </form>
    </AdminLayout>
  );
}
