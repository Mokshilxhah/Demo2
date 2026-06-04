import React from 'react';

export default function GetStarted() {
  return (
    <section className="cta-section">
      <div className="wrap">
        <div className="cta-box">
          <span className="label" style={{ marginBottom: 20 }}>Ready to Ship?</span>
          <h2>Turn your idea into a <span className="grad-purple-blue">live product.</span></h2>
          <p>Join the queue today. Get instant estimates, transparent tracking, and high-quality code — delivered on time, every time.</p>
          <div className="cta-actions">
            <a href="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Book Your Project
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#projects" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              See Our Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
