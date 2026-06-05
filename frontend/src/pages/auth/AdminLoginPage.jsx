import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/ui/InputField';
import AuthVisual from '../../components/auth/AuthVisual';

const ADMIN_IMAGE = "/images/Admin.jpg";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const { loginAdmin, toast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(form);
      toast.success('Successfully logged into Admin dashboard!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Column - Form */}
      <div className="auth-left">
        
        <div className="auth-left-content">
          {/* Logo brand */}
          <Link to="/" className="auth-brand">
            <div className="auth-brand-logo" style={{ background: 'var(--a3)', color: '#0d1018' }}>BQ</div>
            <span className="auth-brand-name">BuildQueue</span>
          </Link>

          <h1>Welcome Admin</h1>
          <p className="auth-sub">Access the administrative workspace to manage active build pipelines, adjust queues, and verify deliverables.</p>

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="admin@buildqueue.com"
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

            <button type="submit" className="btn-dark btn-full btn-admin" style={{ marginTop: 12 }} disabled={loading}>
              {loading ? <div className="spinner" /> : 'Enter Control Console →'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column - Illustration Panel */}
      <AuthVisual image={ADMIN_IMAGE} isAdmin={true} />
    </div>
  );
}
