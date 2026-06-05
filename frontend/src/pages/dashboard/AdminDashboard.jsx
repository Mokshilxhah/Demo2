import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout, toast } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    registeredClients: 0,
    avgDeliverySpeed: '14.2d'
  });
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null); // holds project object during edit

  const fetchAdminData = () => {
    setLoading(true);
    const fetchJson = (url) => 
      fetch(url, { credentials: 'include' })
        .then(r => {
          const contentType = r.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Non-JSON response`);
          }
          return r.json();
        });

    Promise.all([
      fetchJson('/api/projects/admin'),
      fetchJson('/api/projects/admin/stats')
    ])
      .then(([projectsData, statsData]) => {
        if (projectsData.success) {
          setProjects(projectsData.projects);
        }
        if (statsData.success) {
          setStats(statsData.stats);
        }
      })
      .catch(err => {
        console.error('Fetch admin data failed:', err);
        toast.error('Failed to load dashboard data. Ensure the backend is running.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const res = await fetch(`/api/projects/admin/${editingProject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: editingProject.stage,
          depositPaid: editingProject.depositPaid,
          finalPaid: editingProject.finalPaid,
          budget: editingProject.budget
        }),
        credentials: 'include'
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update project');
      }

      toast.success(`Successfully updated build status for "${editingProject.projectName}"`);
      setEditingProject(null);
      fetchAdminData(); // refresh lists & stats
    } catch (err) {
      toast.error(err.message || 'Error updating project details');
    }
  };

  const getStageColor = (stage) => {
    switch(stage) {
      case 'Submit': return '#9ea3b0'; // Muted Grey
      case 'Review': return '#93c5fd'; // Soft Blue
      case 'Planning': return '#818cf8'; // Indigo
      case 'Building': return '#fbbf24'; // Warm Amber
      case 'Final Review': return '#f9a8d4'; // Dusty Rose
      case 'Completed': return '#6ee7b7'; // Sage Mint
      default: return '#fbbf24';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111318', color: '#e8eaf0', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(17,19,24,0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div className="wrap" style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: "'Syne', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#fbbf24' }}>⚙️</span> DevQueue Admin
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '0.85rem', color: '#9ea3b0' }}>Admin Portal: <strong>{user?.name}</strong></span>
            <button 
              onClick={logout} 
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.82rem', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="wrap" style={{ padding: '40px 0' }}>
        {/* Banner Welcome */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <span className="label" style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.18)' }}>
              Admin Operations
            </span>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 800, marginTop: 8, marginBottom: 4 }}>
              Management Console
            </h1>
            <p style={{ color: '#9ea3b0', fontSize: '0.9rem' }}>Supervise build phases, confirm deposit/final payments, and oversee client deliverables.</p>
          </div>
          <div>
            <button 
              onClick={() => toast.info('To create a project queue request, please log in as a client and submit a booking request.')}
              className="btn btn-primary" 
              style={{ padding: '10px 20px', fontSize: '0.85rem', background: '#fbbf24', color: '#111318', border: 'none', fontWeight: 700 }}
            >
              + Create Booking Request
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
          {/* Card 1: Active Projects */}
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: 24,
            position: 'relative',
          }}>
            <div style={{ fontSize: '2.5rem', position: 'absolute', right: 20, top: 20, opacity: 0.12 }}>🚀</div>
            <div style={{ fontSize: '0.8rem', color: '#9ea3b0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Projects</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', fontFamily: "'Syne', sans-serif", margin: '12px 0 6px' }}>
              {loading ? '...' : stats.activeProjects}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#10b981' }}>● Pipelines operational</div>
          </div>

          {/* Card 2: Registered Clients */}
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: 24,
            position: 'relative',
          }}>
            <div style={{ fontSize: '2.5rem', position: 'absolute', right: 20, top: 20, opacity: 0.12 }}>👥</div>
            <div style={{ fontSize: '0.8rem', color: '#9ea3b0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Clients</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#6ee7b7', fontFamily: "'Syne', sans-serif", margin: '12px 0 6px' }}>
              {loading ? '...' : stats.registeredClients}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#9ea3b0' }}>In MongoDB database</div>
          </div>

          {/* Card 3: Avg completion duration */}
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: 24,
            position: 'relative',
          }}>
            <div style={{ fontSize: '2.5rem', position: 'absolute', right: 20, top: 20, opacity: 0.12 }}>⏱️</div>
            <div style={{ fontSize: '0.8rem', color: '#9ea3b0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Delivery Speed</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#818cf8', fontFamily: "'Syne', sans-serif", margin: '12px 0 6px' }}>
              {loading ? '...' : stats.avgDeliverySpeed}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#10b981' }}>✓ SLA target met</div>
          </div>
        </div>

        {/* Project Pipeline Manager Table */}
        <div style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: 28,
        }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 6 }}>Pipeline Build Requests</h3>
          <p style={{ fontSize: '0.85rem', color: '#9ea3b0', marginBottom: 24 }}>Update development stages, adjust contract budgets, and approve deposit/final payments.</p>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div className="spinner" />
            </div>
          ) : projects.length === 0 ? (
            <div style={{ border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 10, padding: '40px 20px', textAlign: 'center', color: '#5a6075' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: 10 }}>📦</span>
              No queue projects registered in the system yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9ea3b0' }}>
                    <th style={{ padding: 12 }}>Project</th>
                    <th style={{ padding: 12 }}>Client / Email</th>
                    <th style={{ padding: 12 }}>Tech Stack</th>
                    <th style={{ padding: 12 }}>Budget</th>
                    <th style={{ padding: 12 }}>Payments</th>
                    <th style={{ padding: 12 }}>Stage</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => {
                    const clientName = proj.userId?.name || proj.clientName || 'Unknown';
                    const clientEmail = proj.userId?.email || 'No email';
                    const color = getStageColor(proj.stage);
                    return (
                      <tr key={proj._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: 12, fontWeight: 600, color: '#e8eaf0' }}>{proj.projectName}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{ display: 'block', fontWeight: 600 }}>{clientName}</span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#5a6075' }}>{clientEmail}</span>
                        </td>
                        <td style={{ padding: 12 }}>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 5, padding: '3px 8px', color: '#9ea3b0' }}>
                            {proj.stack}
                          </span>
                        </td>
                        <td style={{ padding: 12, fontWeight: 700, color: '#6ee7b7' }}>{proj.budget}</td>
                        <td style={{ padding: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ fontSize: '0.72rem', color: proj.depositPaid ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                              {proj.depositPaid ? 'Deposit: Paid ✓' : 'Deposit: Pending ⏳'}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: proj.finalPaid ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                              {proj.finalPaid ? 'Final: Paid ✓' : 'Final: Pending ⏳'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: 12 }}>
                          <span style={{ fontSize: '0.72rem', background: `${color}15`, color: color, border: `1px solid ${color}30`, borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>
                            {proj.stage}
                          </span>
                        </td>
                        <td 
                          onClick={() => setEditingProject({ ...proj })}
                          style={{ padding: 12, textAlign: 'right', color: '#fbbf24', cursor: 'pointer', fontWeight: 600 }}
                        >
                          ⚙️ Manage
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ADMIN PROJECT EDITING MODAL (Glassmorphism Overlay) */}
      {editingProject && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(17, 19, 24, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 24,
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: '#181c24',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            width: '100%',
            maxWidth: 480,
            padding: 32,
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            animation: 'modal-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#fbbf24', textTransform: 'uppercase' }}>
                  Project Manager
                </span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.35rem', fontWeight: 700, margin: '4px 0 0 0' }}>
                  Edit Build Settings
                </h3>
              </div>
              <button 
                onClick={() => setEditingProject(null)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#9ea3b0',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Project Name (ReadOnly display) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '0.72rem', color: '#5a6075', textTransform: 'uppercase', fontWeight: 700 }}>Project Name</label>
                <input 
                  type="text" 
                  disabled 
                  value={editingProject.projectName} 
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 12px', color: '#5a6075', fontSize: '0.88rem' }}
                />
              </div>

              {/* Budget input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.72rem', color: '#9ea3b0', textTransform: 'uppercase', fontWeight: 700 }}>Contract Budget</label>
                <input 
                  type="text" 
                  required
                  value={editingProject.budget} 
                  onChange={e => setEditingProject({ ...editingProject, budget: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 12px', color: '#e8eaf0', fontSize: '0.88rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#fbbf24'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Stage dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.72rem', color: '#9ea3b0', textTransform: 'uppercase', fontWeight: 700 }}>Build Pipeline Stage</label>
                <select
                  value={editingProject.stage}
                  onChange={e => setEditingProject({ ...editingProject, stage: e.target.value })}
                  style={{
                    background: '#181c24',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: '#e8eaf0',
                    fontSize: '0.88rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Submit">Submit (Phase 1)</option>
                  <option value="Review">Review (Phase 2)</option>
                  <option value="Planning">Planning (Phase 3)</option>
                  <option value="Building">Building (Phase 4)</option>
                  <option value="Final Review">Final Review (Phase 5)</option>
                  <option value="Completed">Completed (Deployed)</option>
                </select>
              </div>

              {/* Payments Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, padding: 16 }}>
                <label style={{ fontSize: '0.72rem', color: '#9ea3b0', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4, display: 'block' }}>Payment Verifications</label>
                
                {/* 25% Deposit */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input 
                    type="checkbox" 
                    checked={editingProject.depositPaid}
                    onChange={e => setEditingProject({ ...editingProject, depositPaid: e.target.checked })}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#fbbf24' }}
                  />
                  <span>Confirm 25% Confirmation Deposit Paid</span>
                </label>

                {/* 75% final deployment */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem', marginTop: 6 }}>
                  <input 
                    type="checkbox" 
                    checked={editingProject.finalPaid}
                    onChange={e => setEditingProject({ ...editingProject, finalPaid: e.target.checked })}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#fbbf24' }}
                  />
                  <span>Confirm 75% Deployment Balance Paid</span>
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button 
                  type="button" 
                  onClick={() => setEditingProject(null)}
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '12px 0', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '12px 0', background: '#fbbf24', color: '#111318', border: 'none', fontWeight: 700 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Keyframe animations */}
      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
