'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pages = [
  { href: '/', label: 'Home' },
  { href: '/badges', label: 'Badges' },
  { href: '/banner', label: 'Banner' },
  { href: '/github-stats', label: 'GitHub Stats' },
  { href: '/features', label: 'Features' },
  { href: '/privacy', label: 'Privacy' },
];

const githubUrl = 'https://github.com/S4-coder/Read-Me-Flow';
const visiblePages = pages.slice(0, 1);
const hiddenPages = pages.slice(1);

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('readmeflow-theme') || 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const themeLabel = mounted
    ? theme === 'dark'
      ? '☀️ Light'
      : '🌙 Dark'
    : '☀️ Light';
  const themeTitle = mounted
    ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
    : 'Switch to light mode';

  const searchResults = pages.filter((page) =>
    page.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">RF</div>
          <span>Readme Flow</span>
        </div>
        <nav className="navbar-actions">
          <div className="nav-search">
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && searchResults.length > 0 && (
              <div className="nav-search-dropdown">
                {searchResults.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={`nav-search-item ${pathname === page.href ? 'nav-search-item-active' : ''}`}
                    onClick={() => setSearchQuery('')}
                  >
                    {page.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={toggleTheme}
            title={themeTitle}
          >
            {themeLabel}
          </button>
          <div className="nav-page-links">
            {visiblePages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={`nav-page-link ${pathname === page.href ? 'nav-page-link-active' : ''}`}
              >
                {page.label}
              </Link>
            ))}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-page-link"
            >
              GitHub
            </a>
          </div>
          <button
            type="button"
            className="btn btn-icon sidebar-toggle"
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
                href={githubUrl}
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
