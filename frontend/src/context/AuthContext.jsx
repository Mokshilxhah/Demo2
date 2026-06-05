import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast trigger functions
  const toast = {
    show: (msg, type = 'error') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    },
    success: (msg) => toast.show(msg, 'success'),
    error: (msg) => toast.show(msg, 'error'),
    info: (msg) => toast.show(msg, 'info')
  };

  // Check session on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('loggedout') === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success('Signed out successfully.');
    }

    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => {
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response');
        }
        return r.json();
      })
      .then(data => {
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(err => {
        console.error('Session check failed:', err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (form) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server offline or returned a non-JSON response. Please ensure the backend server is running.');
    }
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Registration failed');
    setUser(data.user);
    return data.user;
  };

  const login = async (form) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server offline or returned a non-JSON response. Please ensure the backend server is running.');
    }
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');
    setUser(data.user);
    return data.user;
  };

  const loginAdmin = async (form) => {
    const res = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server offline or returned a non-JSON response. Please ensure the backend server is running.');
    }
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Admin login failed');
    setUser(data.admin);
    return data.admin;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      setUser(null);
      window.location.href = '/?loggedout=true';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginAdmin, logout, setUser, toast }}>
      {!loading && children}
      
      {/* Toast Overlay Container */}
      <div style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            pointerEvents: 'auto',
            minWidth: 300,
            padding: '14px 20px',
            borderRadius: 12,
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
            background: t.type === 'success' 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : t.type === 'info' 
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#ffffff',
            fontSize: '0.88rem',
            fontWeight: 600,
            animation: 'toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span style={{ fontSize: '1.1rem' }}>
              {t.type === 'success' ? '✅' : t.type === 'info' ? 'ℹ️' : '⚠️'}
            </span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
      
      {/* Toast keyframes styling injected inside code */}
      <style>{`
        @keyframes toast-slide-in {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
