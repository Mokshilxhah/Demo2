import React, { useEffect, useRef } from 'react';

const cells = [
  {
    key: 'a', cls: 'bento-a',
    icon: '📡',
    title: 'Real-Time Queue Tracking',
    desc: 'Watch your project move through our pipeline live. Always know your exact position — no chasing for updates.',
    accentColor: 'var(--a1)',
    accentBg: 'rgba(110,231,183,0.08)',
    barColor: 'linear-gradient(90deg, var(--a1), var(--a2))',
  },
  {
    key: 'b', cls: 'bento-b',
    icon: '💰',
    title: 'Instant Budget Estimation',
    desc: 'Receive a precise, honest cost breakdown the moment your project is reviewed. No hidden fees, ever.',
    accentColor: 'var(--a3)',
    accentBg: 'rgba(251,191,36,0.06)',
    barColor: 'linear-gradient(90deg, var(--a3), var(--a4))',
  },
  {
    key: 'c', cls: 'bento-c',
    icon: '📧',
    title: 'Instant Email Alerts',
    desc: 'Every status change and milestone update is delivered directly to your inbox the moment it happens.',
    accentColor: 'var(--a2)',
    accentBg: 'rgba(129,140,248,0.06)',
    barColor: 'linear-gradient(90deg, var(--a2), var(--a1))',
  },
  {
    key: 'd', cls: 'bento-d',
    icon: '🔒',
    title: 'Secure & Scalable',
    desc: 'Enterprise-grade code standards and security practices on every build.',
    accentColor: 'var(--a4)',
    accentBg: 'rgba(249,168,212,0.06)',
    barColor: 'linear-gradient(90deg, var(--a4), var(--a2))',
  },
  {
    key: 'e', cls: 'bento-e',
    icon: '⚡',
    title: 'Rapid Delivery',
    desc: 'Tight timelines met without compromise on quality.',
    accentColor: 'var(--a5)',
    accentBg: 'rgba(147,197,253,0.06)',
    barColor: 'linear-gradient(90deg, var(--a5), var(--a2))',
  },
];

export default function Features() {
  const cellRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    cellRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="features-section">
      <div className="wrap">

        <div className="sec-head">
          <div className="eyebrow">Core Advantages</div>
          <h2 className="h2">Why Teams Choose Reqworks</h2>
          <p className="body-md">
            Every feature is built so you stay focused on your business — not on chasing updates.
          </p>
        </div>

        <div className="bento">
          {cells.map((c, i) => (
            <div
              key={c.key}
              ref={el => cellRefs.current[i] = el}
              className={`bento-cell ${c.cls} reveal`}
              style={{
                transitionDelay: `${i * 80}ms`,
                background: c.accentBg,
              }}
            >
              {/* Top accent line */}
              <div className="cell-accent-bar" style={{ background: c.barColor }} />

              {/* Background glyph */}
              <div className="cell-bg-glyph">{c.icon}</div>

              {/* Icon */}
              <div
                className="bento-cell-icon"
                style={{ background: c.accentBg, border: `1px solid ${c.accentColor}22` }}
              >
                {c.icon}
              </div>

              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
