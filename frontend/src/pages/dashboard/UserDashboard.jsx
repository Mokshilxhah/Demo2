import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user, logout, toast } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState('track'); // 'book', 'track', 'invoice'
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    projectName: '',
    stack: 'MERN Stack (React, Node.js, Express, MongoDB)',
    budget: '$4,000'
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (user) {
      toast.success(`Welcome to your workspace, ${user.name}!`);
    }
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoadingProjects(true);
    fetch('/api/projects/user', { credentials: 'include' })
      .then(r => {
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server offline or returned a non-JSON response');
        }
        return r.json();
      })
      .then(data => {
        if (data.success) {
          setProjects(data.projects);
          if (data.projects.length > 0) {
            setSelectedProjectId(data.projects[0]._id);
          }
        }
      })
      .catch(err => {
        console.error('Fetch user projects failed:', err);
      })
      .finally(() => setLoadingProjects(false));
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.projectName || !bookingForm.budget) {
      toast.error('Please fill in all booking fields.');
      return;
    }
    setBookingLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm),
        credentials: 'include'
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Booking request failed');
      }
      toast.success('Project booked successfully in the development queue!');
      setBookingForm({
        projectName: '',
        stack: 'MERN Stack (React, Node.js, Express, MongoDB)',
        budget: '$4,000'
      });
      
      // Refresh lists and default view
      fetchProjects();
      setActiveTab('track');
    } catch (err) {
      toast.error(err.message || 'Failed to submit booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const selectedProject = projects.find(p => p._id === selectedProjectId) || projects[0];

  const parseBudget = (budgetString) => {
    if (!budgetString) return 0;
    const num = parseFloat(budgetString.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // 5 Stages Stepper configuration
  const phases = ['Submit', 'Review', 'Planning', 'Building', 'Final Review'];
  
  const getPhaseIndex = (stage) => {
    if (stage === 'Completed') return 5;
    return phases.indexOf(stage);
  };

  const getPhaseDescription = (stage) => {
    switch (stage) {
      case 'Submit':
        return 'Your project request has been submitted to our engineering queue. We are verifying availability and technical requirements.';
      case 'Review':
        return 'Our lead engineers are conducting a technical code review and structural evaluation of your requested architecture specs.';
      case 'Planning':
        return 'Workflow mappings, route architectures, and schema layouts are being established. Preparing initial repositories.';
      case 'Building':
        return 'Active code construction. Our engineers are building backend models, crafting frontend UI modules, and configuring endpoints.';
      case 'Final Review':
        return 'End-to-end integration testing, code auditing, and performance audits are underway. Setting up server environments.';
      case 'Completed':
        return 'All deliverables are fully completed, verified for quality, and successfully deployed to staging/production hosting!';
      default:
        return 'No active phase updates recorded yet.';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111318', color: '#e8eaf0', fontFamily: "'Inter', sans-serif", paddingBottom: 60 }}>
      {/* Top Navbar */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(17,19,24,0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div className="wrap" style={{ height: 75, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: "'Syne', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#6ee7b7' }}>⚡</span> DevQueue
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: '0.85rem', color: '#9ea3b0', textAlign: 'right' }}>
              <span style={{ display: 'block', color: '#5a6075', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Workspace Profile</span>
              <strong>{user?.name}</strong>
            </div>
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

      <main className="wrap" style={{ marginTop: 40 }}>
        {/* Banner Welcome */}
        <div style={{ marginBottom: 36 }}>
          <span className="label" style={{ background: 'rgba(110,231,183,0.08)', color: '#6ee7b7', border: '1px solid rgba(110,231,183,0.18)' }}>
            Client Portal
          </span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.2rem', fontWeight: 800, marginTop: 8, marginBottom: 4, letterSpacing: '-0.02em' }}>
            Hello, {user?.name.split(' ')[0]}!
          </h1>
          <p style={{ color: '#9ea3b0', fontSize: '0.92rem' }}>Configure project blueprints, track pipeline phases, and pay invoices instantly.</p>
        </div>

        {/* TOP TAB CONTROL (No Sidebar) */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 32,
          gap: 8,
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {[
            { id: 'track', label: '📡 Track Order', desc: 'Active build stages' },
            { id: 'book', label: '📝 Book Stack', desc: 'Submit new build' },
            { id: 'invoice', label: '💳 Payment Invoices', desc: 'Installment breakdown' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #fbbf24' : '2px solid transparent',
                  color: isActive ? '#fbbf24' : '#9ea3b0',
                  padding: '12px 24px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  borderRadius: '8px 8px 0 0',
                  outline: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  minWidth: 150
                }}
                onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = '#e8eaf0'; }}
                onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = '#9ea3b0'; }}
              >
                <span>{tab.label}</span>
                <span style={{ fontSize: '0.68rem', color: isActive ? 'rgba(251,191,36,0.6)' : '#5a6075', fontWeight: 400 }}>{tab.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: TRACK ORDER TAB */}
        {activeTab === 'track' && (
          <div>
            {loadingProjects ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div className="spinner" />
              </div>
            ) : projects.length === 0 ? (
              <div style={{
                border: '1px dashed rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '60px 24px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.01)'
              }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 16 }}>📦</span>
                <h3 style={{ fontSize: '1.2rem', fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>No active queue builds</h3>
                <p style={{ color: '#9ea3b0', fontSize: '0.88rem', maxWidth: 380, margin: '0 auto 20px', lineHeight: 1.5 }}>
                  You have not registered any stack project bookings yet. Head to the Booking tab to launch your first queue request.
                </p>
                <button 
                  onClick={() => setActiveTab('book')} 
                  className="btn btn-primary"
                  style={{ background: '#fbbf24', color: '#111318', border: 'none', fontWeight: 700, padding: '10px 20px' }}
                >
                  Book a Project Stack
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Project Selector (If multiple projects) */}
                {projects.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', padding: '10px 16px', borderRadius: 10, alignSelf: 'flex-start', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.8rem', color: '#9ea3b0', fontWeight: 600 }}>Active Project:</span>
                    <select
                      value={selectedProjectId}
                      onChange={e => setSelectedProjectId(e.target.value)}
                      style={{
                        background: '#181c24',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#e8eaf0',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: '0.85rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {projects.map(p => (
                        <option key={p._id} value={p._id}>{p.projectName}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Tracking Progress Card */}
                <div style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 20,
                  padding: '32px 28px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", color: selectedProject.color || '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Pipeline Tracker
                      </span>
                      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 700, marginTop: 4 }}>
                        {selectedProject.projectName}
                      </h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#5a6075', display: 'block' }}>Configured Technology</span>
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.78rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 6,
                        padding: '4px 12px',
                        marginTop: 4,
                        fontWeight: 600,
                        color: '#6ee7b7'
                      }}>
                        {selectedProject.stack}
                      </span>
                    </div>
                  </div>

                  {/* Visual Stepper */}
                  <div style={{ margin: '40px 0' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      position: 'relative',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 20
                    }}>
                      {/* Connecting Line (for large displays) */}
                      <div style={{
                        position: 'absolute',
                        top: 22,
                        left: '5%',
                        right: '5%',
                        height: 2,
                        background: 'rgba(255,255,255,0.08)',
                        zIndex: 1,
                        display: 'block'
                      }} />
                      {/* Dynamic filling connection line */}
                      <div style={{
                        position: 'absolute',
                        top: 22,
                        left: '5%',
                        width: `${Math.min(100, (getPhaseIndex(selectedProject.stage) / 4) * 90)}%`,
                        height: 2,
                        background: '#fbbf24',
                        shadow: '0 0 10px #fbbf24',
                        zIndex: 2,
                        display: 'block',
                        transition: 'all 0.4s ease'
                      }} />

                      {phases.map((phase, index) => {
                        const activeIndex = getPhaseIndex(selectedProject.stage);
                        const isCompleted = index < activeIndex;
                        const isActive = index === activeIndex;
                        const isCurrentOrPast = index <= activeIndex;

                        return (
                          <div key={phase} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 10,
                            position: 'relative',
                            flex: 1,
                            minWidth: 80
                          }}>
                            {/* Circle Dot */}
                            <div style={{
                              width: 44,
                              height: 44,
                              borderRadius: '50%',
                              background: isCompleted ? '#fbbf24' : isActive ? '#111318' : 'rgba(24,28,36,0.9)',
                              border: isCurrentOrPast ? '2px solid #fbbf24' : '2px solid rgba(255,255,255,0.08)',
                              color: isCompleted ? '#111318' : isCurrentOrPast ? '#fbbf24' : '#5a6075',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              boxShadow: isActive ? '0 0 16px rgba(251,191,36,0.4)' : 'none',
                              transition: 'all 0.3s'
                            }}>
                              {isCompleted ? '✓' : index + 1}
                            </div>
                            
                            {/* Phase Name label */}
                            <span style={{
                              marginTop: 12,
                              fontSize: '0.82rem',
                              fontWeight: isCurrentOrPast ? 700 : 500,
                              color: isActive ? '#fbbf24' : isCurrentOrPast ? '#e8eaf0' : '#5a6075',
                              textTransform: 'uppercase',
                              letterSpacing: '0.02em'
                            }}>
                              {phase}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stage description block */}
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: 12,
                    padding: '24px 20px',
                    marginTop: 40,
                    borderLeft: `4px solid ${selectedProject.stage === 'Completed' ? '#6ee7b7' : '#fbbf24'}`
                  }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>📡</span> Pipeline Phase Status: <strong style={{ color: selectedProject.stage === 'Completed' ? '#6ee7b7' : '#fbbf24' }}>{selectedProject.stage}</strong>
                    </h4>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.88rem', color: '#9ea3b0', lineHeight: 1.6 }}>
                      {getPhaseDescription(selectedProject.stage)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: BOOK STACK TAB */}
        {activeTab === 'book' && (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20,
              padding: '36px 32px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>Book a Project Stack</h2>
              <p style={{ color: '#9ea3b0', fontSize: '0.88rem', marginBottom: 28 }}>Submit custom workspace bookings directly to our engineering build cycles.</p>

              <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Project Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ea3b0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme SaaS Dashboard"
                    value={bookingForm.projectName}
                    onChange={e => setBookingForm({ ...bookingForm, projectName: e.target.value })}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      padding: '12px 14px',
                      color: '#e8eaf0',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#fbbf24'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>

                {/* Tech Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ea3b0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Technology Blueprint
                  </label>
                  <select
                    value={bookingForm.stack}
                    onChange={e => setBookingForm({ ...bookingForm, stack: e.target.value })}
                    style={{
                      background: '#181c24',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      padding: '12px 14px',
                      color: '#e8eaf0',
                      fontSize: '0.9rem',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="MERN Stack (React, Node.js, Express, MongoDB)">MERN Stack (React, Node.js, Express, MongoDB)</option>
                    <option value="Django + React (React, Django REST, PostgreSQL)">Django + React (React, Django REST, PostgreSQL)</option>
                    <option value="Spring Boot + React (React, Spring Boot, PostgreSQL/MySQL)">Spring Boot + React (React, Spring Boot, PostgreSQL/MySQL)</option>
                    <option value="PERN Stack (React, Express, Node.js, PostgreSQL)">PERN Stack (React, Express, Node.js, PostgreSQL)</option>
                    <option value="Custom Project Build (React, Go, Rust, or AWS)">Custom Project Build (Go, Rust, AWS, etc.)</option>
                  </select>
                </div>

                {/* Estimated Budget */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ea3b0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $4,000"
                    value={bookingForm.budget}
                    onChange={e => setBookingForm({ ...bookingForm, budget: e.target.value })}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      padding: '12px 14px',
                      color: '#e8eaf0',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#fbbf24'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn btn-primary btn-full"
                  style={{
                    background: '#fbbf24',
                    color: '#111318',
                    border: 'none',
                    fontWeight: 700,
                    padding: '14px 0',
                    fontSize: '0.92rem',
                    borderRadius: 99,
                    boxShadow: '0 4px 14px rgba(251,191,36,0.3)',
                    marginTop: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {bookingLoading ? <div className="spinner" style={{ width: 18, height: 18 }} /> : 'Book Project & Enter Queue →'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: INVOICES & PAYMENTS TAB */}
        {activeTab === 'invoice' && (
          <div>
            {loadingProjects ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div className="spinner" />
              </div>
            ) : projects.length === 0 ? (
              <div style={{
                border: '1px dashed rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '60px 24px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.01)'
              }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 16 }}>💳</span>
                <h3 style={{ fontSize: '1.2rem', fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>No active invoices</h3>
                <p style={{ color: '#9ea3b0', fontSize: '0.88rem', maxWidth: 380, margin: '0 auto' }}>
                  No projects are registered inside your workspace. Billing details appear as soon as a project stack is booked.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Selector */}
                {projects.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', padding: '10px 16px', borderRadius: 10, alignSelf: 'flex-start', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.8rem', color: '#9ea3b0', fontWeight: 600 }}>Invoice for:</span>
                    <select
                      value={selectedProjectId}
                      onChange={e => setSelectedProjectId(e.target.value)}
                      style={{
                        background: '#181c24',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#e8eaf0',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: '0.85rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {projects.map(p => (
                        <option key={p._id} value={p._id}>{p.projectName}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Invoice breakdown container */}
                <div style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 20,
                  padding: '32px 28px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 24, marginBottom: 32 }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Workspace Invoice
                      </span>
                      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 700, marginTop: 4 }}>
                        {selectedProject.projectName}
                      </h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#9ea3b0' }}>Total Contract Value</span>
                      <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: "'Syne', sans-serif", marginTop: 4 }}>
                        {selectedProject.budget}
                      </span>
                    </div>
                  </div>

                  {/* Payment warning banner if unpaid */}
                  {(!selectedProject.depositPaid || !selectedProject.finalPaid) && (
                    <div style={{
                      background: 'rgba(251,191,36,0.08)',
                      border: '1px solid rgba(251,191,36,0.18)',
                      borderRadius: 12,
                      padding: '16px 20px',
                      marginBottom: 32,
                      color: '#fbbf24',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontWeight: 600
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                      <span>Pending payment required to advance to the next pipeline phase.</span>
                    </div>
                  )}

                  {/* Installments listing */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Item 1: 25% Deposit */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: 14,
                      padding: '20px 24px',
                      flexWrap: 'wrap',
                      gap: 16
                    }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#5a6075', textTransform: 'uppercase', fontWeight: 700 }}>Confirmation Stage</span>
                        <h4 style={{ margin: '4px 0 2px 0', fontSize: '1.05rem', fontWeight: 700 }}>25% Confirmation Deposit</h4>
                        <span style={{ fontSize: '0.8rem', color: '#9ea3b0' }}>Due immediately to confirm and start project engineering</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: "'Syne', sans-serif" }}>
                          {formatCurrency(parseBudget(selectedProject.budget) * 0.25)}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          background: selectedProject.depositPaid ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: selectedProject.depositPaid ? '#10b981' : '#ef4444',
                          border: selectedProject.depositPaid ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                          borderRadius: 20,
                          padding: '4px 12px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {selectedProject.depositPaid ? 'Paid ✓' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Item 2: 75% Deployment */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: 14,
                      padding: '20px 24px',
                      flexWrap: 'wrap',
                      gap: 16
                    }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#5a6075', textTransform: 'uppercase', fontWeight: 700 }}>Deployment Stage</span>
                        <h4 style={{ margin: '4px 0 2px 0', fontSize: '1.05rem', fontWeight: 700 }}>75% Deployment Balance</h4>
                        <span style={{ fontSize: '0.8rem', color: '#9ea3b0' }}>Due upon completion of deliverables and server deployment</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: "'Syne', sans-serif" }}>
                          {formatCurrency(parseBudget(selectedProject.budget) * 0.75)}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          background: selectedProject.finalPaid ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: selectedProject.finalPaid ? '#10b981' : '#ef4444',
                          border: selectedProject.finalPaid ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                          borderRadius: 20,
                          padding: '4px 12px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {selectedProject.finalPaid ? 'Paid ✓' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
