import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <a href="/" className="logo">
          <div className="logo-mark">BQ</div>
          <span className="logo-text">BuildQueue</span>
        </a>

        <ul className={`nav-links${open ? ' open' : ''}`}>
          <li><a href="#flow" onClick={() => setOpen(false)}>Process</a></li>
          <li><a href="#features" onClick={() => setOpen(false)}>Features</a></li>
          <li><a href="#tech" onClick={() => setOpen(false)}>Tech Stack</a></li>
          <li><a href="#projects" onClick={() => setOpen(false)}>Projects</a></li>
        </ul>

        <div className={`nav-actions${open ? ' open' : ''}`}>
          <a href="/login" className="btn btn-secondary" style={{ padding: '9px 20px', fontSize: '0.875rem' }}>Log In</a>
          <a href="/register" className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '0.875rem' }}>Book Project</a>
        </div>

        <div className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span style={{ transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: open ? 0 : 1, width: open ? 0 : '22px' }}></span>
          <span style={{ transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
        </div>
      </div>
    </nav>
  );
}
