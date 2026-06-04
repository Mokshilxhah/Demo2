import React from 'react';

const projects = [
  {
    name: 'NexPay Fintech',
    type: 'MERN Stack',
    typeColor: '#14b8a6',
    tags: ['React', 'Node.js', 'MongoDB', 'Redis'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    desc: 'Real-time financial dashboard with live market feeds and payment gateway.',
    link: '#'
  },
  {
    name: 'ShopSphere',
    type: 'Django + React',
    typeColor: '#6366f1',
    tags: ['React', 'Django', 'PostgreSQL', 'AWS'],
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    desc: 'Full-featured e-commerce with AI-powered product recommendations.',
    link: '#'
  },
  {
    name: 'Orbitum Social',
    type: 'Spring Boot',
    typeColor: '#f59e0b',
    tags: ['Java', 'Next.js', 'Postgres', 'Docker'],
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    desc: 'Scalable social networking platform on enterprise microservices.',
    link: '#'
  },
];

export default function DemoProjects() {
  return (
    <section id="projects" className="projects-section">
      <div className="wrap">
        <div className="section-header" style={{ textAlign:'left', marginBottom:40 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:16 }}>
            <div>
              <span className="label">Portfolio</span>
              <h2 className="heading-lg">Full-Stack Projects</h2>
            </div>
            <a href="#all-projects" className="btn btn-secondary" style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', fontSize:'0.9rem' }}>
              All Projects
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="projects-grid">
          {projects.map((p, i) => (
            <a key={i} href={p.link} className="project-card" style={{ textDecoration:'none', color:'inherit', display:'block' }}>
              <div className="project-img">
                <img src={p.img} alt={p.name} />
                <div className="project-overlay">
                  <p style={{ fontSize:'0.85rem', color:'#e2e8f0', lineHeight:1.5 }}>{p.desc}</p>
                </div>
                {/* Hover redirect arrow */}
                <div className="project-link-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </div>
              </div>
              <div className="project-body">
                <div className="project-type" style={{ color: p.typeColor }}>{p.type}</div>
                <div className="project-name">{p.name}</div>
                <div className="project-tags">
                  {p.tags.map((t, j) => <span key={j} className="project-tag">{t}</span>)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
