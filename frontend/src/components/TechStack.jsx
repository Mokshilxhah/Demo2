import React, { useState } from 'react';

const OPTIONS = {
  frontend: [
    { id: 'react',   label: 'React',    color: '#61dafb', icon: '⚛️' },
    { id: 'nextjs',  label: 'Next.js',  color: '#ffffff', icon: '▲' },
    { id: 'vue',     label: 'Vue',      color: '#42b883', icon: '🔷' },
    { id: 'angular', label: 'Angular',  color: '#dd0031', icon: '🅰️' },
  ],
  backend: [
    { id: 'node',    label: 'Node',     color: '#68a063', icon: '🟢' },
    { id: 'django',  label: 'Django',   color: '#44b78b', icon: '🐍' },
    { id: 'spring',  label: 'Spring',   color: '#6db33f', icon: '🍃' },
    { id: 'fastapi', label: 'FastAPI',  color: '#009688', icon: '⚡' },
  ],
  database: [
    { id: 'mongo',    label: 'MongoDB',   color: '#47a248', icon: '🍃' },
    { id: 'postgres', label: 'Postgres',  color: '#336791', icon: '🐘' },
    { id: 'mysql',    label: 'MySQL',     color: '#f29111', icon: '🐬' },
    { id: 'redis',    label: 'Redis',     color: '#dc382d', icon: '🔴' },
  ],
};

const COMPAT = {
  'react+node+mongo':    { score: 100, name: 'MERN Stack',          use: 'Social apps, dashboards, SaaS', deploy: 'Vercel + Railway' },
  'react+node+postgres': { score: 95,  name: 'PERN Stack',          use: 'Fintech, e-commerce, analytics', deploy: 'Vercel + Supabase' },
  'react+node+mysql':    { score: 88,  name: 'MEAN (SQL)',          use: 'CMS, blogs, corporate sites', deploy: 'Vercel + PlanetScale' },
  'react+node+redis':    { score: 82,  name: 'React + Node + Redis',use: 'Real-time apps, caching layers', deploy: 'Railway + Upstash', warn: 'Redis alone is not a primary DB — pair with Mongo or Postgres.' },
  'nextjs+node+mongo':   { score: 98,  name: 'Next + Node + Mongo', use: 'SEO-heavy SaaS, storefronts', deploy: 'Vercel + Atlas' },
  'nextjs+node+postgres':{ score: 97,  name: 'T3 Stack Variant',    use: 'Type-safe full-stack apps', deploy: 'Vercel + Neon' },
  'react+django+postgres':{ score: 96, name: 'Django + React',      use: 'ML platforms, admin dashboards', deploy: 'AWS + EC2' },
  'react+django+mysql':  { score: 85,  name: 'Django + React (SQL)',use: 'Enterprise CRMs, data apps', deploy: 'AWS + RDS' },
  'react+django+mongo':  { score: 78,  name: 'Django + React + Mongo', use: 'Django prefers SQL — unusual but possible', deploy: 'Heroku + Atlas', warn: 'Django ORM works best with SQL. Use djongo or motor for MongoDB.' },
  'nextjs+django+postgres':{ score: 90, name: 'Next.js + Django',   use: 'Hybrid SSR + REST APIs', deploy: 'Vercel + Heroku' },
  'react+spring+postgres':{ score: 94, name: 'Spring + React',      use: 'Banking, ERP, microservices', deploy: 'AWS + EC2' },
  'react+spring+mysql':  { score: 90,  name: 'Spring MVC Stack',    use: 'Enterprise Java apps', deploy: 'AWS + RDS' },
  'nextjs+spring+postgres':{ score: 89, name: 'Next + Spring',      use: 'Enterprise portals', deploy: 'Kubernetes' },
  'react+fastapi+postgres':{ score: 93, name: 'FastAPI + React',    use: 'AI/ML apps, real-time data APIs', deploy: 'Railway + Neon' },
  'react+fastapi+mongo': { score: 91,  name: 'FastAPI + Mongo',     use: 'LLM wrappers, chatbots', deploy: 'Railway + Atlas' },
  'nextjs+fastapi+postgres':{ score: 88, name: 'Next + FastAPI',    use: 'AI-powered web platforms', deploy: 'Vercel + Railway' },
  'angular+node+mongo':  { score: 80,  name: 'MEAN Stack',          use: 'Enterprise Angular apps', deploy: 'Azure + Atlas', warn: 'Angular adds complexity; ensure team proficiency.' },
  'angular+spring+postgres':{ score: 85, name: 'Angular + Spring',  use: 'Full-stack Java enterprise', deploy: 'AWS + RDS' },
  'vue+node+mongo':      { score: 82,  name: 'MEVN Stack',          use: 'Lightweight SPA apps', deploy: 'Netlify + Railway' },
};

function getResult(f, b, d) {
  if (!f || !b || !d) return null;
  const key = [f, b, d].join('+');
  return COMPAT[key] || { score: 62, name: 'Custom Stack', use: 'Uncommon combo — may need extra config', deploy: 'Manual setup', warn: 'Limited community support. We can still build it — reach out to discuss.' };
}

function ScoreRing({ score }) {
  const color = score >= 90 ? '#14b8a6' : score >= 75 ? '#f59e0b' : '#f43f5e';
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 40 40)" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontWeight: 900, fontSize: '1rem', color }}>{score}</span>
        <span style={{ fontSize: '0.55rem', color: 'var(--txt-3)', fontWeight: 600 }}>/ 100</span>
      </div>
    </div>
  );
}

function OptionChips({ items, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.map(item => {
        const active = selected === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id === selected ? null : item.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 20, cursor: 'pointer',
              border: `1px solid ${active ? item.color : 'rgba(255,255,255,0.1)'}`,
              background: active ? `${item.color}22` : 'rgba(255,255,255,0.03)',
              color: active ? item.color : 'var(--txt-2)',
              fontSize: '0.78rem', fontWeight: 600,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>{item.icon}</span>
            {item.label}
            {active && <span style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, flexShrink: 0 }} />}
          </button>
        );
      })}
    </div>
  );
}

export default function TechStack() {
  const [front, setFront] = useState(null);
  const [back, setBack]   = useState(null);
  const [db, setDb]       = useState(null);

  const result     = getResult(front, back, db);
  const allDone    = front && back && db;
  const statusColor = result ? (result.score >= 90 ? '#14b8a6' : result.score >= 75 ? '#f59e0b' : '#f43f5e') : null;

  const CATS = [
    { key: 'frontend', label: 'Frontend',  color: '#38bdf8', items: OPTIONS.frontend, val: front, set: setFront },
    { key: 'backend',  label: 'Backend',   color: '#14b8a6', items: OPTIONS.backend,  val: back,  set: setBack },
    { key: 'database', label: 'Database',  color: '#f59e0b', items: OPTIONS.database, val: db,   set: setDb },
  ];

  return (
    <section id="tech" className="tech-section" style={{ padding: '60px 0' }}>
      <div className="wrap">
        <div className="section-header" style={{ marginBottom: 36 }}>
          <span className="label">AI Stack Suggestor</span>
          <h2 className="heading-lg">Build Your Perfect Stack</h2>
          <p className="body-md">Pick one from each layer — get instant compatibility, use cases & deploy tips.</p>
        </div>

        {/* ── Selector row: all 3 categories side by side ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 16,
        }}>
          {CATS.map(cat => (
            <div key={cat.key} style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${cat.val ? `${cat.color}35` : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 12,
              padding: '14px',
              transition: 'border-color 0.25s',
            }}>
              {/* Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <div style={{ width: 3, height: 12, borderRadius: 2, background: cat.color }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: cat.color }}>{cat.label}</span>
                {cat.val && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 700, padding: '1px 6px', borderRadius: 20, background: `${cat.color}20`, color: cat.color }}>
                    ✓ {OPTIONS[cat.key].find(x => x.id === cat.val)?.label}
                  </span>
                )}
              </div>
              {/* Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {cat.items.map(item => {
                  const active = cat.val === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => cat.set(active ? null : item.id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 9px', borderRadius: 20, cursor: 'pointer',
                        border: `1px solid ${active ? item.color : 'rgba(255,255,255,0.09)'}`,
                        background: active ? `${item.color}1a` : 'transparent',
                        color: active ? item.color : 'var(--txt-2)',
                        fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '0.8rem' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {CATS.map((c, i) => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: c.val ? c.color : 'rgba(255,255,255,0.07)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* ── Result panel — only shows when selections made ── */}
        {!allDone ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center',
            padding: '20px', borderRadius: 12,
            background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontSize: '1.5rem', opacity: 0.4 }}>🤖</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--txt-3)' }}>
              {!front ? 'Select a Frontend to begin' : !back ? 'Now pick a Backend' : 'Finally, choose a Database'}
            </span>
            <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
              {CATS.map((c, i) => (
                <div key={i} style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: `2px solid ${c.val ? c.color : 'rgba(255,255,255,0.1)'}`,
                  background: c.val ? `${c.color}20` : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.58rem', fontWeight: 700,
                  color: c.val ? c.color : 'var(--txt-3)',
                  transition: 'all 0.3s',
                }}>
                  {c.val ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>
        ) : result && (() => {
          const isHigh = result.score >= 90;
          const isMid  = result.score >= 75;
          const label  = isHigh ? '✅ Full-Stack Ready' : isMid ? '⚠️ Workable Stack' : '❌ Difficult Combo';

          return (
            <div style={{
              background: `${statusColor}08`,
              border: `1px solid ${statusColor}30`,
              borderRadius: 14, padding: '22px 24px',
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 20, alignItems: 'center',
            }}>
              {/* Score ring + status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <ScoreRing score={result.score} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, lineHeight: 1.2 }}>{result.name}</div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                    {[OPTIONS.frontend.find(x=>x.id===front), OPTIONS.backend.find(x=>x.id===back), OPTIONS.database.find(x=>x.id===db)].map((item, i) => item && (
                      <span key={i} style={{ display:'flex', alignItems:'center', gap:3, padding:'2px 7px', borderRadius:5, background:`${item.color}18`, border:`1px solid ${item.color}30`, fontSize:'0.68rem', fontWeight:700, color:item.color }}>
                        {item.icon} {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Best for */}
              <div>
                <div style={{ fontSize: '0.62rem', color: 'var(--txt-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Best For</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--txt-2)', lineHeight: 1.5 }}>{result.use}</div>
              </div>

              {/* Deploy + warn */}
              <div>
                <div style={{ fontSize: '0.62rem', color: 'var(--txt-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Deploy On</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: result.warn ? 8 : 0 }}>{result.deploy}</div>
                {result.warn && (
                  <div style={{ fontSize: '0.72rem', color: '#fbbf24', lineHeight: 1.45 }}>💡 {result.warn}</div>
                )}
              </div>

              {/* CTA */}
              <a href="/register" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '10px 18px', whiteSpace: 'nowrap' }}>
                Book This Stack
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          );
        })()}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #tech .stack-selector { grid-template-columns: 1fr !important; }
          #tech .result-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

