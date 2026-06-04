import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--txt)', fontFamily: 'var(--font)' }}>
      {/* Navbar space placeholder */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,12,20,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div className="wrap" style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-alt)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--primary)' }}>⚡</span> DevQueue
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--txt-2)' }}>Logged in: <strong>{user?.name}</strong></span>
            <button 
              onClick={logout} 
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.82rem', borderColor: 'var(--border)' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="wrap" style={{ padding: '40px 0' }}>
        <div style={{ marginBottom: 32 }}>
          <span className="label">Dashboard</span>
          <h1 className="heading-lg" style={{ marginTop: 8 }}>Welcome, {user?.name}!</h1>
          <p className="body-md" style={{ color: 'var(--txt-2)' }}>Track and manage your submitted projects in real-time.</p>
        </div>

        {/* Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
          marginBottom: 40
        }}>
          {/* Card 1: Account Status */}
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 24,
          }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-alt)', fontWeight: 600, marginBottom: 16, color: 'var(--primary)' }}>👤 Account Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--txt-2)' }}>Email:</span>
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--txt-2)' }}>Verified Status:</span>
                <span style={{ color: user?.isEmailVerified ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                  {user?.isEmailVerified ? '✓ Verified' : '⚠️ Pending Verification'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--txt-2)' }}>Role:</span>
                <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--txt-2)' }}>Joined:</span>
                <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Queue Metrics */}
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 24,
          }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-alt)', fontWeight: 600, marginBottom: 16, color: 'var(--accent)' }}>📋 Queue Position</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', height: '100%', paddingBottom: 20 }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--txt-2)' }}>No active builds inside queue. Submit an inquiry to begin.</div>
              <a href="/#tech" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 18px', fontSize: '0.82rem', marginTop: 12 }}>
                Use Stack Suggestor
              </a>
            </div>
          </div>
        </div>

        {/* Projects Queue shell */}
        <div style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 28,
        }}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-alt)', fontWeight: 600, marginBottom: 10 }}>Your Queue Projects</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--txt-2)', marginBottom: 20 }}>Projects and tasks currently active in dev production.</p>
          
          <div style={{ border: '1px dashed var(--border)', borderRadius: 10, padding: '40px 20px', textAlign: 'center', color: 'var(--txt-3)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 10 }}>📦</span>
            You have not booked any stacks yet. Check your suggested project flow above!
          </div>
        </div>
      </main>
    </div>
  );
}
