import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const projects = [
  {
    id: 1,
    category: 'MERN Workflow Builder',
    title: 'Flowgen',
    desc: 'MERN-based AI workflow automation generator. Build, visualize, and deploy complex backend workflows with drag-and-drop nodes.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    accent: '#6ee7b7',
    bg: 'linear-gradient(155deg, #162a21 0%, #0d1a14 55%, #08100c 100%)',
    stackBg: 'rgba(110,231,183,0.08)',
    stackBorder: 'rgba(110,231,183,0.18)',
    mockupType: 'flowgen',
  },
  {
    id: 2,
    category: 'AI Recipe Planner',
    title: 'Pantry To Plate',
    desc: 'Transform your kitchen leftovers. Log ingredients in your virtual pantry and get instant recipes powered by Django, React, and MongoDB.',
    stack: ['Django', 'React', 'MongoDB', 'Python'],
    accent: '#fbbf24',
    bg: 'linear-gradient(155deg, #2a200e 0%, #1a1409 55%, #100c05 100%)',
    stackBg: 'rgba(251,191,36,0.08)',
    stackBorder: 'rgba(251,191,36,0.18)',
    mockupType: 'pantry',
  },
  {
    id: 3,
    category: 'D2C Premium Brand',
    title: 'Joyspoon',
    desc: 'Premium Indian mukhwas and mouth-freshener brand that aims to modernize a traditional after-meal habit by offering healthier, hygienic, and flavorful alternatives.',
    stack: ['JavaScript', 'HTML5', 'CSS3'],
    accent: '#f9a8d4',
    bg: 'linear-gradient(155deg, #2d1622 0%, #1d0e16 55%, #12090e 100%)',
    stackBg: 'rgba(249,168,212,0.08)',
    stackBorder: 'rgba(249,168,212,0.18)',
    mockupType: 'joyspoon',
  },
  {
    id: 4,
    category: 'Fintech AI',
    title: 'Capital Nest',
    desc: 'Your intelligent investment companion. Track stocks, IPOs, and mutual funds in real-time with AI-powered insights.',
    stack: ['Django', 'JavaScript', 'PostgreSQL', 'Python'],
    accent: '#818cf8',
    bg: 'linear-gradient(155deg, #181c3b 0%, #0f1124 55%, #0a0c18 100%)',
    stackBg: 'rgba(129,140,248,0.08)',
    stackBorder: 'rgba(129,140,248,0.18)',
    mockupType: 'capitalnest',
  },
  {
    id: 5,
    category: 'Diet & Nutrition',
    title: 'Meal Planner',
    desc: 'Smart daily meal planning, automated grocery list generation, and precise macro-nutrient tracking built with Flask and PostgreSQL.',
    stack: ['Python', 'Flask', 'PostgreSQL', 'CSS3'],
    accent: '#34d399',
    bg: 'linear-gradient(155deg, #102a21 0%, #0a1a15 55%, #06100d 100%)',
    stackBg: 'rgba(52,211,153,0.08)',
    stackBorder: 'rgba(52,211,153,0.18)',
    mockupType: 'mealplanner',
  },
];

// Helper component to render customized UI mockups for top half of mobile screen
function MockupScreen({ type, accent }) {
  if (type === 'flowgen') {
    return (
      <div style={{
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        height: '100%',
        background: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        position: 'relative'
      }}>
        {/* Node 1: Trigger */}
        <div style={{
          alignSelf: 'flex-start',
          background: 'rgba(110,231,183,0.06)',
          border: '1px solid rgba(110,231,183,0.25)',
          borderRadius: 6,
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          marginTop: 2
        }}>
          <span style={{ fontSize: '0.6rem' }}>⚡</span>
          <span style={{ fontSize: '0.52rem', fontWeight: 700, color: '#fff' }}>User Sign Up</span>
        </div>

        {/* Node 2: AI Action */}
        <div style={{
          alignSelf: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6,
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          animation: 'pulse-ai 2s infinite ease-in-out'
        }}>
          <span style={{ fontSize: '0.6rem' }}>✨</span>
          <span style={{ fontSize: '0.52rem', fontWeight: 700, color: accent }}>AI Welcome Email</span>
        </div>

        {/* Node 3: Sync DB */}
        <div style={{
          alignSelf: 'flex-end',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6,
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <span style={{ fontSize: '0.6rem' }}>📁</span>
          <span style={{ fontSize: '0.52rem', fontWeight: 700, color: '#fff' }}>Save to Mongo</span>
        </div>

        {/* SVG Flow Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
          <path d="M 40,25 Q 120,25 120,48" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <path d="M 40,25 Q 120,25 120,48" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4,4" className="flow-dash-1" />
          
          <path d="M 120,68 Q 120,95 200,95" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <path d="M 120,68 Q 120,95 200,95" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4,4" className="flow-dash-2" />
        </svg>
      </div>
    );
  }

  if (type === 'pantry') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', height: '100%' }}>
        <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pantry Inventory</div>
        
        {/* Ingredients List */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['🍅 Tomato', '🧅 Onion', '🍗 Chicken'].map((item) => (
            <span key={item} style={{
              fontSize: '0.55rem',
              color: '#fff',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '3px 6px',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}>
              {item} <span style={{ color: accent, fontSize: '0.45rem' }}>✓</span>
            </span>
          ))}
        </div>

        {/* Cooking Pot Mockup with Rising Steam */}
        <div style={{
          marginTop: 6,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 8,
          padding: '4px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: 54,
          overflow: 'hidden'
        }}>
          {/* Steam waves */}
          <div className="steam steam-1" style={{ left: '35%' }}>~</div>
          <div className="steam steam-2" style={{ left: '50%' }}>~</div>
          <div className="steam steam-3" style={{ left: '65%' }}>~</div>

          {/* Cooking Pot */}
          <div style={{
            width: 40,
            height: 20,
            background: `linear-gradient(to bottom, #475569, #1e293b)`,
            border: `1px solid ${accent}40`,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            position: 'relative',
            marginTop: 8
          }}>
            {/* Lid handles */}
            <div style={{ position: 'absolute', left: -4, top: 5, width: 4, height: 3, background: '#475569', borderRadius: 1 }} />
            <div style={{ position: 'absolute', right: -4, top: 5, width: 4, height: 3, background: '#475569', borderRadius: 1 }} />
            <div style={{
              position: 'absolute',
              top: -2,
              left: 4,
              right: 4,
              height: 2,
              background: '#64748b',
              borderRadius: 1
            }} />
          </div>
          <div style={{ fontSize: '0.45rem', color: accent, fontWeight: 700, marginTop: 4, letterSpacing: '0.05em' }}>COOKING RECIPE...</div>
        </div>
      </div>
    );
  }

  if (type === 'joyspoon') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative', overflow: 'hidden' }}>
        {/* Glowing aura */}
        <div className="aura" style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: `1px solid ${accent}15`,
          animation: 'pulsate-aura 3s infinite ease-out'
        }} />
        <div className="aura" style={{
          position: 'absolute',
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: `1px solid ${accent}30`,
          animation: 'pulsate-aura 3s infinite ease-out',
          animationDelay: '1.5s'
        }} />

        {/* Brand jar badge */}
        <div style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${accent}, #881337)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 6px 16px ${accent}25`,
          border: '1px solid rgba(255,255,255,0.25)',
          zIndex: 2,
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.4rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', lineHeight: 1 }}>JOY</span>
          <span style={{ fontSize: '0.4rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', lineHeight: 1 }}>SPOON</span>
          <span style={{ fontSize: '0.55rem', marginTop: 2 }}>🥄</span>
        </div>

        {/* Floating elements representing mukhwas seeds/petals */}
        <span className="petal petal-1" style={{ fontSize: '0.5rem' }}>🌸</span>
        <span className="petal petal-2" style={{ fontSize: '0.5rem' }}>🌿</span>
        <span className="petal petal-3" style={{ fontSize: '0.45rem' }}>✨</span>
      </div>
    );
  }

  if (type === 'capitalnest') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Net worth card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          padding: '6px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Portfolio Balance</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>$54,820.40</div>
          </div>
          <div style={{ fontSize: '0.48rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '1px 4px', borderRadius: 4 }}>
            ▲ +6.4%
          </div>
        </div>

        {/* Real-time financial trend line chart */}
        <div style={{ position: 'relative', height: 42, width: '100%', marginTop: 2 }}>
          <svg viewBox="0 0 100 30" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <path
              d="M0,25 Q15,28 30,18 T60,10 T90,2 T100,0"
              fill="none"
              stroke={accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              style={{ animation: 'chart-draw 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards infinite' }}
            />
            <path
              d="M0,25 Q15,28 30,18 T60,10 T90,2 T100,0 L100,30 L0,30 Z"
              fill={accent}
              opacity="0.08"
            />
          </svg>
        </div>

        {/* Real-time Tickers */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.45rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>NEST</span>
            <span className="live-ticker" style={{ fontSize: '0.48rem', fontWeight: 700, color: '#10b981' }}>$142.50</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.45rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>IPO:G</span>
            <span className="live-ticker" style={{ fontSize: '0.48rem', fontWeight: 700, color: '#10b981' }}>+$12.4</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'mealplanner') {
    return (
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monday Nutrition</div>
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Calorie Goal Circular Ring Meter */}
          <div style={{ position: 'relative', width: 36, height: 36 }}>
            <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={accent}
                strokeWidth="3.5"
                strokeDasharray="100, 100"
                strokeDashoffset="100"
                style={{ animation: 'fill-ring 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards infinite' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              lineHeight: 1
            }}>
              <span style={{ fontSize: '0.38rem', fontWeight: 800, color: '#fff' }}>75%</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#fff' }}>1,850 kcal</div>
            <div style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.4)' }}>Goal: 2,400 kcal</div>
          </div>
        </div>

        {/* Meal cards list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { name: 'Avocado Toast', meal: 'Breakfast', cal: '320' },
            { name: 'Quinoa Salad', meal: 'Lunch', cal: '540' }
          ].map((item) => (
            <div key={item.name} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 6,
              padding: '3px 8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.55rem', fontWeight: 700, color: '#fff' }}>{item.name}</div>
                <div style={{ fontSize: '0.42rem', color: accent }}>{item.meal}</div>
              </div>
              <span style={{ fontSize: '0.48rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{item.cal} kcal</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function DemoProjects() {
  const trackRef = useRef(null);
  const navigate = useNavigate();

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
              position: 'relative',
              '--accent': p.accent,
              '--accent-glow': `${p.accent}20`,
              '--btn-bg': `${p.accent}15`,
              '--btn-border': `${p.accent}35`,
            }}
            onClick={(e) => {
              // Redirect only if not clicking the button itself or nested elements
              if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                navigate(`/register?project=${p.id}`);
              }
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
              
              {/* TOP HALF: Mockup Area (Height: 200px) */}
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
                <Link
                  to={`/register?project=${p.id}`}
                  className="proj-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    width: '100%',
                    padding: '8px 0',
                    marginTop: 14,
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  See Project ↗
                </Link>

              </div>

            </div>
          </div>
        ))}
      </div>

      <style>{`
        #projects [ref] div::-webkit-scrollbar { display: none; }
        div[style*="overflow-x: auto"]::-webkit-scrollbar { display: none; }
        
        /* Premium Card Custom Style Integrations */
        .proj-card-wrapper {
          transform: translateY(0);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: 2px solid var(--b2) !important;
          box-shadow: 0 24px 48px rgba(0,0,0,0.4);
        }
        .proj-card-wrapper:hover {
          transform: translateY(-10px);
          box-shadow: 0 32px 64px rgba(0,0,0,0.6), 0 0 24px var(--accent-glow) !important;
          border-color: var(--accent) !important;
        }
        .proj-btn {
          background: var(--btn-bg);
          border: 1px solid var(--btn-border);
          color: var(--accent);
        }
        .proj-btn:hover {
          background: var(--accent) !important;
          color: #000 !important;
          border-color: var(--accent) !important;
        }

        /* Mockup Animations */
        @keyframes pulse-ai {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.03); filter: brightness(1.12); }
        }
        @keyframes flow-dash-anim {
          to {
            stroke-dashoffset: -20;
          }
        }
        .flow-dash-1, .flow-dash-2 {
          animation: flow-dash-anim 1.5s linear infinite;
        }
        @keyframes steam-rise {
          0% { transform: translateY(10px) scale(0.8); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-16px) scale(1.15); opacity: 0; }
        }
        .steam {
          position: absolute;
          top: 12px;
          font-size: 0.75rem;
          color: rgba(251,191,36,0.3);
          font-family: monospace;
          animation: steam-rise 2s infinite ease-out;
          pointer-events: none;
        }
        .steam-1 { animation-delay: 0s; }
        .steam-2 { animation-delay: 0.6s; }
        .steam-3 { animation-delay: 1.2s; }
        @keyframes pulsate-aura {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes float-petal {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(40px) translateX(12px) rotate(180deg); opacity: 0; }
        }
        .petal {
          position: absolute;
          animation: float-petal 3.5s infinite linear;
          pointer-events: none;
        }
        .petal-1 { left: 25%; top: 40px; animation-delay: 0s; }
        .petal-2 { right: 25%; top: 50px; animation-delay: 1.2s; }
        .petal-3 { left: 45%; top: 25px; animation-delay: 2.4s; }
        @keyframes chart-draw {
          0% { stroke-dashoffset: 100; }
          75% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes blink-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.68; }
        }
        .live-ticker {
          animation: blink-green 2s infinite ease-in-out;
        }
        @keyframes fill-ring {
          0% { stroke-dashoffset: 100; }
          75% { stroke-dashoffset: 25; }
          100% { stroke-dashoffset: 25; }
        }
      `}</style>
    </section>
  );
}
