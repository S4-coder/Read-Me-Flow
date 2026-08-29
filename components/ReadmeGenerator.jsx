'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Header from './Header';
import Footer from './Footer';

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

function encodeGitHubPath(filePath) {
  return filePath.split('/').map(encodeURIComponent).join('/');
}

function getFileIcon(filename) {
  const extension = filename.includes('.') ? filename.slice(filename.lastIndexOf('.')) : '';
  const iconMap = {
    '.js': '📄',
    '.jsx': '⚛️',
    '.ts': '📘',
    '.tsx': '⚛️',
    '.json': '⚙️',
    '.md': '📝',
    '.css': '🎨',
    '.scss': '🎨',
    '.html': '🌐',
    '.yml': '⚙️',
    '.yaml': '⚙️',
    '.env': '🔐',
    '.lock': '🔒',
    '.gitignore': '🙈',
  };

  return iconMap[extension] || '📄';
}

function shouldIgnoreTreePath(filePath) {
  const ignoredFolders = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage'];
  const ignoredExtensions = ['.log', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.zip'];
  const parts = filePath.split('/');

  return parts.some(part => ignoredFolders.includes(part)) ||
    ignoredExtensions.some(extension => filePath.toLowerCase().endsWith(extension));
}

function createTreeNode(name) {
  return {
    name,
    type: 'dir',
    children: new Map(),
  };
}

function addTreeEntry(root, entry) {
  if (!entry.path || shouldIgnoreTreePath(entry.path)) return;

  const parts = entry.path.split('/');
  let currentNode = root;

  parts.forEach((part, index) => {
    if (!currentNode.children.has(part)) {
      currentNode.children.set(part, createTreeNode(part));
    }

    currentNode = currentNode.children.get(part);

    if (index === parts.length - 1 && entry.type === 'blob') {
      currentNode.type = 'file';
      currentNode.children.clear();
    }
  });
}

function renderProjectTree(node, prefix = '', isLast = true, depth = 0, maxDepth = Number.POSITIVE_INFINITY) {
  if (depth > maxDepth) return '';

  const connector = isLast ? '└── ' : '├── ';
  const icon = node.type === 'dir' ? '📁' : getFileIcon(node.name);
  const label = node.type === 'dir' ? `${node.name}/` : node.name;
  let tree = `${prefix}${connector}${icon} ${label}\n`;

  if (node.type === 'dir' && depth < maxDepth) {
    const children = Array.from(node.children.values()).sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    const childPrefix = prefix + (isLast ? '    ' : '│   ');

    children.forEach((child, index) => {
      tree += renderProjectTree(child, childPrefix, index === children.length - 1, depth + 1, maxDepth);
    });
  }

  return tree;
}

async function fetchGitHubProjectTree(owner, repo, branch) {
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`
  );

  if (!treeRes.ok) {
    const text = await treeRes.text();
    throw new Error(`Could not fetch project structure: ${parseGitHubError(text, treeRes.statusText)}`);
  }

  const data = await treeRes.json();
  const root = createTreeNode(repo);

  (data.tree || []).forEach(entry => addTreeEntry(root, entry));

  return renderProjectTree(root, '', true, 0);
}

function techBadges(techs) {
  if (!techs || techs.length === 0) return '';
  return techs.map(tech => '**' + tech + '**').join('<br>');
}

function starsBadge(user, repo) {
  return '';
}

function forksBadge(user, repo) {
  return '';
}

function langBadge(user, repo) {
  return '';
}

function licenseBadge(user, repo) {
  return '';
}

function topicBadges(topics) {
  if (!topics || topics.length === 0) return '';
  return topics.map(t => '**' + t + '**').join(', ');
}

function projectTypeFromTechs(techs, language) {
  const t = Array.isArray(techs) ? techs : [];
  const hasFrontend = t.some(x => ['React', 'Next.js', 'Vue', 'Angular', 'Svelte'].includes(x));
  const hasBackend = t.some(x => ['Express', 'Django', 'Node.js', 'Flask', 'Spring', 'FastAPI', 'Laravel'].includes(x));
  const hasMobile = t.some(x => ['React Native', 'Flutter', 'Swift', 'Kotlin'].includes(x));
  const hasData = t.some(x => ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy'].includes(x));
  const hasDevOps = t.some(x => ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform'].includes(x));
  
  if (hasFrontend && hasBackend) return 'fullstack';
  if (hasMobile) return 'mobile';
  if (hasData) return 'data';
  if (hasDevOps) return 'devops';
  if (hasBackend) return 'backend';
  if (hasFrontend) return 'frontend';
  if (language) {
    const l = language.toLowerCase();
    if (['python', 'jupyter notebook'].includes(l)) return 'python';
    if (['javascript', 'typescript'].includes(l)) return 'javascript';
  }
  return 'generic';
}

const readmeTemplates = [
  {
    id: 1,
    name: "🚀 Full-Stack Web App (Heavy & Detailed)",
    generate: (data) => {
      const type = projectTypeFromTechs(data.techs, data.language);
      const techs = data.techs || [];
      const topics = topicBadges(data.topics);
      const techBadgeStr = techBadges(techs);
      
      let features = '';
      if (type === 'fullstack') {
        features = `- 🔐 **Secure Authentication:** JWT-based secure auth with role-based access control.
- ⚡ **High Performance:** Optimized database queries and response caching layers.
- 📱 **Responsive Design:** Fluid layout across mobile, tablet, and desktop screens.
- 🔌 **RESTful API Architecture:** Clean, well-documented endpoints for third-party integrations.
- 🎨 **Modern UI/UX:** Polished interface with smooth transitions and accessibility best practices.
- 🧪 **Comprehensive Testing:** Unit, integration, and E2E tests with CI/CD pipeline.`;
      } else if (type === 'mobile') {
        features = `- 📱 **Cross-Platform Support:** iOS and Android from a single codebase.
- ⚡ **Optimized Performance:** Smooth animations and lazy loading for better UX.
- 🔔 **Push Notifications:** Real-time alerts and messaging integration.
- 📍 **Location Services:** GPS tracking and maps integration.
- 🔐 **Secure Storage:** Encrypted local data and secure API communication.`;
      } else if (type === 'backend') {
        features = `- 🔌 **RESTful API:** Well-structured endpoints with OpenAPI documentation.
- 🔐 **Authentication & Authorization:** JWT, OAuth2, and role-based access control.
- 📊 **Database Optimization:** Indexed queries, connection pooling, and caching.
- 🚀 **High Availability:** Load balancing and horizontal scaling support.
- 📈 **Monitoring & Logging:** Structured logs, metrics, and health checks.`;
      } else if (type === 'python') {
        features = `- 🧮 **Data Processing:** Efficient data manipulation and analysis pipelines.
- 🤖 **Automation:** Scripts and tools for repetitive task automation.
- 📦 **Package Management:** Proper packaging with setup.py/pyproject.toml.
- 🧪 **Testing:** pytest suites with coverage reporting.
- 📚 **Documentation:** Auto-generated docs with type hints and docstrings.`;
      } else {
        features = `- ⚡ **High Performance:** Optimized algorithms and efficient resource usage.
- 📦 **Modular Architecture:** Clean separation of concerns and reusable components.
- 🧪 **Well Tested:** Comprehensive test coverage with CI/CD integration.
- 📚 **Documentation:** Detailed guides, API references, and examples.
- 🤝 **Community Driven:** Open for contributions and follows best practices.`;
      }

      const techStackSection = techBadgeStr ? `<p>${techBadgeStr}</p>` : '';
      const topicsSection = topics ? `\n🏷️ **Topics:** ${topics}\n` : '';
      const structureSection = data.projectStructure ? `## 📁 Project Structure\n\n\`\`\`text\n${data.projectStructure}\n\`\`\`\n\n` : '';

      return `<h1 align="center">${data.projectName || 'Project'}</h1>
<p align="center"><b>${data.description || 'A comprehensive, production-ready project built with modern best practices and scalable architecture.'}</b></p>

---

## 📌 About The Project
${data.description || 'A comprehensive, production-ready project built with modern best practices and scalable architecture.'}

${topicsSection}

## ✨ Key Features
${features}

## 🛠️ Built With & Tech Stack
${techStackSection}

---

## ⚙️ Environment Variables Setup
Create a \`.env\` file in the root directory and add the following keys:
\`\`\`env
NODE_ENV=development
API_URL=http://localhost:3000/api
DATABASE_URL=your_database_connection_string
\`\`\`

## 🚀 Installation & Local Running
\`\`\`bash
# 1. Clone the repository
git clone ${data.repoUrl || 'https://github.com/username/repo.git'}

# 2. Navigate to project directory
cd ${data.repoName || 'repo'}

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev
\`\`\`

${structureSection}

## 🚀 Deployment
Deploy easily to **Vercel**, **Netlify**, **AWS**, or any cloud platform of your choice.

## 🤝 Contributing
Contributions are always welcome! Please read the contributing guidelines first.

## 📄 License
Distributed under the MIT License. See \`LICENSE\` for more information.

## 👤 Author
**${data.githubUser || 'username'}** - [@${data.githubUser || 'username'}](${data.repoUrl ? data.repoUrl.replace('https://github.com', 'https://github.com') : 'https://github.com'})

## 📞 Support
For support, open an issue on GitHub or reach out via email.

---
⭐ Star this repo if you found it helpful!

<div align="center">
  <sub>Generated with <a href="https://read-me-flow.vercel.app">ReadmeFlow</a></sub>
</div>`;
    }
  },
  {
    id: 2,
    name: "🏢 Professional Corporate & API Backend",
    generate: (data) => {
      const techs = data.techs || [];
      const techBadgeStr = techBadges(techs);
      
      return `<h1 align="center">${data.projectName || 'Enterprise Microservice'}</h1>
<p align="center"><b>${data.description || 'High-performance backend API service designed for secure data processing and scalable architecture.'}</b></p>

---

## 📋 System Architecture
This microservice follows a clean **N-Tier architecture** separating controllers, business logic services, and data persistence layers. Designed for scalability, maintainability, and high availability.

## 🛠️ Technology Stack
${techBadgeStr ? '<p>' + techBadgeStr + '</p>' : ''}

## 📊 Performance Metrics
- **Uptime:** 99.9% SLA
- **Response Time:** < 100ms average
- **Throughput:** 10,000+ requests/second
- **Database:** Optimized queries with connection pooling

## ⚙️ Configuration
\`\`\`ini
APP_ENV=production
DB_HOST=localhost
DB_PORT=5432
CACHE_TTL=3600
RATE_LIMIT=1000
\`\`\`

## 🚀 Quick Start
\`\`\`bash
git clone ${data.repoUrl || 'https://github.com/username/repo.git'}
cd ${data.repoName || 'repo'}
docker-compose up --build -d
\`\`\`

## 📌 API Documentation
- \`GET /health\` - System health and uptime status check
- \`POST /api/v1/data/ingest\` - Secure data ingestion endpoint
- \`GET /api/v1/reports/export\` - Generate and stream CSV/PDF reports
- \`GET /api/v1/metrics\` - Real-time system metrics and analytics

## 🧪 Testing
\`\`\`bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Load testing
npm run test:load
\`\`\`

## 📄 License
Distributed under the MIT License. See \`LICENSE\` for more information.

---
⭐ Star this repo if you found it helpful!
`;
    }
  },
  {
    id: 3,
    name: "⚡ Cyberpunk CLI & Developer Tool",
    generate: (data) => {
      const projectName = data.projectName || 'Dev-Toolkit';
      const description = data.description || 'Advanced CLI automation suite built for rapid software compilation.';
      const repoUrl = data.repoUrl || 'https://github.com/username/repo.git';
      const repoName = data.repoName || 'repo';
      const stars = starsBadge(data.githubUser, data.repoName);
      const techBadgeStr = techBadges(data.techs || []);

      return [
        '> `[SYSTEM CORE]: Initializing ' + projectName + ' repository.`',
        '> `' + description + '`',
        '',
        '---',
        '',
        '## ⚙️ Setup & Execution',
        '```bash',
        '# Clone and execute package',
        '$ git clone ' + repoUrl,
        '$ cd ' + repoName,
        '$ npm install -g .',
        '```',
        '',
        '## 📦 Dependencies & Modules',
        techBadgeStr ? '<p>' + techBadgeStr + '</p>' : '',
        '',
        '## 📂 Architecture',
        '```text',
        'src/',
        '├── bin/          # CLI executable entry point',
        '├── commands/     # Individual command modules',
        '├── utils/        # Logger, crypto, and helpers',
        '├── config.ts     # Global configuration schemas',
        '└── types/        # TypeScript type definitions',
        '```',
        '',
        '## 📊 Performance & Testing',
        '```bash',
        '# Run test suites with coverage',
        'npm test -- --coverage',
        '',
        '# Build production bundle',
        'npm run build',
        '',
        '# Benchmark performance',
        'npm run benchmark',
        '```',
        '',
        '## 🔧 Configuration',
        '```json',
        '{',
        '  "verbose": false,',
        '  "outputFormat": "json",',
        '  "parallelWorkers": 4,',
        '  "cacheEnabled": true',
        '}',
        '```',
        '',
        '## 📄 License',
        'Distributed under the MIT License. See `LICENSE` for more information.',
        '',
        stars,
        '',
        '---',
        '⭐ Star this repo if you found it helpful!'
      ].join('\n');
    }
  },
  {
    id: 4,
    name: "🌐 Open-Source Library & Package",
    generate: (data) => {
      const techs = data.techs || [];
      const techBadgeStr = techBadges(techs);
      const techStackSection = techBadgeStr ? `<p>${techBadgeStr}</p>` : '';
      
      return `# 📦 ${data.projectName || 'OpenSource Library'}

> ${data.description || 'A lightweight, high-performance package designed to simplify complex workflows and boost developer productivity.'}

---

## 📥 Installation
Install the package via your favorite package manager:
\`\`\`bash
npm install ${data.repoName || 'package-name'}
# or
yarn add ${data.repoName || 'package-name'}
# or
pnpm add ${data.repoName || 'package-name'}
\`\`\`

## 🚀 Quick Start
\`\`\`javascript
import { initializeModule } from '${data.repoName || 'package-name'}';

const app = initializeModule({
  apiKey: 'YOUR_API_KEY',
  debugMode: false
});

app.run();
\`\`\`

## ✨ Features
- 🎯 **Simple API:** Intuitive and easy-to-use interface
- ⚡ **Lightweight:** Minimal bundle size with zero dependencies
- 🔒 **Type Safe:** Full TypeScript support with comprehensive types
- 🧪 **Well Tested:** 100% test coverage with edge cases
- 📚 **Documented:** Detailed guides and API references

## 🛠️ Tech Stack
${techStackSection}

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
Distributed under the MIT License. See \`LICENSE\` for more information.

---
⭐ Star this repo if you found it helpful!
`;
    }
  },
  {
    id: 5,
    name: "📊 Portfolio & Analytics Heavy Hub",
    generate: (data) => {
      const techs = data.techs || [];
      const techBadgeStr = techBadges(techs);
      const topics = topicBadges(data.topics);
      const techStackSection = techBadgeStr ? `<p align="center">${techBadgeStr}</p>` : '';
      
      return `# 🔥 ${data.projectName || 'Developer Portfolio Hub'}

<div align="center">
  <img src="https://komarev.com/ghpvc/?username=${data.githubUser || 'username'}&color=blueviolet&style=flat-square" alt="Profile Views" />
</div>

> ${data.description || 'A centralized workspace repository showcasing tools, scripts, and production builds.'}

${topics ? `\n🏷️ **Topics:** ${topics}\n` : ''}

---

## 💻 Core Skills
${techStackSection}

## 📈 GitHub Metrics
<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${data.githubUser || 'username'}&show_icons=true&theme=radical&hide_border=true" width="48%" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${data.githubUser || 'username'}&layout=compact&theme=radical&hide_border=true" width="48%" />
</div>

---

## 📁 Featured Projects
This repository serves as a hub for various tools and scripts. Check out the individual directories for more details.

## ⚙️ Environment Setup
\`\`\`env
NODE_ENV=development
ANALYTICS_ENABLED=true
\`\`\`

## 🤝 Contribution Guidelines
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
Distributed under the MIT License. See \`LICENSE\` for more information.

---
⭐ Star this repo if you found it helpful!
`;
    }
  }
];

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
  const [templateIndex, setTemplateIndex] = useState(() => Math.floor(Math.random() * readmeTemplates.length));
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
      const branch = repoData.default_branch || 'main';
      let projectStructure = '';

      try {
        projectStructure = await fetchGitHubProjectTree(owner, repo, branch);
      } catch (err) {
        console.log(err.message);
      }

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
        homepage: repoData.homepage,
        stars: repoData.stargazers_count,
        language: repoData.language,
        topics: topics,
        techs: allTechs,
        defaultBranch: branch,
        projectStructure,
      });

      generateReadme(repoData, allTechs, topics, projectStructure);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTemplate = () => {
    setTemplateIndex((prev) => {
      const next = (prev + 1) % readmeTemplates.length;
      if (projectData) {
        const template = readmeTemplates[next];
        const data = {
          projectName: projectData.name,
          description: projectData.description,
          githubUser: projectData.owner,
          repoName: projectData.name,
          repoUrl: projectData.url,
          liveUrl: projectData.homepage || projectData.url,
          language: projectData.language,
          techs: projectData.techs,
          topics: projectData.topics,
          projectStructure: projectData.projectStructure,
        };
        const markdown = template.generate(data);
        setGeneratedReadme(markdown);
      }
      return next;
    });
  };

  const generateReadme = (repoData, techs, topics, projectStructure) => {
    const template = readmeTemplates[templateIndex];
    const data = {
      projectName: repoData.name,
      description: repoData.description || 'A comprehensive open-source project built for modern development.',
      githubUser: repoData.owner.login,
      repoName: repoData.name,
      repoUrl: repoData.html_url,
      liveUrl: repoData.homepage,
      language: repoData.language,
      techs,
      topics,
      projectStructure,
    };

    const markdown = template.generate(data);
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

  const commitReadmeToGitHub = async () => {
    if (!generatedReadme) {
      setError('Generate a README before opening GitHub.');
      return;
    }

    const repo = normalizeRepoInput(searchQuery);
    if (!repo.owner || !repo.repo) {
      setError('Enter a GitHub repository first.');
      return;
    }

    const branch = projectData?.defaultBranch || 'main';
    const filePath = 'README.md';
    const githubUrl = `https://github.com/${repo.owner}/${repo.repo}/edit/${encodeURIComponent(branch)}/${encodeGitHubPath(filePath)}?value=${encodeURIComponent(generatedReadme)}`;

    setCommitting(true);
    setCommitStatus('');
    setError('');

    const githubWindow = window.open(githubUrl, '_blank', 'noopener,noreferrer');

    try {
      await navigator.clipboard.writeText(generatedReadme);
      setCommitStatus('GitHub commit page opened with README content prefilled. Click Commit changes on GitHub.');
    } catch (err) {
      setCommitStatus('GitHub commit page opened. Content is prefilled; if needed, copy from preview and paste it on GitHub.');
    } finally {
      setCommitting(false);
    }

    if (!githubWindow) {
      setCommitStatus('GitHub commit page could not open automatically. Allow popups and click the button again.');
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
            <span className="intro-pill">Download .md</span>
            <span className="intro-pill">GitHub commit</span>
            <span className="intro-pill">Banners</span>
            <span className="intro-pill">Badges</span>
            <span className="intro-pill">GitHub Stats</span>
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
                  <button type="button" className="btn btn-ghost btn-sm" onClick={switchTemplate}>
                    🔄 Template ({templateIndex + 1}/{readmeTemplates.length})
                  </button>
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
                    {committing ? 'Opening...' : 'Commit on GitHub'}
                  </button>
                </div>
              </div>

              <div className="preview-body" style={{ maxHeight: 'calc(90vh - 96px)' }}>
                {previewMode === 'rendered' ? (
                  <div className="md-rendered">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{generatedReadme}</ReactMarkdown>
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
