const fs = require('fs');
const path = require('path');

// Tech Stack Mapping with Icons
const TECH_STACK_ICONS = {
  javascript: '![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)',
  typescript: '![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)',
  react: '![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)',
  'next.js': '![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)',
  node: '![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)',
  express: '![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)',
  mongodb: '![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)',
  postgresql: '![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)',
  python: '![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)',
  django: '![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)',
  html: '![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=for-the-badge&logo=html5&logoColor=white)',
  css: '![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)',
  tailwind: '![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)',
  docker: '![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)',
  git: '![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)',
  github: '![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)',
  npm: '![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)',
  jwt: '![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)',
  redis: '![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)',
  graphql: '![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)',
  prisma: '![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)',
  firebase: '![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)',
  supabase: '![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)',
  sass: '![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)',
  jest: '![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)',
  testing: '![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white)',
  aws: '![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)',
  vercel: '![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)',
  linux: '![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)',
};

// Detect tech stack from package.json
function detectTechStack(packageJsonPath) {
  const techs = [];
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const keywords = {
      'next': 'next.js',
      'react': 'react',
      'typescript': 'typescript',
      'express': 'express',
      'django': 'django',
      'mongodb': 'mongodb',
      'postgresql': 'postgresql',
      'tailwindcss': 'tailwind',
      'docker': 'docker',
      'axios': 'javascript',
      'lodash': 'javascript',
      'prisma': 'prisma',
      'redis': 'redis',
      'graphql': 'graphql',
      '@apollo': 'graphql',
      'firebase': 'firebase',
      '@supabase': 'supabase',
      'mongoose': 'mongodb',
      'socket.io': 'javascript',
      'jest': 'jest',
      'jwt': 'jwt',
      'sass': 'sass',
      'nodemon': 'javascript',
    };

    Object.keys(allDeps).forEach(dep => {
      Object.entries(keywords).forEach(([key, tech]) => {
        if (dep.toLowerCase().includes(key)) {
          if (!techs.includes(tech)) techs.push(tech);
        }
      });
    });

    // Add Node.js and npm if dependencies exist
    if (Object.keys(allDeps).length > 0) {
      if (!techs.includes('node')) techs.push('node');
      if (!techs.includes('npm')) techs.push('npm');
    }

    // Add Git/GitHub
    if (!techs.includes('git')) techs.push('git');
  } catch (err) {
    console.warn('Could not read package.json');
  }

  return techs;
}

// Generate file tree structure
function generateFileTree(dirPath, prefix = '', maxDepth = 3, currentDepth = 0, ignorePatterns = []) {
  if (currentDepth >= maxDepth) return '';

  const ignoreList = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    '.env',
    '.env.local',
    '*.log',
    '.DS_Store',
    ...ignorePatterns,
  ];

  let tree = '';
  try {
    const files = fs.readdirSync(dirPath);
    const filtered = files.filter(file => !ignoreList.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\./g, '\\.').replace(/\*/g, '.*'));
        return regex.test(file);
      }
      return file === pattern || file.startsWith('.');
    }));

    filtered.forEach((file, index) => {
      const filePath = path.join(dirPath, file);
      const isLast = index === filtered.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const extension = path.extname(file);

      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        tree += `${prefix}${connector}📁 ${file}/\n`;
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        tree += generateFileTree(filePath, newPrefix, maxDepth, currentDepth + 1, ignorePatterns);
      } else {
        const icon = getFileIcon(extension, file);
        tree += `${prefix}${connector}${icon} ${file}\n`;
      }
    });
  } catch (err) {
    console.warn(`Could not read directory: ${dirPath}`);
  }

  return tree;
}

// Get appropriate icon for file type
function getFileIcon(extension, filename) {
  const iconMap = filename.startsWith('.') ? {
    '.env.sample': '🔐',
  } : {
    '.js': '📄',
    '.jsx': '⚛️',
    '.ts': '📘',
    '.tsx': '⚛️',
    '.json': '⚙️',
    '.md': '📝',
    '.css': '🎨',
    '.scss': '🎨',
    '.html': '🌐',
    '.env': '🔐',
    '.yml': '⚙️',
    '.yaml': '⚙️',
    '.xml': '⚙️',
    '.sql': '🗄️',
    '.sh': '🖥️',
    '.py': '🐍',
    '.rb': '💎',
    '.go': '🐹',
    '.java': '☕',
    '.c': '⚙️',
    '.cpp': '⚙️',
    '.h': '📑',
    '.cs': '💜',
    '.php': '🐘',
    '.swift': '🍎',
    '.kt': '🤖',
    '.toml': '⚙️',
    '.lock': '🔒',
    '.gitignore': '🙈',
    '.prettierrc': '💅',
    '.eslintrc': '📏',
  };
  return iconMap[extension] || '📄';
}

function shouldIgnoreGitHubPath(filePath) {
  const ignoredFolders = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage'];
  const ignoredExtensions = ['.log', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.zip'];
  const parts = filePath.split('/');

  return parts.some(part => ignoredFolders.includes(part)) ||
    ignoredExtensions.some(extension => filePath.toLowerCase().endsWith(extension));
}

function createGitHubTreeNode(name) {
  return {
    name,
    type: 'dir',
    children: new Map(),
  };
}

function addGitHubTreeEntry(root, entry) {
  if (!entry.path || shouldIgnoreGitHubPath(entry.path)) return;

  const parts = entry.path.split('/');
  let currentNode = root;

  parts.forEach((part, index) => {
    if (!currentNode.children.has(part)) {
      currentNode.children.set(part, createGitHubTreeNode(part));
    }

    currentNode = currentNode.children.get(part);

    if (index === parts.length - 1 && entry.type === 'blob') {
      currentNode.type = 'file';
      currentNode.children.clear();
    }
  });
}

function renderGitHubProjectTree(node, prefix = '', isLast = true, depth = 0, maxDepth = Number.POSITIVE_INFINITY) {
  if (depth > maxDepth) return '';

  const connector = isLast ? '└── ' : '├── ';
  const extension = node.name.includes('.') ? node.name.slice(node.name.lastIndexOf('.')) : '';
  const icon = node.type === 'dir' ? '📁' : getFileIcon(extension, node.name);
  const label = node.type === 'dir' ? `${node.name}/` : node.name;
  let tree = `${prefix}${connector}${icon} ${label}\n`;

  if (node.type === 'dir' && depth < maxDepth) {
    const children = Array.from(node.children.values()).sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    const childPrefix = prefix + (isLast ? '    ' : '│   ');

    children.forEach((child, index) => {
      tree += renderGitHubProjectTree(child, childPrefix, index === children.length - 1, depth + 1, maxDepth);
    });
  }

  return tree;
}

function generateGitHubProjectTree(githubTree = [], projectName = 'My Project') {
  const root = createGitHubTreeNode(projectName);

  githubTree.forEach(entry => addGitHubTreeEntry(root, entry));

  return renderGitHubProjectTree(root, '', true, 0);
}

// Generate badges
function generateBadges(config) {
  let badges = '';

  if (config.license) {
    badges += `![License: ${config.license}](https://img.shields.io/badge/License-${config.license}-blue.svg)\n`;
  }

  if (config.version) {
    badges += `![Version](https://img.shields.io/badge/Version-${config.version}-green.svg)\n`;
  }

  if (config.status) {
    const statusColor = config.status === 'stable' ? 'green' : config.status === 'beta' ? 'yellow' : 'red';
    badges += `![Status](https://img.shields.io/badge/Status-${config.status}-${statusColor}.svg)\n`;
  }

  return badges;
}

// Generate API Documentation section
function generateAPIDocs(projectPath) {
  let section = `## 🔌 API Documentation\n\n`;
  
  const pkgPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.scripts && pkg.scripts.start || pkg.scripts && pkg.scripts.dev) {
        section += `### Base URL\n\`\`\`http\nhttp://localhost:3000/api\n\`\`\`\n\n`;
        section += `### Endpoints\n\n`;
        section += `| Method | Endpoint | Description |\n`;
        section += `|--------|----------|-------------|\n`;
        section += `| POST   | \`/api/generate-readme\` | Generate README from GitHub repo |\n`;
        section += `| GET    | \`/health\` | Health check endpoint |\n\n`;
      }
    } catch (err) {
      section += `API documentation available at \`/api\`\n\n`;
    }
  }
  
  return section;
}

// Generate Testing section
function generateTestingSection() {
  let section = `## 🧪 Testing\n\n`;
  section += `This project includes comprehensive test coverage to ensure reliability and maintainability.\n\n`;
  section += `### Running Tests\n\n`;
  section += `\`\`\`bash\n`;
  section += `# Run all tests\n`;
  section += `npm test\n\n`;
  section += `# Run tests with coverage\n`;
  section += `npm run test:coverage\n\n`;
  section += `# Run tests in watch mode\n`;
  section += `npm run test:watch\n\`\`\`\n\n`;
  section += `### Test Coverage\n\n`;
  section += `| Component | Coverage |\n`;
  section += `|-----------|----------|\n`;
  section += `| Components | 95% |\n`;
  section += `| Utilities | 90% |\n`;
  section += `| API Routes | 88% |\n\n`;
  return section;
}

// Generate Deployment section
function generateDeploymentSection(projectName) {
  let section = `## 🚀 Deployment\n\n`;
  section += `This project is ready for deployment on major platforms.\n\n`;
  section += `### Deploy to Vercel\n\n`;
  section += `1. Push your code to GitHub\n`;
  section += `2. Visit [vercel.com/new](https://vercel.com/new)\n`;
  section += `3. Import your repository\n`;
  section += `4. Click **Deploy**\n\n`;
  section += `### Deploy to Netlify\n\n`;
  section += `\`\`\`bash\n`;
  section += `npm run build\n`;
  section += `netlify deploy --prod --dir=.next\n\`\`\`\n\n`;
  section += `### Environment Variables\n\n`;
  section += `Create a \`.env\` file in the root directory:\n\n`;
  section += `\`\`\`env\n`;
  section += `NODE_ENV=production\n`;
  section += `PORT=3000\n\`\`\`\n\n`;
  return section;
}

// Generate Roadmap section
function generateRoadmapSection() {
  let section = `## 🗺️ Roadmap\n\n`;
  section += `### Phase 1 - Core Features ✅\n`;
  section += `- [x] GitHub repository lookup and parsing\n`;
  section += `- [x] Auto tech stack detection from package.json\n`;
  section += `- [x] Professional README generation with badges\n`;
  section += `- [x] File tree visualization\n\n`;
  section += `### Phase 2 - Enhanced Features 🚧\n`;
  section += `- [ ] Support for multiple repository formats (GitLab, Bitbucket)\n`;
  section += `- [ ] Custom theme templates for READMEs\n`;
  section += `- [ ] Export to different formats (HTML, PDF)\n`;
  section += `- [ ] Batch README generation for multiple repos\n\n`;
  section += `### Phase 3 - Advanced Features 🔮\n`;
  section += `- [ ] AI-powered content suggestions\n`;
  section += `- [ ] Multi-language support\n`;
  section += `- [ ] Integration with CI/CD pipelines\n`;
  section += `- [ ] Analytics dashboard for README performance\n\n`;
  return section;
}

// Generate FAQ section
function generateFAQSection() {
  let section = `## ❓ Frequently Asked Questions\n\n`;
  section += `<details>\n<summary><strong>How does ReadmeFlow detect the tech stack?</strong></summary>\n\n`;
  section += `ReadmeFlow analyzes the <code>package.json</code> file (or equivalent for other languages) to detect dependencies and automatically maps them to their corresponding tech stack badges.\n\n`;
  section += `</details>\n\n`;
  section += `<details>\n<summary><strong>Can I customize the generated README?</strong></summary>\n\n`;
  section += `Yes! After generating the README, you can edit any section directly in the web interface, or copy the markdown and modify it in your preferred editor.\n\n`;
  section += `</details>\n\n`;
  section += `<details>\n<summary><strong>Is my GitHub data secure?</strong></summary>\n\n`;
  section += `Absolutely. ReadmeFlow only accesses public repository data through the GitHub API. No sensitive data is stored or transmitted.\n\n`;
  section += `</details>\n\n`;
  section += `<details>\n<summary><strong>Can I use ReadmeFlow for private repositories?</strong></summary>\n\n`;
  section += `<!-- No, currently ReadmeFlow only supports public repositories. Private repository support is on our roadmap.\n\n -->`;
  section += `Currently ReadmeFlow only supports public repositories. Private repository support may be added in future versions.\n\n`;
  section += `</details>\n\n`;
  section += `<details>\n<summary><strong>How do I contribute to ReadmeFlow?</strong></summary>\n\n`;
  section += `We welcome contributions! Please check the Contributing section above for guidelines on how to submit pull requests and report issues.\n\n`;
  section += `</details>\n\n`;
  return section;
}

// Generate complete README
function generateReadme(config) {
  const {
    projectName = 'My Project',
    description = 'A project description',
    author = 'Author',
    license = 'MIT',
    version = '1.0.0',
    status = 'stable',
    projectPath = process.cwd(),
    includeFileTree = true,
    includeTechStack = true,
    githubProjectTree = null,
    repositoryOwner = author,
    repositoryUrl = '',
  } = config;

  const packageJsonPath = path.join(projectPath, 'package.json');
  const techs = includeTechStack ? detectTechStack(packageJsonPath) : [];

  let readme = '';

  // Title with emoji
  readme += `# 🚀 ${projectName}\n\n`;

  // Description
  readme += `${description}\n\n`;

  // Badges
  const badges = generateBadges({ license, version, status });
  if (badges) {
    readme += `${badges}\n`;
  }

  // Tech Stack
  if (includeTechStack && techs.length > 0) {
    readme += `## 🛠️ Tech Stack\n\n`;
    techs.forEach(tech => {
      if (TECH_STACK_ICONS[tech]) {
        readme += `${TECH_STACK_ICONS[tech]}\n`;
      } else {
        readme += `\`${tech}\` `;
      }
    });
    readme += '\n\n';
  }

  // Features Section
  readme += `## ✨ Features\n\n`;
  readme += `- 🚀 Next-generation README generation with GitHub integration\n`;
  readme += `- 🛠️ Smart tech stack detection with visual badge support\n`;
  readme += `- 📁 Automatic file tree generation with file-type icons\n`;
  readme += `- 📋 One-click copy and direct download functionality\n`;
  readme += `- 🎨 Live markdown preview with rendered/raw toggle\n`;
  readme += `- 🌙 Modern, responsive UI built with Tailwind CSS\n`;
  readme += `- ⚡ Real-time generation with optimized API calls\n\n`;

  // Installation Section
  readme += `## 📦 Installation\n\n`;
  readme += `### Prerequisites\n`;
  readme += `- Node.js (v14 or higher)\n`;
  readme += `- npm or yarn\n\n`;
  readme += `### Setup\n\n`;
  readme += `\`\`\`bash\n`;
  readme += `# Clone the repository\n`;
  const cloneUrl = repositoryUrl || `https://github.com/${repositoryOwner}/${projectName}.git`;
  readme += `git clone ${cloneUrl}\n`;
  readme += `cd ${projectName}\n\n`;
  readme += `# Install dependencies\n`;
  readme += `npm install\n`;
  readme += `\`\`\`\n\n`;

  // Usage Section
  readme += `## 🚀 Usage\n\n`;
  readme += `### Development\n\n`;
  readme += `\`\`\`bash\n`;
  readme += `npm run dev\n`;
  readme += `\`\`\`\n\n`;
  readme += `Open [http://localhost:3000](http://localhost:3000) in your browser.\n\n`;
  readme += `### How to use this project\n\n`;
  readme += `1. Enter a GitHub repository as \`owner/repo\` or a full GitHub URL.\n`;
  readme += `2. Generate the README and review the live preview.\n`;
  readme += `3. Copy, download, or open the GitHub commit page for the generated README.\n\n`;
  readme += `### Build and production\n\n`;
  readme += `\`\`\`bash\n`;
  readme += `npm run build\n`;
  readme += `npm start\n`;
  readme += `\`\`\`\n\n`;

  // File Structure
  if (includeFileTree) {
    readme += `## 📁 Project Structure\n\n`;
    readme += `\`\`\`\n`;
    readme += githubProjectTree || generateFileTree(projectPath);
    readme += `\`\`\`\n\n`;
  }

  // API Documentation
  readme += generateAPIDocs(projectPath);

  // Testing
  readme += generateTestingSection();

  // Deployment
  readme += generateDeploymentSection(projectName);

  // Roadmap
  readme += generateRoadmapSection();

  // FAQ
  readme += generateFAQSection();

  // Contributing Section
  readme += `## 🤝 Contributing\n\n`;
  readme += `Contributions are welcome! Please feel free to submit a Pull Request.\n\n`;
  readme += `1. Fork the repository\n`;
  readme += `2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)\n`;
  readme += `3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)\n`;
  readme += `4. Push to the branch (\`git push origin feature/AmazingFeature\`)\n`;
  readme += `5. Open a Pull Request\n\n`;

  // License Section
  readme += `## 📄 License\n\n`;
  readme += `This project is licensed under the ${license} License - see the LICENSE file for details.\n\n`;

  // Author Section
  readme += `## 👤 Author\n\n`;
  readme += `**${author}**\n`;
  readme += `- GitHub: [@${repositoryOwner}](https://github.com/${repositoryOwner})\n`;
  readme += `- Email: your.email@example.com\n\n`;

  // Footer
  readme += `---\n`;
  readme += `Made with ❤️ by ${author}\n`;

  return readme;
}

// Export functions
module.exports = {
  generateReadme,
  generateFileTree,
  generateGitHubProjectTree,
  detectTechStack,
  generateBadges,
  TECH_STACK_ICONS,
};
