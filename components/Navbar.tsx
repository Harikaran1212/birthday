'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: '🏠 Home' },
  { href: '/memories', label: '📸 Memories' },
  { href: '/wishes', label: '💌 Wishes' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-heart">💕</span>
        <span className="navbar-title">Suwathika&apos;s Birthday</span>
        <span className="navbar-heart">💕</span>
      </div>

      {/* Hamburger button — shown only on mobile */}
      <button
        className={`hamburger ${menuOpen ? 'hamburger-open' : ''}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Nav links — collapsible on mobile */}
      <ul className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`navbar-link ${pathname === link.href ? 'navbar-link-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
