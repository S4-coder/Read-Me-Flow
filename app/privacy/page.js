import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="layout-root">
      <Header />
      <div className="workspace">
        <main className="panel" style={{ maxWidth: 'none', padding: '2rem 1.75rem' }}>
          <h1 className="text-4xl font-semibold mb-8 text-slate-100">Privacy Policy</h1>
          
          <p className="mb-8 text-base" style={{ color: 'var(--text-secondary)' }}>
            At <strong style={{ color: 'var(--accent)' }}>ReadMeFlow</strong>, we deeply respect developer privacy. Here is how we handle data:
          </p>
          
          <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            This tool generates professional README files for GitHub projects. It fetches public repository metadata, topics, and package.json to create comprehensive documentation.
          </p>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)', borderRadius: '18px', padding: '2rem' }}>
            <ul className="text-slate-300 space-y-5" style={{ '--text-secondary': '#94a3b8' }}>
              <li className="flex items-start gap-4 px-4 py-3 rounded-lg hover:bg-slate-800/30 transition-colors" style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--accent)', fontSize: '16px' }}>•</span>
                <strong style={{ color: 'var(--text-primary)' }}>No Data Retention:</strong> We do not store your pasted GitHub repository URLs, source code, or generated markdown files on any database. Everything is processed on the fly.
              </li>
              <li className="flex items-start gap-4 px-4 py-3 rounded-lg hover:bg-slate-800/30 transition-colors" style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--accent)', fontSize: '16px' }}>•</span>
                <strong style={{ color: 'var(--text-primary)' }}>Authentication & API:</strong> We only interact with the official GitHub API to fetch public repository data (like file trees and descriptions) to construct your README. We never ask for your private account passwords or tokens.
              </li>
              <li className="flex items-start gap-4 px-4 py-3 rounded-lg hover:bg-slate-800/30 transition-colors" style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--accent)', fontSize: '16px' }}>•</span>
                <strong style={{ color: 'var(--text-primary)' }}>Analytics:</strong> We use minimal, privacy-friendly analytics to count visits, helping us improve the tool without tracking personal user information.
              </li>
            </ul>
          </div>

          <p className="mt-8 text-slate-500 text-sm">
            <em>Last updated: June 2026</em>
          </p>
        </main>
      </div>
      <Footer />
    </div>
  );
}