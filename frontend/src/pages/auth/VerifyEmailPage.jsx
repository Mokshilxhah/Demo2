import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification token.');
      return;
    }

    fetch(`/api/auth/verify-email/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          // Redirect to login after 4 seconds
          const timer = setTimeout(() => {
            navigate('/login?verified=true');
          }, 4000);
          return () => clearTimeout(timer);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. The link may have expired.');
        }
      })
      .catch(err => {
        console.error('Verify error:', err);
        setStatus('error');
        setMessage('Network error during verification. Please try again.');
      });
  }, [token, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-logo">⚡ DevQueue</div>

        {status === 'verifying' && (
          <div>
            <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 20px', borderThickness: 3 }} />
            <h1>Verifying Your Email...</h1>
            <p className="auth-sub">Checking token credentials with secure servers.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: 20 }}>✅</div>
            <h1 style={{ color: '#34d399' }}>Verified!</h1>
            <p className="auth-sub" style={{ marginBottom: 24 }}>{message}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--txt-2)', marginBottom: 20 }}>
              Redirecting you to the login screen in a few seconds...
            </p>
            <Link to="/login?verified=true" className="btn btn-primary btn-full">
              Go to Login Now
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: 20 }}>❌</div>
            <h1 style={{ color: '#f43f5e' }}>Verification Failed</h1>
            <p className="auth-sub" style={{ marginBottom: 24 }}>{message}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/register" className="btn btn-primary btn-full">
                Register Again
              </Link>
              <Link to="/login" className="link-muted" style={{ fontSize: '0.85rem' }}>
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
