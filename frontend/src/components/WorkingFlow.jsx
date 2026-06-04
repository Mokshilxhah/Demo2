import React from 'react';

const steps = [
  {
    num: '01', emoji: '📋', title: 'Submit Requirements',
    desc: 'Fill our structured form — features, stack, timeline & budget. 5 minutes max.',
    detail: ['Project name', 'Feature list', 'Tech preferences', 'Budget range'],
    color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.3)',
  },
  {
    num: '02', emoji: '🔍', title: 'Admin Reviews',
    desc: 'Our team sends back a precise time & budget breakdown within 24 hours.',
    detail: ['Technical analysis', 'Time estimate', 'Budget breakdown', 'Stack confirmation'],
    color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)',
  },
  {
    num: '03', emoji: '📬', title: 'Accept & Enter Queue',
    desc: 'Approve the proposal. Get WhatsApp + email confirmation with your queue slot.',
    detail: ['Queue slot assigned', 'WhatsApp alert', 'Email confirmation', 'Dashboard access'],
    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)',
  },
  {
    num: '04', emoji: '🚀', title: 'Build & Deploy',
    desc: 'Development starts. Live updates every step. Delivered tested and deployed.',
    detail: ['Dev sprints', 'Progress alerts', 'QA testing', 'Deployment & handoff'],
    color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.3)',
  },
];

export default function WorkingFlow() {
  return (
    <section id="flow" className="flow-section">
      <div className="wrap">
        <div className="section-header">
          <span className="label">The Process</span>
          <h2 className="heading-lg">How It Works</h2>
          <p className="body-md">A clear, no-guesswork journey from your idea to a live product.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                borderRadius: 14,
                border: `1px solid rgba(255,255,255,0.07)`,
                background: 'rgba(255,255,255,0.025)',
                padding: '24px 20px',
                overflow: 'hidden',
                transition: 'border-color 0.3s, transform 0.3s',
                cursor: 'default',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = s.border;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Big faded number watermark */}
              <div style={{
                position: 'absolute', top: -10, right: 12,
                fontSize: '5rem', fontWeight: 900, lineHeight: 1,
                color: s.color, opacity: 0.07, pointerEvents: 'none',
                fontFamily: 'var(--font-alt)',
              }}>{s.num}</div>

              {/* Top accent bar */}
              <div style={{ width: 36, height: 3, borderRadius: 2, background: s.color, marginBottom: 18 }} />

              {/* Emoji icon in colored pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: 12,
                background: s.bg, border: `1px solid ${s.border}`,
                fontSize: '1.3rem', marginBottom: 14,
              }}>
                {s.emoji}
              </div>

              <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: s.color, marginBottom: 6 }}>
                Step {s.num}
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{s.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--txt-2)', lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>

              {/* Dot list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid ${s.border}`, paddingTop: 14 }}>
                {s.detail.map((d, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--txt-2)' }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 900px) {
            #flow .flow-grid-4 { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 540px) {
            #flow .flow-grid-4 { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
