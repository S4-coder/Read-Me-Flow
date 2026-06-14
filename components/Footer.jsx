export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '1.25rem', paddingBottom: '1.25rem', color: 'var(--text-secondary)' }}>
      <div style={{ maxWidth: '1180px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.75rem', paddingRight: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Made with ❤️ by Sabeel Ahmed
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a href="https://www.youtube.com/@sabeelcodes" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            YouTube
          </a>
          <a href="https://www.instagram.com/sabeelcodes/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            Instagram
          </a>
          <a href="https://www.linkedin.com/in/sabeel-ahmed-3891b7383" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
