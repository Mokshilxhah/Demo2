import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" style={{ padding: 0 }}>

      {/* ── Top band ── */}
      <div style={{ padding: '64px 0 48px', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:48 }}>
          
          {/* Brand block */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:36,height:36,background:'linear-gradient(135deg,var(--primary),var(--indigo))',borderRadius:10,display:'grid',placeItems:'center',fontWeight:900,fontSize:'0.85rem',color:'#fff' }}>BQ</div>
              <span style={{ fontFamily:'var(--font-alt)',fontWeight:700,fontSize:'1.2rem',letterSpacing:'-0.02em' }}>BuildQueue</span>
            </div>
            <p style={{ fontSize:'0.9rem',color:'var(--txt-2)',lineHeight:1.7 }}>
              A transparent, high-quality project booking platform. We turn your ideas into production-ready full-stack applications.
            </p>
            <div style={{ display:'flex',gap:10,marginTop:24,flexWrap:'wrap' }}>
              {['Twitter','GitHub','LinkedIn','WhatsApp'].map((s,i) => (
                <a key={i} href="#" style={{ padding:'6px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:'0.78rem',fontWeight:600,color:'var(--txt-2)',textDecoration:'none',transition:'all 0.2s' }}
                  onMouseOver={e=>{e.currentTarget.style.borderColor='var(--primary)';e.currentTarget.style.color='var(--primary)'}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--txt-2)'}}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:48, flex:1, minWidth: 280 }}>
            {[
              { title:'Platform', links:['How It Works','Features','Tech Stack','Projects','Book Project'] },
              { title:'Company',  links:['About Us','Blog','Careers','Press Kit'] },
              { title:'Contact',  links:['hello@buildqueue.dev','WhatsApp Us','Privacy Policy','Terms'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--txt-3)',marginBottom:18 }}>{col.title}</div>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{ display:'block',fontSize:'0.88rem',color:'var(--txt-2)',textDecoration:'none',marginBottom:12,transition:'color 0.2s' }}
                    onMouseOver={e=>e.target.style.color='var(--txt)'}
                    onMouseOut={e=>e.target.style.color='var(--txt-2)'}>
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ padding:'20px 0' }}>
        <div className="wrap" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:'0.8rem', color:'var(--txt-3)' }}>© {new Date().getFullYear()} BuildQueue. All rights reserved.</p>
          <div style={{ display:'flex', gap:20 }}>
            {['Privacy Policy','Terms of Service','Cookie Policy'].map((l,i) => (
              <a key={i} href="#" style={{ fontSize:'0.8rem',color:'var(--txt-3)',textDecoration:'none',transition:'color 0.2s' }}
                onMouseOver={e=>e.target.style.color='var(--txt-2)'}
                onMouseOut={e=>e.target.style.color='var(--txt-3)'}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
