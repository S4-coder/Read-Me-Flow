'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pages = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/privacy', label: 'Privacy' },
];

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('readmeflow-theme') || 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('readmeflow-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">RF</div>
          <span>Readme Flow</span>
        </div>
        <nav className="navbar-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            type="button"
            className="btn btn-icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            title="Open navigation"
          >
            ☰
          </button>
        </nav>
      </header>

      {sidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          <aside className="sidebar-panel" aria-label="Site navigation">
            <div className="sidebar-header">
              <span>Pages</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation"
              >
                ✕
              </button>
            </div>
            <div className="sidebar-links">
              {pages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`sidebar-link ${pathname === page.href ? 'sidebar-link-active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {page.label}
                </Link>
              ))}
              <a
                href="https://github.com/S4-coder/Read-Me-Flow"
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-link"
              >
                GitHub
              </a>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
