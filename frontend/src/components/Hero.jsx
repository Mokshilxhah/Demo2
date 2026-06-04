import React from 'react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="bg-gradient-hero" />
      <div className="wrap hero-grid">

        {/* ── Left ── */}
        <div className="hero-text">

          <h1 className="heading-xl">
            Build Your Idea with{' '}
            <span className="grad-purple-blue">Absolute Perfection.</span>
          </h1>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--txt-2)', maxWidth: 500, fontWeight: 400 }}>
            Submit your project. Get an instant estimate. Track development in a fully transparent queue — MERN, Django, Spring Boot, and more.
          </p>

          <div className="hero-cta">
            <a href="/register" className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '0.95rem', fontFamily: 'var(--font-alt)', fontWeight: 700 }}>
              You Book We Project
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#projects" className="btn btn-secondary" style={{ padding: '13px 28px', fontSize: '0.95rem' }}>
              View Projects
            </a>
          </div>

          <div className="hero-stats">
            {[
              { n: '50+',   l: 'Projects Shipped',   grad: 'linear-gradient(135deg,var(--primary),var(--indigo))' },
              { n: '100%',  l: 'On-Time Delivery',    grad: 'linear-gradient(135deg,var(--accent),var(--rose))' },
              { n: '4.9★',  l: 'Client Rating',       grad: 'linear-gradient(135deg,var(--sky),var(--primary))' },
            ].map(({ n, l, grad }, i) => (
              <div key={i} className="hero-stat">
                <div className="num" style={{ fontFamily: 'var(--font-alt)', background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</div>
                <div className="stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Visual ── */}
        <div className="hero-visual">
          {/* Ambient glow */}
          <div className="hero-glow" />

          {/* Orbit rings */}
          <div className="orbit-wrapper">
            <div className="orbit-dot" style={{ background: 'var(--primary)', boxShadow: '0 0 12px var(--primary)' }} />
          </div>
          <div className="orbit-wrapper" style={{ width: 210, height: 210, border: '1px dashed rgba(245,158,11,0.25)', animationDuration: '18s', animationDirection: 'reverse' }}>
            <div className="orbit-dot" style={{ background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)', top: 'auto', bottom: -4 }} />
          </div>

          {/* Center widget */}
          <div className="hero-dash-preview">
            <div className="hero-dash-ring">
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-alt)' }}>Queue Active</span>
          </div>

          {/* ── Float card 1 — Project Accepted (top right) ── */}
          <div className="float-card top-right" style={{ minWidth: 210 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="card-dot" style={{ background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-alt)' }}>Project Accepted</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'var(--txt-3)', marginBottom: 3 }}>Budget</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', fontFamily: 'var(--font-alt)' }}>$4,200</div>
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'var(--txt-3)', marginBottom: 3 }}>ETA</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-alt)' }}>18 days</div>
              </div>
            </div>
          </div>

          {/* ── Float card 2 — Queue Position (bottom left) ── */}
          <div className="float-card bottom-left" style={{ minWidth: 185 }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--txt-3)', marginBottom: 4, fontWeight: 600 }}>Queue Position</div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)', fontFamily: 'var(--font-alt)' }}>#3 of 9</div>
            <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
              <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg,var(--primary),var(--indigo))', borderRadius: 4 }} />
            </div>
          </div>

          {/* ── Float card 3 — Stack (top left, NEW) ── */}
          <div className="float-card" style={{
            top: '5%', left: '-5%',
            minWidth: 160,
            animationDelay: '1s',
            animationDuration: '5s',
          }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--txt-3)', fontWeight: 600, marginBottom: 6 }}>Stack Detected</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {['React', 'Node', 'Mongo'].map((t, i) => (
                <span key={i} style={{
                  fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: 5, background: 'rgba(20,184,166,0.12)',
                  border: '1px solid rgba(20,184,166,0.25)', color: 'var(--primary)'
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* ── Float card 4 — Notification (bottom right, NEW) ── */}
          <div className="float-card" style={{
            bottom: '5%', right: '-5%',
            minWidth: 190,
            animationDelay: '3s',
            animationDuration: '6s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: '1rem' }}>📲</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-alt)' }}>WhatsApp Alert</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--txt-2)', lineHeight: 1.5 }}>
              Your project moved to<br />
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Build Phase</span> 🎉
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
