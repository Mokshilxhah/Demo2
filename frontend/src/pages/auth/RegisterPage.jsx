import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/ui/InputField';

function VerifyEmailPrompt({ email }) {
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-logo">⚡ DevQueue</div>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>✉️</div>
        <h1>Verify Your Email</h1>
        <p className="auth-sub" style={{ marginBottom: 24 }}>
          We've sent a verification link to <strong style={{ color: 'var(--txt)' }}>{email}</strong>.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 28, fontSize: '0.85rem', color: 'var(--txt-2)', textAlign: 'left', lineHeight: 1.6 }}>
          💡 <strong>Local Testing:</strong> Since you're running locally, we also printed the direct verification link in your <strong>backend terminal</strong>. You can click it there to verify instantly.
        </div>
        <Link to="/login" className="btn btn-primary btn-full">
          Proceed to Login
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: verify prompt
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return <VerifyEmailPrompt email={form.email} />;
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">
          <span>⚡</span> DevQueue
        </div>
        <h1>Create Account</h1>
        <p className="auth-sub">Join the dev queue. Track your project live.</p>

        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            name="name"
            placeholder="Moksh Shah"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Min 8 characters, 1 upper, 1 number"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            showStrength
            required
          />
          
          <InputField
            label="Phone (optional, for WhatsApp updates)"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <div className="spinner" /> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
