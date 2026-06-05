import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { user, logout }          = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Process',  href: '#flow' },
    { label: 'Features', href: '#features' },
    { label: 'Stack AI', href: '#tech' },
    { label: 'Projects', href: '#projects' },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <div className="logo-mark">BQ</div>
            <span className="logo-text">BuildQueue</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links" style={{ listStyle: 'none' }}>
            {navLinks.map(link => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem', border: 'none' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                  Book Project
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span style={{
              transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              background: menuOpen ? 'var(--t1)' : undefined,
            }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{
              transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              background: menuOpen ? 'var(--t1)' : undefined,
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>

        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute', top: 24, right: 24,
            background: 'var(--g2)', border: '1px solid var(--b1)',
            borderRadius: '50%', width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--t2)', fontSize: '1.2rem',
          }}
        >×</button>

        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {link.label}
          </a>
        ))}

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {user ? (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="btn btn-primary"
            >Sign Out</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                Book Project
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
