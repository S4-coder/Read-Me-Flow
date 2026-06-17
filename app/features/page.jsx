import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Features',
  description: 'ReadmeFlow features for generating professional README files.',
};

const features = [
  {
    title: 'GitHub Repository Lookup',
    description: 'Enter any public GitHub repository as owner/repo or a full GitHub URL to generate documentation instantly.',
  },
  {
    title: 'Auto Tech Detection',
    description: 'Detects dependencies, language hints, and common frameworks to build useful README badges.',
  },
  {
    title: 'Live Markdown Preview',
    description: 'Preview generated README content in raw markdown or rendered mode before copying or downloading.',
  },
  {
    title: 'Copy and Download',
    description: 'Copy the generated content to the clipboard or download it directly as README.md.',
  },
  {
    title: 'Direct GitHub Commit',
    description: 'Commit the generated README directly to the connected GitHub repository from the preview actions.',
  },
  {
    title: 'CLI and API Generator',
    description: 'Generate README files from the command line or through the Next.js API route for automation.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="layout-root">
      <Header />
      <main className="workspace" style={{ gridTemplateColumns: '1fr', padding: '3rem 1.75rem 2rem' }}>
        <section className="intro-banner" style={{ padding: '0 0 2rem' }}>
          <h1 className="intro-title">Features</h1>
          <p className="intro-subtitle">
            ReadMeFlow brings together repository lookup, README generation, live preview, and export tools in one polished workflow.
          </p>
        </section>

        <section className="panel" style={{ padding: 0, overflow: 'visible' }}>
          <div className="content-grid">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="feature-card"
              >
                <h2 className="feature-card-title">{feature.title}</h2>
                <p className="feature-card-description">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
