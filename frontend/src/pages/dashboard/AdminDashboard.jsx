import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [usersCount, setUsersCount] = useState(0);

  // We can fetch a list of users or just display some stats.
  // Since we are running in local dev, let's keep it robust and premium.
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--txt)', fontFamily: 'var(--font)' }}>
      {/* Navbar */}
      <header style={{
        borderBottom: '1px solid rgba(245,158,11,0.2)',
        background: 'rgba(8,12,20,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div className="wrap" style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-alt)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--accent)' }}>⚙️</span> DevQueue Admin
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--txt-2)' }}>Admin Panel: <strong>{user?.name}</strong></span>
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
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <span className="label" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--accent)', border: '1px solid rgba(245,158,11,0.2)' }}>Admin Portal</span>
            <h1 className="heading-lg" style={{ marginTop: 8 }}>Management Panel</h1>
            <p className="body-md" style={{ color: 'var(--txt-2)' }}>Supervise project submissions, configure pipelines, and track client metrics.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-admin" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              + Create Project
            </button>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          marginBottom: 40
        }}>
          {/* Card 1: Total Queue Items */}
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 24,
            position: 'relative',
          }}>
            <div style={{ fontSize: '2.5rem', position: 'absolute', right: 20, top: 20, opacity: 0.15 }}>🚀</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--txt-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Projects</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-alt)', margin: '12px 0 6px' }}>4</div>
            <div style={{ fontSize: '0.78rem', color: '#10b981' }}>● All builds operational</div>
          </div>

          {/* Card 2: Queued Clients */}
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 24,
            position: 'relative',
          }}>
            <div style={{ fontSize: '2.5rem', position: 'absolute', right: 20, top: 20, opacity: 0.15 }}>👥</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--txt-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Clients</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-alt)', margin: '12px 0 6px' }}>12</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--txt-2)' }}>+2 this week</div>
          </div>

          {/* Card 3: Avg completion duration */}
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 24,
            position: 'relative',
          }}>
            <div style={{ fontSize: '2.5rem', position: 'absolute', right: 20, top: 20, opacity: 0.15 }}>⏱️</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--txt-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Delivery Speed</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--indigo)', fontFamily: 'var(--font-alt)', margin: '12px 0 6px' }}>14.2d</div>
            <div style={{ fontSize: '0.78rem', color: '#10b981' }}>✓ SLA target met</div>
          </div>
        </div>

        {/* Project Pipeline Manager Grid */}
        <div style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 28,
        }}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-alt)', fontWeight: 600, marginBottom: 6 }}>Pipeline queue requests</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--txt-2)', marginBottom: 24 }}>Update stages, approve budgets, and trigger notifications.</p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--txt-2)' }}>
                  <th style={{ padding: 12 }}>Project</th>
                  <th style={{ padding: 12 }}>Client</th>
                  <th style={{ padding: 12 }}>Stack</th>
                  <th style={{ padding: 12 }}>Budget</th>
                  <th style={{ padding: 12 }}>Stage</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { p: 'SaaS Dashboard', c: 'Aryan M.', s: 'React+Node', b: '$4,200', st: 'In Progress', cl: 'var(--primary)' },
                  { p: 'E-commerce API', c: 'Dev K.', s: 'Django+Postgres', b: '$3,800', st: 'Queue Stage', cl: 'var(--accent)' },
                  { p: 'Chat Web App', c: 'Nisha S.', s: 'Next.js+Redis', b: '$2,500', st: 'Completed', cl: '#10b981' }
                ].map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: 12, fontWeight: 600 }}>{item.p}</td>
                    <td style={{ padding: 12, color: 'var(--txt-2)' }}>{item.c}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 5, padding: '3px 8px' }}>
                        {item.s}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontWeight: 700 }}>{item.b}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ fontSize: '0.72rem', background: `${item.cl}15`, color: item.cl, border: `1px solid ${item.cl}30`, borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>
                        {item.st}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', color: 'var(--txt-3)', cursor: 'not-allowed' }}>
                      ⚙️ Manage
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
