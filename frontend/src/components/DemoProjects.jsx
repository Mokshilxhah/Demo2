import React, { useRef } from 'react';

const projects = [
  {
    id: 1,
    category: 'SaaS Dashboard',
    title: 'EcomX Analytics',
    desc: 'Full-stack e-commerce analytics with real-time dashboards, multi-store support, and custom KPI tracking.',
    stack: ['React', 'Node.js', 'PostgreSQL'],
    accent: '#6ee7b7',
    bg: 'linear-gradient(155deg, #162a21 0%, #0d1a14 55%, #08100c 100%)',
    stackBg: 'rgba(110,231,183,0.08)',
    stackBorder: 'rgba(110,231,183,0.18)',
    mockupType: 'analytics',
  },
  {
    id: 2,
    category: 'Fintech Platform',
    title: 'Finlytics Pro',
    desc: 'AI-powered personal finance tracker with bank sync, spending insights, and goal milestone tracking.',
    stack: ['Next.js', 'FastAPI', 'Postgres'],
    accent: '#818cf8',
    bg: 'linear-gradient(155deg, #181c3b 0%, #0f1124 55%, #0a0c18 100%)',
    stackBg: 'rgba(129,140,248,0.08)',
    stackBorder: 'rgba(129,140,248,0.18)',
    mockupType: 'fintech',
  },
  {
    id: 3,
    category: 'Healthcare CRM',
    title: 'MedTrack System',
    desc: 'HIPAA-compliant patient management, doctor schedule planning, and patient portals for mid-size clinics.',
    stack: ['Django', 'React', 'Postgres'],
    accent: '#fbbf24',
    bg: 'linear-gradient(155deg, #2a200e 0%, #1a1409 55%, #100c05 100%)',
    stackBg: 'rgba(251,191,36,0.08)',
    stackBorder: 'rgba(251,191,36,0.18)',
    mockupType: 'medical',
  },
  {
    id: 4,
    category: 'HR & Hiring',
    title: 'QuickHire App',
    desc: 'AI-assisted recruitment with automated resume screening, interview scheduling, and team pipeline tracking.',
    stack: ['React', 'FastAPI', 'MongoDB'],
    accent: '#f9a8d4',
    bg: 'linear-gradient(155deg, #2a1523 0%, #1a0d15 55%, #10080d 100%)',
    stackBg: 'rgba(249,168,212,0.08)',
    stackBorder: 'rgba(249,168,212,0.18)',
    mockupType: 'hr',
  },
  {
    id: 5,
    category: 'EdTech LMS',
    title: 'LearnFlow Platform',
    desc: 'Live video lectures, progress indicators, AI-generated quiz assessments, and instructor analytics dashboards.',
    stack: ['Next.js', 'Node.js', 'MongoDB'],
    accent: '#93c5fd',
    bg: 'linear-gradient(155deg, #10223b 0%, #0a1524 55%, #060d18 100%)',
    stackBg: 'rgba(147,197,253,0.08)',
    stackBorder: 'rgba(147,197,253,0.18)',
    mockupType: 'lms',
  },
  {
    id: 6,
    category: 'Logistics SaaS',
    title: 'RouteIQ Tracker',
    desc: 'Real-time delivery management system with route optimizations, driver assignments, and live tracking.',
    stack: ['Spring Boot', 'React', 'MySQL'],
    accent: '#34d399',
    bg: 'linear-gradient(155deg, #102a21 0%, #0a1a15 55%, #06100d 100%)',
    stackBg: 'rgba(52,211,153,0.08)',
    stackBorder: 'rgba(52,211,153,0.18)',
    mockupType: 'map',
  },
];

// Helper component to render customized UI mockups for top half of mobile screen
function MockupScreen({ type, accent }) {
  if (type === 'analytics') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Metric block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>$124,580</div>
          </div>
          <div style={{ fontSize: '0.58rem', fontWeight: 700, color: accent, background: `${accent}15`, padding: '2px 6px', borderRadius: 4 }}>
            ▲ +14.8%
          </div>
        </div>
        {/* Line Chart */}
        <div style={{ position: 'relative', height: 42, width: '100%', marginTop: 2 }}>
          <svg viewBox="0 0 100 30" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <path
              d="M0,25 Q15,15 30,22 T60,8 T90,2 T100,5"
              fill="none"
              stroke={accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M0,25 Q15,15 30,22 T60,8 T90,2 T100,5 L100,30 L0,30 Z"
              fill={accent}
              opacity="0.08"
            />
          </svg>
        </div>
        {/* Mini stats */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '5px 8px' }}>
            <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.4)' }}>Conversion</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>3.2%</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '5px 8px' }}>
            <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.4)' }}>Sessions</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>42.1k</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'fintech') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Card visualization */}
        <div style={{
          background: `linear-gradient(135deg, ${accent}cc, #110e38)`,
          borderRadius: 10,
          padding: '12px 14px',
          boxShadow: `0 8px 16px rgba(0,0,0,0.3), 0 0 10px ${accent}25`,
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 72,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.48rem', fontFamily: 'var(--fm)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)' }}>PREMIUM WALLET</span>
            <span style={{ fontSize: '0.7rem' }}>💳</span>
          </div>
          <div>
            <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.5)' }}>Balance</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--fd)' }}>$18,450.00</div>
          </div>
        </div>
        {/* Transaction log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 3 }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Apple Store</span>
            <span style={{ fontWeight: 700, color: '#ff6b6b' }}>-$99.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 3 }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Uber Trip</span>
            <span style={{ fontWeight: 700, color: '#ff6b6b' }}>-$12.50</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'medical') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clinic Schedule</div>
        {/* Patient card 1 */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderLeft: `3px solid ${accent}`,
          border: '1px solid rgba(255,255,255,0.05)',
          borderLeftWidth: 3,
          borderRadius: 6,
          padding: '6px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>Sarah Jenkins</div>
            <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>General Checkup</div>
          </div>
          <div style={{ fontSize: '0.58rem', fontWeight: 600, color: accent }}>09:30 AM</div>
        </div>
        {/* Patient card 2 */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderLeft: '3px solid #ffb020',
          border: '1px solid rgba(255,255,255,0.05)',
          borderLeftWidth: 3,
          borderRadius: 6,
          padding: '6px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>Robert Downey</div>
            <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>Lab Consultation</div>
          </div>
          <div style={{ fontSize: '0.58rem', fontWeight: 600, color: '#ffb020' }}>11:15 AM</div>
        </div>
      </div>
    );
  }

  if (type === 'hr') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Candidate Pool</div>
        {/* Candidate 1 */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#000', fontWeight: 'bold' }}>EW</div>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>Emma Watson</div>
              <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.4)' }}>React Specialist</div>
            </div>
          </div>
          <span style={{ fontSize: '0.5rem', background: 'rgba(110,231,183,0.1)', color: '#6ee7b7', padding: '1px 5px', borderRadius: 4 }}>Interview</span>
        </div>
        {/* Candidate 2 */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#000', fontWeight: 'bold' }}>DB</div>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>David Beckham</div>
              <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.4)' }}>Django Backend</div>
            </div>
          </div>
          <span style={{ fontSize: '0.5rem', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', padding: '1px 5px', borderRadius: 4 }}>Screening</span>
        </div>
      </div>
    );
  }

  if (type === 'lms') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Player Box */}
        <div style={{
          background: '#090b0f',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Mock play button */}
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 2
          }}>
            <span style={{ color: '#000', fontSize: '0.6rem', marginLeft: 2 }}>▶</span>
          </div>
          {/* Progress bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
            background: 'rgba(255,255,255,0.1)'
          }}>
            <div style={{ width: '42%', height: '100%', background: accent }} />
          </div>
        </div>
        {/* Course info */}
        <div>
          <div style={{ fontSize: '0.52rem', color: accent, fontWeight: 700, textTransform: 'uppercase' }}>Chapter 3 of 12</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>React State Management</div>
        </div>
      </div>
    );
  }

  if (type === 'map') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Map grid mockup */}
        <div style={{
          height: 64,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Grid lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          {/* Route path */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d="M10 50 Q 80 20 120 45 T 230 15" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="3,3" />
            <circle cx="230" cy="15" r="4" fill={accent} />
          </svg>
          {/* Vehicle dot */}
          <div style={{
            position: 'absolute', top: 32, left: 110,
            width: 8, height: 8, borderRadius: '50%',
            background: accent,
            boxShadow: `0 0 8px ${accent}`,
          }} />
        </div>
        {/* Delivery status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.4)' }}>Status</div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#fff' }}>In Transit</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.4)' }}>ETA</div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: accent }}>14 Mins</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function DemoProjects() {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 310, behavior: 'smooth' });
  };

  return (
    <section id="projects" style={{ padding: '60px 0 40px', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* Header */}
      <div className="wrap" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="eyebrow">Portfolio</div>
            <h2 className="h2" style={{ marginBottom: 8 }}>Work We've Shipped</h2>
            <p className="body-md" style={{ maxWidth: 420 }}>
              Real full-stack apps built with pristine architecture and responsive UX.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['←', '→'].map((a, i) => (
              <button
                key={i}
                onClick={() => scroll(i === 0 ? -1 : 1)}
                style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'var(--bg-3)', border: '1px solid var(--b1)',
                  color: 'var(--t2)', fontSize: '1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--b3)'; e.currentTarget.style.color = 'var(--t1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.color = 'var(--t2)'; }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staggered card track (Adjusted to align center and fit 500px mobile size cards) */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          overflowX: 'auto',
          overflowY: 'visible',
          paddingLeft: 'max(24px, calc((100vw - 1180px) / 2 + 24px))',
          paddingRight: 'max(24px, calc((100vw - 1180px) / 2 + 24px))',
          paddingBottom: 28,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          height: 550,
        }}
      >
        {projects.map((p) => (
          <div
            key={p.id}
            className="proj-card-wrapper"
            style={{
              flexShrink: 0,
              width: 290,
              height: 500,
              borderRadius: 36,
              background: '#090b0f', // Dark frame color
              padding: '6px', // Simulates outer hardware shell bezel padding
              border: '2px solid var(--b2)',
              position: 'relative',
              boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = `0 32px 64px rgba(0,0,0,0.6), 0 0 24px ${p.accent}20`;
              e.currentTarget.style.borderColor = p.accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.4)';
              e.currentTarget.style.borderColor = 'var(--b2)';
            }}
          >
            {/* Screen Notch */}
            <div style={{
              position: 'absolute',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 70,
              height: 14,
              borderRadius: 99,
              background: '#090b0f',
              border: '1px solid rgba(255,255,255,0.06)',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#1e293b' }} />
            </div>

            {/* Inner viewport screen */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: 30,
              overflow: 'hidden',
              background: p.bg,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}>
              
              {/* TOP HALF: Mockup Area (Height: 220px) */}
              <div style={{
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                position: 'relative',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: 'rgba(255,255,255,0.01)'
              }}>
                {/* Status Bar */}
                <div style={{
                  padding: '16px 18px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.52rem',
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'var(--fm)',
                }}>
                  <span>9:41 AM</span>
                  <div style={{ display: 'flex', gap: 4, fontSize: '0.45rem' }}>
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Custom Interactive Mockup Visual */}
                <MockupScreen type={p.mockupType} accent={p.accent} />
              </div>

              {/* BOTTOM HALF: Details Area (Height: 294px) */}
              <div style={{
                flex: 1,
                padding: '20px 18px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgba(9, 11, 15, 0.75)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}>
                <div>
                  {/* Category badge */}
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--fm)',
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: p.accent,
                    marginBottom: 8,
                  }}>
                    {p.category}
                  </span>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.25,
                    marginBottom: 8,
                  }}>
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--t3)',
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {p.desc}
                  </p>
                </div>

                {/* Tech Stack tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  {p.stack.map((tag) => (
                    <span key={tag} style={{
                      fontFamily: 'var(--fm)',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.25)',
                      border: `1px solid ${p.accent}28`,
                      color: p.accent,
                      letterSpacing: '0.02em',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* See Project Button */}
                <a
                  href={`/register?project=${p.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    width: '100%',
                    padding: '8px 0',
                    marginTop: 14,
                    borderRadius: 8,
                    background: `${p.accent}15`,
                    border: `1px solid ${p.accent}35`,
                    color: p.accent,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = p.accent;
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.borderColor = p.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${p.accent}15`;
                    e.currentTarget.style.color = p.accent;
                    e.currentTarget.style.borderColor = `${p.accent}35`;
                  }}
                >
                  See Project ↗
                </a>

              </div>

            </div>
          </div>
        ))}
      </div>

      <style>{`
        #projects [ref] div::-webkit-scrollbar { display: none; }
        div[style*="overflow-x: auto"]::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
