import React, { useEffect, useRef } from 'react';

const steps = [
  {
    num: '01',
    badge: 'Kickoff',
    title: 'Submit Requirements',
    desc: 'Fill our brief — features, stack preference, timeline & budget. 5 minutes.',
    accent: '#6ee7b7',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="6" y="5" width="24" height="26" rx="4" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="11" y1="12" x2="25" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="17" x2="22" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="22" x2="20" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '02',
    badge: 'Review',
    title: 'Analysis',
    desc: 'Team reviews your brief and responds with a detailed estimate within 24 hours.',
    accent: '#818cf8',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="16" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13 16 L17 20 L24 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 25 L18 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 31 L24 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '03',
    badge: 'Queue Entry',
    title: 'Accept & Get Queued',
    desc: 'Approve the proposal. Receive WhatsApp + email confirmation with your queue slot.',
    accent: '#fbbf24',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="5" y="8" width="26" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="5" y1="14" x2="31" y2="14" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="18" cy="22" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 11 L10 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 11 L14 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '04',
    badge: 'Development',
    title: 'We Build It',
    desc: 'Sprint-based development with milestone updates. Zero radio silence throughout.',
    accent: '#f9a8d4',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="7" width="28" height="22" rx="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13 16 L10 19 L13 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 16 L26 19 L23 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="19" y1="13" x2="17" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '05',
    badge: 'Handoff',
    title: 'You Launch',
    desc: 'Delivered with full docs, demo session, and live deployment. Ready from day one.',
    accent: '#93c5fd',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 6 L21 14 L30 14 L23 19 L26 28 L18 23 L10 28 L13 19 L6 14 L15 14 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function WorkingFlow() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    cardRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="flow" style={{ padding: '60px 0', background: 'var(--bg-2)' }}>
      <div className="wrap">

        <div className="sec-head">
          <div className="eyebrow">The Process</div>
          <h2 className="h2">From Idea to Launch</h2>
          <p className="body-md">
            A clear, predictable journey — no guesswork, no ghosting, just structured progress.
          </p>
        </div>

        {/* 5 cards in one row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 14,
        }}>
          {steps.map((step, i) => (
            <div
              key={i}
              ref={el => cardRefs.current[i] = el}
              className="reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--b1)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = step.accent + '40';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--b1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Top visual band — same height, colored */}
                <div style={{
                  height: 110,
                  background: `linear-gradient(160deg, ${step.accent}14 0%, transparent 100%)`,
                  borderBottom: `1px solid ${step.accent}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  {/* Step watermark */}
                  <span style={{
                    position: 'absolute',
                    top: 8, left: 14,
                    fontFamily: 'var(--fd)',
                    fontSize: '2.8rem',
                    fontWeight: 800,
                    color: step.accent,
                    opacity: 0.1,
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    userSelect: 'none',
                  }}>
                    {step.num}
                  </span>
                  {/* Icon */}
                  <div style={{ color: step.accent, opacity: 0.8 }}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '18px 18px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Badge */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: 'fit-content',
                    fontFamily: 'var(--fm)',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: step.accent,
                    background: step.accent + '16',
                    border: `1px solid ${step.accent}28`,
                    padding: '2px 8px',
                    borderRadius: 99,
                  }}>
                    {step.badge}
                  </span>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--t1)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.015em',
                  }}>
                    {step.title}
                  </h3>

                  {/* Desc */}
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'var(--t3)',
                    lineHeight: 1.7,
                    flex: 1,
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 960px) {
          #flow > .wrap > div:last-child {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          #flow > .wrap > div:last-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 400px) {
          #flow > .wrap > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
