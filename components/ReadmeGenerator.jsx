'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Header from './Header';
import Footer from './Footer';

const CLI_COMMAND = 'npm run generate-readme';

function normalizeRepoInput(input) {
  if (!input) return {};

  const value = String(input).trim();
  const match = value.match(/github\.com\/([^/]+)\/([^/?#]+)/);

  if (match) {
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, ''),
    };
  }

  const parts = value.split('/').filter(Boolean);
  if (parts.length === 2) {
    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ''),
    };
  }

  return {};
}

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

export default function ReadmeGenerator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [projectData, setProjectData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [commitStatus, setCommitStatus] = useState('');
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState('raw');
  const [cliCopied, setCliCopied] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('readmeflow-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('readmeflow-theme', next);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next);
    }
  };

  const fetchGitHubProject = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a GitHub repository (format: owner/repo or full URL)');
      return;
    }

    setLoading(true);
    setError('');
    setProjectData(null);

    try {
      let owner, repo;

      if (searchQuery.includes('github.com')) {
        const match = searchQuery.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) throw new Error('Invalid GitHub URL format');
        owner = match[1];
        repo = match[2].replace('.git', '');
      } else {
        [owner, repo] = searchQuery.trim().split('/');
      }

      if (!owner || !repo) {
        throw new Error('Invalid format. Use: owner/repo or https://github.com/owner/repo');
      }

      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoRes.ok) throw new Error('Repository not found');

      const repoData = await repoRes.json();

      let techs = [];
      let topics = repoData.topics || [];

      try {
        const pkgRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/package.json`
        );
        if (pkgRes.ok) {
          const pkgData = await pkgRes.json();
          const content = JSON.parse(atob(pkgData.content));
          const allDeps = {
            ...content.dependencies,
            ...content.devDependencies,
          };

          const keywords = {
            next: 'Next.js',
            react: 'React',
            typescript: 'TypeScript',
            express: 'Express',
            django: 'Django',
            mongodb: 'MongoDB',
            mongoose: 'MongoDB',
            postgresql: 'PostgreSQL',
            'tailwindcss': 'Tailwind',
            docker: 'Docker',
            axios: 'Axios',
            lodash: 'Lodash',
            prism: 'Prisma',
            redis: 'Redis',
            graphql: 'GraphQL',
            '@apollo/client': 'GraphQL',
            firebase: 'Firebase',
            '@supabase/supabase-js': 'Supabase',
            'socket.io': 'Socket.io',
            jest: 'Jest',
            nodemon: 'Nodemon',
            sass: 'Sass',
          };

          Object.keys(allDeps).forEach((dep) => {
            Object.entries(keywords).forEach(([key, tech]) => {
              if (dep.toLowerCase().includes(key) && !techs.includes(tech)) {
                techs.push(tech);
              }
            });
          });
        }
      } catch (err) {
        console.log('Could not fetch package.json');
      }

      const fallbackLang = repoData.language
        ? [repoData.language]
        : [];
      const allTechs = techs.length > 0 ? techs : fallbackLang;

      setProjectData({
        name: repoData.name,
        description: repoData.description || 'A comprehensive open-source project built for modern development.',
        owner: repoData.owner.login,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        language: repoData.language,
        topics: topics,
        techs: allTechs,
      });

      generateReadme(repoData, allTechs, topics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReadme = (repoData, techs, topics) => {
    const lang = repoData.language || 'JavaScript';
    const isReact = techs.some(t => ['React', 'Next.js', 'Vue', 'Angular'].includes(t));
    const isBackend = techs.some(t => ['Express', 'Django', 'Node.js', 'Flask', 'Spring'].includes(t));
    const isFullstack = isReact && isBackend;

    let intro = '';
    if (isFullstack) {
      intro = `**${repoData.name}** is a modern **full-stack** application built with ${techs.slice(0, 3).join(', ')}. It provides a robust foundation for scalable web solutions with clean architecture, comprehensive tooling, and production-ready deployment configurations.`;
    } else if (isReact) {
      intro = `**${repoData.name}** is a modern **frontend** application crafted with ${techs.slice(0, 3).join(', ')}. It delivers a seamless user experience with reactive components, state-of-the-art styling, and optimized performance for modern browsers.`;
    } else if (isBackend) {
      intro = `**${repoData.name}** is a powerful **backend** service built with ${techs.slice(0, 3).join(', ')}. It provides reliable APIs, efficient data processing, and scalable architecture designed for high-traffic production environments.`;
    } else {
      intro = repoData.description
        ? repoData.description
        : `**${repoData.name}** is a ${lang.toLowerCase()} project that demonstrates modern development practices and clean code architecture. Built with ${techs.slice(0, 3).join(', ') || lang}, it focuses on performance, maintainability, and developer experience.`;
    }

    let markdown = `# 🚀 ${repoData.name}\n\n`;
    markdown += `${intro}\n\n`;

    markdown += `![Stars](https://img.shields.io/github/stars/${repoData.owner.login}/${repoData.name}?style=flat-square) `;
    markdown += `![Forks](https://img.shields.io/github/forks/${repoData.owner.login}/${repoData.name}?style=flat-square) `;
    markdown += `![License](https://img.shields.io/github/license/${repoData.owner.login}/${repoData.name}) `;
    markdown += `![Language](https://img.shields.io/github/languages/top/${repoData.owner.login}/${repoData.name})\n\n`;

    if (topics.length > 0) {
      markdown += `🏷️ **Topics:** ${topics.map(t => `\`${t}\``).join(' • ')}\n\n`;
    }

    if (techs.length > 0) {
      markdown += `## 🛠️ Tech Stack\n\n`;
      techs.forEach((tech) => {
        markdown += `![${tech}](https://img.shields.io/badge/${tech}-000000?style=for-the-badge&logo=${tech.toLowerCase()}&logoColor=white) `;
      });
      markdown += '\n\n';
    }

    markdown += `## ✨ Key Features\n\n`;
    markdown += `- 🚀 **Production-Ready** - Optimized build process and deployment configurations\n`;
    markdown += `- 📁 **Structured Architecture** - Well-organized folder structure for scalability\n`;
    markdown += `- 🎨 **Modern UI** - Responsive design with smooth interactions\n`;
    markdown += `- ⚡ **Performance** - Optimized assets and lazy loading\n`;
    markdown += `- 🔒 **Security** - Best practices for secure development\n`;
    markdown += `- 📱 **Mobile-Friendly** - Fully responsive across all device sizes\n\n`;

    markdown += `## 📦 Installation\n\n\`\`\`bash\ngit clone ${repoData.html_url}.git\ncd ${repoData.name}\nnpm install\`\`\`\n\n`;

    markdown += `## 🚀 Usage\n\n\`\`\`bash\nnpm run dev\n\`\`\`\n\n`;

    markdown += `## 🧪 Testing\n\n\`\`\`bash\nnpm test\n\`\`\`\n\n`;

    markdown += `## 🚀 Deployment\n\n`;
    markdown += `Deploy easily to **Vercel**, **Netlify**, or any Node.js-compatible platform.\n\n`;
    markdown += `### Environment Variables\n\n`;
    markdown += `\`\`\`env\nNODE_ENV=production\nPORT=3000\n\`\`\`\n\n`;

    markdown += `## 🗺️ Roadmap\n\n`;
    markdown += `- [x] GitHub repository lookup and parsing\n`;
    markdown += `- [x] Auto tech stack detection with visual badges\n`;
    markdown += `- [x] Professional README generation with file tree\n`;
    markdown += `- [x] Web UI with live preview and theme toggle\n`;
    markdown += `- [ ] Multi-repo support (GitLab, Bitbucket)\n`;
    markdown += `- [ ] Custom theme templates\n`;
    markdown += `- [ ] Export to PDF and HTML\n\n`;

    markdown += `## ❓ FAQ\n\n`;
    markdown += `<details>\n<summary><strong>How does tech stack detection work?</strong></summary>\n\n`;
    markdown += `ReadmeFlow analyzes the repository's \`package.json\` to automatically detect technologies and map them to visual badges.\n\n`;
    markdown += `</details>\n\n`;
    markdown += `<details>\n<summary><strong>Can I customize the generated README?</strong></summary>\n\n`;
    markdown += `Yes! After generation, you can edit any section directly in the web interface, or copy the markdown and modify it in your preferred editor.\n\n`;
    markdown += `</details>\n\n`;
    markdown += `<details>\n<summary><strong>Is my GitHub data secure?</strong></summary>\n\n`;
    markdown += `Absolutely. ReadmeFlow only accesses public repository data through the GitHub API. No sensitive data is stored or transmitted.\n\n`;
    markdown += `</details>\n\n`;

    markdown += `## 📁 Project Structure\n\n\`\`\`text\n${repoData.name}/\n├── 📁 src/\n│   ├── 📁 components/\n│   ├── 📁 pages/\n│   └── 📄 index.js\n├── 📄 package.json\n├── 📄 README.md\n└── 📄 .env.example\n\`\`\`\n\n`;

    markdown += `## 📄 License\n\nDistributed under the MIT License. See \`LICENSE\` for more information.\n\n`;

    markdown += `## 👤 Author\n\n**${repoData.owner.login}** - [@${repoData.owner.login}](${repoData.owner.html_url})\n\n`;

    markdown += `## 📞 Support\n\nFor support, open an issue on GitHub or reach out via email.\n\n`;

    markdown += `---\n⭐ Star this repo if you found it helpful!\n`;

    setGeneratedReadme(markdown);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReadme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReadme = () => {
    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(generatedReadme);
    element.download = 'README.md';
    element.click();
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText(CLI_COMMAND);
    setCliCopied(true);
    setTimeout(() => setCliCopied(false), 2000);
  };

  const commitReadmeToGitHub = async () => {
    if (!generatedReadme) {
      setError('Generate a README before committing.');
      return;
    }

    const repo = normalizeRepoInput(searchQuery);
    if (!repo.owner || !repo.repo) {
      setError('Enter a GitHub repository first.');
      return;
    }

    const token = window.prompt('Enter your GitHub personal access token with repo/file write permission:');
    if (!token) return;

    const branch = window.prompt('Enter branch name:', 'main') || 'main';
    const filePath = window.prompt('Enter README file path:', 'README.md') || 'README.md';
    const message = window.prompt('Enter commit message:', 'Update README with ReadmeFlow') || 'Update README with ReadmeFlow';

    setCommitting(true);
    setCommitStatus('');
    setError('');

    try {
      const apiHeaders = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      };

      const existingFileRes = await fetch(
        `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/${encodeURIComponent(filePath)}`,
        { headers: apiHeaders }
      );

      let existingSha;
      if (existingFileRes.ok) {
        const existingFile = await existingFileRes.json();
        existingSha = existingFile.sha;
      } else if (existingFileRes.status !== 404) {
        throw new Error('Could not check existing README file.');
      }

      const commitBody = {
        message,
        branch,
        content: encodeBase64(generatedReadme),
      };

      if (existingSha) {
        commitBody.sha = existingSha;
      }

      const commitRes = await fetch(
        `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/${encodeURIComponent(filePath)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...apiHeaders,
          },
          body: JSON.stringify(commitBody),
        }
      );

      const commitData = await commitRes.json();
      if (!commitRes.ok) {
        throw new Error(commitData.message || 'Failed to commit README.');
      }

      setCommitStatus(`README committed to ${repo.owner}/${repo.repo} on ${branch}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="layout-root">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <div className="workspace" style={{ height: 'calc(100vh - 160px)' }}>
        <section className="intro-banner">
          <h1 className="intro-title">Readme Flow</h1>
          <p className="intro-subtitle">
            Automate professional README generation. Enter any GitHub repository and instantly produce a polished, badge-ready README with tech stack detection and project structure.
          </p>
          <div className="intro-badges">
            <span className="intro-pill">Free to use</span>
            <span className="intro-pill">Instant generation</span>
            <span className="intro-pill">Auto tech detection</span>
            <span className="intro-pill">CLI generator</span>
            <span className="intro-pill">Download .md</span>
            <span className="intro-pill">GitHub commit</span>
          </div>
        </section>

        <section className="panel panel-left">
          <div className="section-header">
            <div className="section-title">Repository Lookup</div>
          </div>

          <div className="card stack" style={{ '--stack-gap': '1rem' }}>
            <div className="input-wrapper">
              <label className="input-label" htmlFor="repo-input">
                GitHub repository
              </label>
              <div style={{ position: 'relative' }}>
                <span className="input-icon">🔍</span>
                <input
                  id="repo-input"
                  className="input input-with-icon"
                  type="text"
                  value={searchQuery}
                  placeholder="facebook/react or https://github.com/owner/repo"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && fetchGitHubProject()}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchGitHubProject}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate README'}
            </button>

            <div className="card card-elevated">
              <div className="section-header" style={{ marginBottom: '0.75rem' }}>
                <div className="section-title">CLI Generator</div>
              </div>
              <p className="text-slate-400" style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Generate a README directly from your terminal with the bundled CLI.
              </p>
              <div
                className="card"
                style={{
                  background: 'rgba(15, 23, 42, 0.28)',
                  border: '1px solid var(--border-dim)',
                  padding: '0.75rem 0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <code style={{ color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>{CLI_COMMAND}</code>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={copyCliCommand}
                >
                  {cliCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {error ? (
              <div className="card card-elevated" style={{ background: 'rgba(248, 113, 113, 0.08)', borderColor: 'rgba(248, 113, 113, 0.18)', color: '#f87171' }}>
                {error}
              </div>
            ) : (
              <div className="card card-elevated">
                <p className="text-slate-400" style={{ color: 'var(--text-secondary)' }}>
                  Discover the power of ReadmeFlow. Enter any public GitHub repository and instantly generate a professional README with badges, tech stack, file structure, and more.
                </p>
              </div>
            )}
          </div>

          {projectData && (
            <div className="card stack" style={{ '--stack-gap': '1rem', marginTop: '1.5rem' }}>
              <div className="section-header">
                <div className="section-title">Project Details</div>
              </div>
              <div>
                <strong>{projectData.name}</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {projectData.description}
                </p>
              </div>

              <div className="pill-group">
                {projectData.techs.map((tech) => (
                  <span key={tech} className="pill selected">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="check-list">
                <div className="check-item">
                  <div className="check-label">Owner: {projectData.owner}</div>
                </div>
                <div className="check-item">
                  <div className="check-label">Stars: {projectData.stars.toLocaleString()}</div>
                </div>
                <div className="check-item">
                  <div className="check-label">Language: {projectData.language || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="panel" style={{ overflow: generatedReadme ? 'auto' : 'visible' }}>
          <div className="section-header">
            <div className="section-title">Live Preview</div>
          </div>

          {generatedReadme ? (
            <div className="preview-card" style={{ maxHeight: '90vh' }}>
              <div className="preview-header">
                <div className="preview-title-area">
                  <span className="preview-dot"></span>
                  <div className="preview-title">Markdown Preview</div>
                </div>
                <div className="preview-actions">
                  <div className="preview-toggle">
                    <button
                      type="button"
                      className={`btn btn-ghost btn-sm ${previewMode === 'rendered' ? 'btn-active' : ''}`}
                      onClick={() => setPreviewMode('rendered')}
                    >
                      👁️ Rendered
                    </button>
                    <button
                      type="button"
                      className={`btn btn-ghost btn-sm ${previewMode === 'raw' ? 'btn-active' : ''}`}
                      onClick={() => setPreviewMode('raw')}
                    >
                      📄 Raw
                    </button>
                  </div>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={copyToClipboard}>
                    {copied ? '✅ Copied' : '📋 Copy'}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={downloadReadme}>
                    ⬇️ Download
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={commitReadmeToGitHub}
                    disabled={!generatedReadme || committing}
                  >
                    {committing ? 'Committing...' : 'Commit to GitHub'}
                  </button>
                </div>
              </div>

              <div className="preview-body" style={{ maxHeight: 'calc(90vh - 96px)' }}>
                {previewMode === 'rendered' ? (
                  <div className="md-rendered">
                    <ReactMarkdown>{generatedReadme}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="md-content">{generatedReadme}</pre>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <div className="empty-title">No README generated yet</div>
              <div className="empty-desc">
                Enter a GitHub repository and click Generate to preview a curated README in real time.
              </div>
            </div>
          )}

          {(commitStatus || error) && (
            <div
              className="card card-elevated"
              style={{
                marginTop: '1rem',
                background: commitStatus ? 'rgba(16, 185, 129, 0.08)' : 'rgba(248, 113, 113, 0.08)',
                borderColor: commitStatus ? 'rgba(16, 185, 129, 0.22)' : 'rgba(248, 113, 113, 0.22)',
                color: commitStatus ? '#34d399' : '#f87171',
              }}
            >
              {commitStatus || error}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
