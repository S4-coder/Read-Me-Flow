import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Privacy',
  description: 'Privacy information for ReadmeFlow.',
};

const privacyItems = [
  {
    title: 'Repository Lookup',
    description: 'The web generator fetches public repository details from the GitHub API when you enter a public repository name or URL.',
  },
  {
    title: 'Data Storage',
    description: 'Generated README content stays in your browser session. The app does not store repository inputs or generated content on a server.',
  },
  {
    title: 'Theme Preference',
    description: 'The app stores only your selected theme preference in browser localStorage as readmeflow-theme.',
  },
  {
    title: 'External Links',
    description: 'Footer links open GitHub, YouTube, Instagram, and LinkedIn in new tabs. Those websites have their own privacy policies.',
  },
  {
    title: 'Security',
    description: 'Do not paste private tokens, credentials, or sensitive project details into the generator. Only use public repository information.',
  },
  {
    title: 'Direct GitHub Commit',
    description: 'The generator can commit the generated README directly to the connected GitHub repository using your personal access token in the browser session.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="layout-root">
      <Header />
      <main className="workspace" style={{ gridTemplateColumns: '1fr', padding: '3rem 1.75rem 2rem' }}>
        <section className="intro-banner" style={{ padding: '0 0 2rem' }}>
          <h1 className="intro-title">Privacy Policy</h1>
          <p className="intro-subtitle">
            ReadMeFlow is designed to access only public GitHub repository metadata needed to generate README content.
          </p>
        </section>

        <section className="panel" style={{ padding: 0, overflow: 'visible' }}>
          <div className="privacy-grid">
            {privacyItems.map((item) => (
              <article
                key={item.title}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: '18px',
                  padding: '1.25rem',
                }}
              >
                <h2 style={{ fontSize: '18px', marginBottom: '0.5rem' }}>{item.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
