import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await login(email, password);
      const to = location.state?.from || '/admin';
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <h1 className="section-title">Admin Login</h1>
        <p className="section-sub">Sign in to manage projects and messages.</p>
        <form className="form" onSubmit={submit}>
          {error && <div className="alert error">{error}</div>}
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</button>
        </form>
      </div>
    </section>
  );
}
