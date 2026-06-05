import React, { useState, useEffect } from 'react';

const STAGES = [
  { label: 'Submitted',   color: '#93c5fd', icon: '📋', pct: 5  },
  { label: 'In Review',   color: '#fbbf24', icon: '🔍', pct: 22 },
  { label: 'Building',    color: '#6ee7b7', icon: '⚙️', pct: 58 },
  { label: 'Deploying',   color: '#818cf8', icon: '🚀', pct: 88 },
  { label: 'Delivered ✓', color: '#6ee7b7', icon: '✅', pct: 100 },
];

const QUEUE_NAMES = [
  'Ecommerce Web App',
  'Finlytics Trade',
  'MedTrack Portal',
  'QuickHire App',
];

export default function Hero() {
  const [stageIdx,  setStageIdx]  = useState(2);   // start at "Building"
  const [queuePos,  setQueuePos]  = useState(3);
  const [pct,       setPct]       = useState(58);
  const [tick,      setTick]      = useState(0);

  // Cycle stage every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setStageIdx(i => {
        const next = (i + 1) % STAGES.length;
        setPct(STAGES[next].pct);
        return next;
      });
      setTick(n => n + 1);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  // Queue position drops slowly
  useEffect(() => {
    const t = setInterval(() => {
      setQueuePos(p => (p > 1 ? p - 1 : 5));
    }, 5600);
    return () => clearInterval(t);
  }, []);

  const stage = STAGES[stageIdx];

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid-bg" />

      <div className="wrap hero-layout">

        {/* ── LEFT: Text ── */}
        <div className="hero-text">

          <h1 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(2.5rem, 4.8vw, 4.4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            color: 'var(--t1)',
            marginTop : 50,
            marginBottom: 30,
          }}>
            We turn your ideas
            <br />
            into{' '}
            <span style={{
              background: 'linear-gradient(130deg, var(--a1) 20%, var(--a2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              shipped products.
            </span>
          </h1>

          <p style={{
            fontSize: '0.95rem', lineHeight: 1.8,
            color: 'var(--t2)', maxWidth: 460,
            marginBottom: 36, fontWeight: 400,
          }}>
            Submit your project, get an expert review in 24 hours, and watch
            it move through a fully transparent build queue — MERN, Django,
            Spring Boot, FastAPI and beyond.
          </p>

          <div className="hero-actions">
            <a href="/register" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.92rem' }}>
              Book Your Project
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#flow" className="btn btn-ghost" style={{ padding: '12px 24px', fontSize: '0.92rem' }}>
              See How It Works
            </a>
          </div>

          <div style={{ display: 'flex', gap: 28, paddingTop: 28, borderTop: '1px solid var(--b2)', marginTop: 4, flexWrap: 'wrap' }}>
            {[
              { num: '5+',  lbl: 'Demo Projects', color: 'var(--a1)' },
              { num: '100%', lbl: 'On-Time Delivery',  color: 'var(--a2)' },
              { num: 'Affordable', lbl: 'Pricing',     color: 'var(--a3)' },
            ].map(({ num, lbl, color }) => (
              <div key={lbl} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1, color }}>{num}</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--t3)', fontWeight: 500 }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Live animated dashboard bento ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

          {/* Row 1: Status + Queue Position */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

            {/* Stage status cell */}
            <div style={{
              background: 'var(--bg-3)',
              border: `1px solid ${stage.color}30`,
              borderRadius: 14,
              padding: '12px 16px',
              transition: 'border-color 0.6s',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 2, background: stage.color, opacity: 0.7,
                transition: 'background 0.6s',
              }} />
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.58rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7 }}>
                Status
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 99,
                background: stage.color + '18',
                border: `1px solid ${stage.color}35`,
                transition: 'all 0.4s',
              }}>
                <span style={{ fontSize: '0.85rem' }}>{stage.icon}</span>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '0.68rem', fontWeight: 700, color: stage.color, transition: 'color 0.4s' }}>
                  {stage.label}
                </span>
              </div>
              <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: `linear-gradient(90deg, ${stage.color}, #818cf8)`,
                  borderRadius: 99,
                  transition: 'width 1.8s cubic-bezier(0.4,0,0.2,1), background 0.6s',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '0.56rem', color: 'var(--t4)' }}>Progress</span>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '0.56rem', color: stage.color, transition: 'color 0.4s' }}>{pct}%</span>
              </div>
            </div>

            {/* Queue position cell */}
            <div style={{
              background: 'var(--bg-3)',
              border: '1px solid var(--b1)',
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.58rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Queue Position
              </div>
              <div style={{
                fontFamily: 'var(--fd)', fontSize: '2.2rem', fontWeight: 800,
                color: '#fbbf24', lineHeight: 1, letterSpacing: '-0.04em',
                transition: 'all 0.5s', margin: '6px 0',
              }}>
                #{queuePos}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 99,
                    background: i < queuePos ? '#fbbf24' : 'rgba(255,255,255,0.06)',
                    transition: 'background 0.5s',
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Main project card (wide) */}
          <div style={{
            background: 'var(--bg-3)',
            border: '1px solid var(--b1)',
            borderRadius: 14,
            padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.58rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Active Project
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840' }} />
              </div>
            </div>
            {/* Project rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {QUEUE_NAMES.map((name, i) => {
                const isActive = i === (tick % QUEUE_NAMES.length);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 8px', borderRadius: 7,
                    background: isActive ? 'rgba(110,231,183,0.06)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(110,231,183,0.15)' : 'transparent'}`,
                    transition: 'all 0.4s',
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: isActive ? '#6ee7b7' : 'rgba(255,255,255,0.12)',
                      transition: 'background 0.4s',
                      boxShadow: isActive ? '0 0 8px rgba(110,231,183,0.5)' : 'none',
                    }} />
                    <span style={{
                      fontFamily: 'var(--fm)', fontSize: '0.62rem',
                      color: 'var(--t4)', fontWeight: 500, flexShrink: 0, width: 16,
                    }}>#{i + 1}</span>
                    <span style={{
                      fontSize: '0.82rem', fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--t1)' : 'var(--t3)',
                      flex: 1, transition: 'color 0.4s',
                    }}>{name}</span>
                    {isActive && (
                      <span style={{
                        fontFamily: 'var(--fm)', fontSize: '0.58rem', fontWeight: 700,
                        color: stage.color, background: stage.color + '18',
                        border: `1px solid ${stage.color}30`,
                        padding: '2px 7px', borderRadius: 99,
                      }}>
                        {stage.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 3: Stack + ETA chips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{
              background: 'var(--bg-3)', border: '1px solid var(--b1)', borderRadius: 12, padding: '10px 14px',
            }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.58rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7 }}>
                Stack
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['React', 'Django', 'Java'].map(t => (
                  <span key={t} style={{
                    fontFamily: 'var(--fm)', fontSize: '0.6rem', fontWeight: 700,
                    padding: '3px 8px', borderRadius: 5,
                    background: 'rgba(147,197,253,0.1)', border: '1px solid rgba(147,197,253,0.22)',
                    color: '#93c5fd',
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{
              background: 'var(--bg-3)', border: '1px solid var(--b1)', borderRadius: 12, padding: '10px 14px',
              display: 'flex', flexDirection: 'column', gap: 3,
            }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.58rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Est. Delivery
              </div>
              <div style={{ fontFamily: 'var(--fd)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--a1)', lineHeight: 1 }}>
                7-10 days
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--t4)' }}>Budget: Affordable</div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .hero-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 560px) {
          .hero { padding: 90px 0 60px !important; }
        }
      `}</style>
    </section>
  );
}
