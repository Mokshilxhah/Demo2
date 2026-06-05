import React from 'react';

const amazingCards = [
  {
    accent: '#6ee7b7',
    accentBg: 'rgba(110,231,183,0.06)',
    accentBorder: 'rgba(110,231,183,0.15)',
    tag: 'Real-Time',
    title: 'Live Queue\nTracking',
    desc: 'Always know exactly where your project stands — position, progress, ETA. Zero chasing for updates.',
    visual: (
      <div style={{ padding: '16px 18px' }}>
        {/* Pipeline steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 18 }}>
          {['Submit', 'Review', 'Build', 'Deploy', 'Done'].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i <= 2 ? 'rgba(110,231,183,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${i <= 2 ? '#6ee7b7' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', color: i <= 2 ? '#6ee7b7' : 'var(--t4)',
                  fontWeight: 700,
                }}>
                  {i < 2 ? '✓' : i === 2 ? '●' : ''}
                </div>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: i <= 2 ? '#6ee7b7' : 'var(--t4)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < 4 && <div style={{ height: 1.5, flex: 0.5, background: i < 2 ? '#6ee7b7' : 'rgba(255,255,255,0.07)', marginBottom: 18 }} />}
            </React.Fragment>
          ))}
        </div>
        {/* Current stage info */}
        <div style={{ background: 'rgba(110,231,183,0.06)', border: '1px solid rgba(110,231,183,0.18)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: '#6ee7b7', fontWeight: 700 }}>⚙ Building</span>
            <span style={{ fontFamily: 'var(--fm)', fontSize: '0.58rem', color: 'var(--t4)' }}>ETA: 11 days</span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
            <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg,#6ee7b7,#818cf8)', borderRadius: 99 }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    accent: '#818cf8',
    accentBg: 'rgba(129,140,248,0.06)',
    accentBorder: 'rgba(129,140,248,0.15)',
    tag: 'Expert Team',
    title: 'Reviewed in\n24 Hours',
    desc: 'Submit your brief today — receive a precise timeline, cost estimate, and stack recommendation by tomorrow.',
    visual: (
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--fm)', fontSize: '0.58rem', color: 'var(--t4)', marginBottom: 10 }}>BuildQueue Team · Today, 10:42 AM</div>
        {/* Chat bubble from team */}
        <div style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.22)', borderRadius: '12px 12px 12px 3px', padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--t1)', lineHeight: 1.6, marginBottom: 6 }}>Hi! We've reviewed your project. Here's your estimate:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[['Timeline', '21 days', '#818cf8'], ['Budget', '$3.8k–5.2k', '#6ee7b7'], ['Stack', 'React+FastAPI', '#93c5fd']].map(([k,v,c]) => (
              <div key={k} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '3px 7px' }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--t4)' }}>{k}</div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: c, fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Reply from user */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px 12px 3px 12px', padding: '8px 12px', marginLeft: 16 }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--t2)' }}>Looks great, let's go ahead! 🚀</div>
        </div>
      </div>
    ),
  },
  {
    accent: '#fbbf24',
    accentBg: 'rgba(251,191,36,0.06)',
    accentBorder: 'rgba(251,191,36,0.15)',
    tag: 'Affordable',
    title: 'Quality Work,\nFair Price',
    desc: 'No agency markups. Prices are based purely on your requirements — you pay for what you actually need.',
    visual: (
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--fm)', fontSize: '0.58rem', color: 'var(--t4)', marginBottom: 12 }}>Cost comparison</div>
        {/* Agency vs BuildQueue comparison */}
        {[
          { label: 'Large Agency', val: '$18,000+', pct: '100%', color: 'rgba(249,168,212,0.7)', muted: true },
          { label: 'Freelancer (Risk)', val: '$8,000+', pct: '55%',  color: 'rgba(251,191,36,0.5)', muted: true },
          { label: 'BuildQueue', val: '$2.4k–$9k', pct: '38%',  color: '#6ee7b7', muted: false },
        ].map(r => (
          <div key={r.label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '0.58rem', color: r.muted ? 'var(--t4)' : 'var(--t1)', fontWeight: r.muted ? 400 : 700 }}>{r.label}</span>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: r.muted ? 'var(--t4)' : '#6ee7b7', fontWeight: 700 }}>{r.val}</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 99 }}>
              <div style={{ width: r.pct, height: '100%', background: r.color, borderRadius: 99 }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: '6px 10px', borderRadius: 6, background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', fontFamily: 'var(--fm)', fontSize: '0.6rem', color: '#6ee7b7', textAlign: 'center' }}>
          Same quality · Fraction of the cost
        </div>
      </div>
    ),
  },
];

const footerCols = [
  {
    title: 'Platform',
    links: [
      { label: 'How It Works', href: '#flow' },
      { label: 'Features',     href: '#features' },
      { label: 'Tech Stack',   href: '#tech' },
      { label: 'Our Work',     href: '#projects' },
      { label: 'Book Project', href: '/register' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',  href: '#' },
      { label: 'Blog',      href: '#' },
      { label: 'Careers',   href: '#' },
      { label: 'Press Kit', href: '#' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'hello@buildqueue.dev', href: 'mailto:hello@buildqueue.dev' },
      { label: 'WhatsApp Us',          href: '#' },
      { label: 'Privacy Policy',       href: '#' },
      { label: 'Terms of Service',     href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-watermark" aria-hidden="true">BQ</div>

      {/* ── What's Amazing ── */}
      <div className="footer-ref-row">
        <div className="wrap">
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Why BuildQueue</div>
            <h2 className="h2" style={{ marginBottom: 10 }}>
              What Makes Us <span className="grad-1">Amazing</span>
            </h2>
            <p className="body-md">Three things that set every BuildQueue project apart.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {amazingCards.map((card, i) => (
              <div key={i} style={{
                borderRadius: 18,
                border: `1px solid ${card.accentBorder}`,
                background: card.accentBg,
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Visual mockup */}
                <div style={{
                  borderBottom: `1px solid ${card.accentBorder}`,
                  background: 'var(--bg-3)',
                  minHeight: 160,
                }}>
                  {card.visual}
                </div>

                {/* Caption */}
                <div style={{ padding: '20px 20px 24px' }}>
                  <span style={{
                    fontFamily: 'var(--fm)', fontSize: '0.6rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: card.accent, background: card.accentBg,
                    border: `1px solid ${card.accentBorder}`,
                    padding: '2px 8px', borderRadius: 99, marginBottom: 10,
                    display: 'inline-block',
                  }}>
                    {card.tag}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700,
                    color: 'var(--t1)', lineHeight: 1.25, marginBottom: 8,
                    letterSpacing: '-0.02em', whiteSpace: 'pre-line', marginTop: 8,
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--t3)', lineHeight: 1.65 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ── Links & Brand ── */}
      <div className="wrap">
        <div className="footer-links-row">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <div className="logo-mark">BQ</div>
              <span className="logo-text">BuildQueue</span>
            </div>
            <p>
              A transparent, queue-based project studio. We turn your ideas into
              production-ready applications with honest pricing and full visibility.
            </p>
            <div className="footer-socials">
              {['Twitter', 'GitHub', 'LinkedIn', 'WhatsApp'].map((s, i) => (
                <a key={i} href="#" className="footer-social-link">{s}</a>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div className="footer-cols">
            {footerCols.map((col, i) => (
              <div key={i}>
                <div className="footer-col-title">{col.title}</div>
                <div className="footer-col-links">
                  {col.links.map((link, j) => (
                    <a key={j} href={link.href}>{link.label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-copyright">
            © {new Date().getFullYear()} BuildQueue. Built with care and precision.
          </span>
          <div className="footer-legal">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l, i) => (
              <a key={i} href="#">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
