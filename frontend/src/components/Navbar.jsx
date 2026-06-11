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
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '2px', background: '#fff' }}>
              <img src="/images/logo.png" alt="Reqworks" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <span className="logo-text">Reqworks</span>
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
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} style={{ zIndex: 105 }}>

        {/* Top Header Bar inside Mobile Menu */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '2px', background: '#fff' }}>
              <img src="/images/logo.png" alt="Reqworks" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <span className="logo-text">Reqworks</span>
          </Link>

          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: 'var(--g2)', border: '1px solid var(--b1)',
              borderRadius: '50%', width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--t2)', fontSize: '1.2rem',
              transition: 'background 0.2s',
            }}
          >
            ×
          </button>
        </div>

        {/* Links Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          marginTop: 84,
        }}>
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                animationDelay: `${i * 60}ms`,
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--fd)',
                color: 'var(--t2)',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginTop: 24,
          width: '100%',
          maxWidth: '240px',
          padding: '0 16px',
        }}>
          {user ? (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="btn btn-primary"
              style={{ justifyContent: 'center', width: '100%', padding: '8px 16px', fontSize: '0.85rem' }}
            >Sign Out</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'center', width: '100%', padding: '8px 16px', fontSize: '0.85rem' }}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'center', width: '100%', padding: '8px 16px', fontSize: '0.85rem' }}>
                Book Project
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
