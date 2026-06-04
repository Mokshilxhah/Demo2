import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/ui/InputField';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(form);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth">
      <div className="admin-badge">⚙️ Admin Portal</div>
      <div className="auth-bg" />
      <div className="auth-card admin-card">
        <div className="auth-logo" style={{ background: 'linear-gradient(135deg, var(--accent), #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <span>⚡</span> DevQueue Admin
        </div>
        <h1>Admin Access</h1>
        <p className="auth-sub">Enter credentials to manage active queues.</p>

        {error && (
          <div className="error-banner" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#fbbf24' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Admin Email"
            name="email"
            type="email"
            placeholder="admin@devqueue.studio"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit" className="btn btn-primary btn-full btn-admin" style={{ marginTop: 12 }} disabled={loading}>
            {loading ? <div className="spinner" /> : 'Access Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  );
}
