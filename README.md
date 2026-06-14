# 🚀 ReadmeFlow - Professional Documentation Generator

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-2.0.0-green.svg)
![Status](https://img.shields.io/badge/Status-stable-green.svg)

## About


<!-- Add a screenshot or GIF of your application here -->

> **ReadmeFlow** is a powerful Next.js application that automatically generates professional, feature-rich README.md files for GitHub repositories. Simply enter any GitHub repository URL and get a beautifully formatted README with tech stack badges, installation steps, project structure, API documentation, testing guidelines, deployment instructions, roadmap, FAQ, and more!

## Features

- 🔍 **GitHub Integration** - Fetch repository details directly from GitHub API (v3)
- 🛠️ **Advanced Tech Stack Detection** - Automatically detects 20+ technologies with icon badges
- 📁 **File Structure Visualization** - Generates a beautiful file tree with 40+ file-type icons
- 📋 **One-Click Copy** - Copy generated README to clipboard instantly
- ⬇️ **Download Support** - Download README.md file directly with proper naming
- 🎨 **Live Preview** - Real-time markdown preview in rendered and raw modes
- 🌙 **Modern UI** - Clean, responsive interface with Tailwind CSS and custom design system
- ⚡ **CLI Tool** - Command-line interface for offline README generation
- 🔌 **API Endpoint** - REST API for programmatic README generation
- 🧪 **Testing Ready** - Built-in test section with coverage tables
- 🚀 **Deployment Guides** - Instructions for Vercel, Netlify, and more
- 🗺️ **Roadmap Tracking** - Built-in project milestone checklist
- ❓ **FAQ Support** - Collapsible FAQ sections for documentation

## Installation

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** (for cloning repositories)

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/readmeflow.git
cd readmeflow

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Manual Installation

```bash
# Using npm
npm install readmeflow

# Using yarn
yarn add readmeflow
```

## Usage

### Web Application

1. Run `npm run dev` and open `http://localhost:3000`
2. Paste a GitHub repository URL (e.g., `facebook/react`)
3. Click **Generate README**
4. Choose between **Rendered** or **Raw** preview
5. Click **Copy** to clipboard or **Download** to save the file

### CLI Tool

```bash
# Run the interactive CLI generator
node bin/readme-generator.js

# Or use npm script
npm run generate:cli
```

### API Endpoint

```bash
# POST request to generate README
curl -X POST http://localhost:3000/api/generate-readme \
  -H "Content-Type: application/json" \
  -d '{"owner":"facebook","repo":"react"}'
```

### Programmatic Usage

```javascript
const { generateReadme, generateFileTree } = require('./lib/readmeGenerator');

const config = {
  projectName: 'My Awesome Project',
  description: 'A comprehensive web application',
  author: 'John Doe',
  license: 'MIT',
  version: '1.0.0',
  status: 'stable',
  includeFileTree: true,
  includeTechStack: true,
  projectPath: '/path/to/project',
};

const readme = generateReadme(config);
console.log(readme);
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate-readme` | Generate README from GitHub repo |
| `GET` | `/health` | Health check endpoint |

### Request Example

```javascript
POST /api/generate-readme
Content-Type: application/json

{
  "owner": "facebook",
  "repo": "react"
}
```

### Response Example

```json
{
  "readme": "# 🚀 react\n\n...",
  "meta": {
    "generatedAt": "2024-01-15T10:30:00Z",
    "size": "4.5 KB"
  }
}
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

| Component | Coverage |
|-----------|----------|
| Components | 95% |
| Utilities | 90% |
| API Routes | 88% |

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [README FLOW](https://read-me-flow.vercel.app/)
3. Import your repository
4. Click **Deploy**

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=.next
```

### Deploy with Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=production
PORT=3000
```

## Roadmap

### Phase 1 - Core Features ✅

- [x] GitHub repository lookup and parsing
- [x] Auto tech stack detection from package.json
- [x] Professional README generation with badges
- [x] File tree visualization with icons
- [x] Web UI with live preview
- [x] CLI tool for offline generation
- [x] API endpoint for programmatic access

### Phase 2 - Enhanced Features 🚧

- [ ] Support for multiple repository formats (GitLab, Bitbucket)
- [ ] Custom theme templates for READMEs
- [ ] Export to different formats (HTML, PDF)
- [ ] Batch README generation for multiple repos
- [ ] Real-time collaboration features

### Phase 3 - Advanced Features 🔮

- [ ] AI-powered content suggestions
- [ ] Multi-language support (i18n)
- [ ] Integration with CI/CD pipelines
- [ ] Analytics dashboard for README performance
- [ ] Plugin system for custom generators

## Frequently Asked Questions

<details>
<summary><strong>How does ReadmeFlow detect the tech stack?</strong></summary>

ReadmeFlow analyzes the `package.json` file to detect dependencies and automatically maps them to their corresponding tech stack badges using keyword matching.

</details>

<details>
<summary><strong>Can I customize the generated README?</strong></summary>

Yes! After generating the README, you can edit any section directly in the web interface, or copy the markdown and modify it in your preferred editor.

</details>

<details>
<summary><strong>Is my GitHub data secure?</strong></summary>

Absolutely. ReadmeFlow only accesses public repository data through the GitHub API. No sensitive data is stored or transmitted.

</details>

<details>
<summary><strong>What repository formats are supported?</strong></summary>

Currently, ReadmeFlow supports GitHub repositories in the following formats:
- `owner/repo`
- `https://github.com/owner/repo`
- `https://github.com/owner/repo.git`

Support for GitLab and Bitbucket is planned for future releases.

</details>

<details>
<summary><strong>How do I contribute to ReadmeFlow?</strong></summary>

We welcome contributions! Please check the Contributing section below for guidelines on how to submit pull requests and report issues.

</details>

<details>
<summary><strong>Can I use ReadmeFlow for private repositories?</strong></summary>

Currently ReadmeFlow only supports public repositories. Private repository support may be added in future versions.

</details>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📁 Project Structure

\`\`\`
readmeflow/
├── 📁 app/
│   ├── 📁 api/
│   │   └── 📁 generate-readme/
│   │       └── ⚛️ route.js
│   ├── 📁 components/
│   │   ├── ⚛️ Footer.jsx
│   │   ├── ⚛️ Header.jsx
│   │   └── ⚛️ ReadmeGenerator.jsx
│   ├── 📁 features/
│   │   └── 📄 page.js
│   ├── 📁 privacy/
│   │   └── 📄 page.js
│   ├── 🎨 globals.css
│   ├── ⚛️ layout.js
│   └── ⚛️ page.js
├── 📁 bin/
│   └── 🖥️ readme-generator.js
├── 📁 lib/
│   ├── ⚙️ readmeGenerator.js
│   └── 📁 __tests__/
├── ⚙️ package.json
├── ⚙️ tailwind.config.js
├── ⚙️ next.config.mjs
├── 📄 README.md
└── 📄 .env.example
\`\`\`

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 ReadmeFlow

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## Author

**Your Name**
- GitHub: [@S4-coder](https://github.com/S4-coder)
- Email: sabeel2311@gmail.com

## Support

For support, email sabeel2311@gmail.com or open an issue on GitHub.

---

<p align="center">
  <b>Made with ❤️ by Sabeel Ahmed</b>
</p>

<p align="center">
  <a href="https://github.com/S4-coder/Read-Me-Flow">
    <img src="https://img.shields.io/github/stars/S4-coder/Read-Me-Flow?style=social" alt="GitHub Stars">
  </a>
  <a href="https://github.com/S4-coder/Read-Me-Flow/fork">
    <img src="https://img.shields.io/github/forks/S4-coder/Read-Me-Flow?style=social" alt="GitHub Forks">
  </a>
</p>
