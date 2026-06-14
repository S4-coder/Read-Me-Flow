# 📝 README Generator Tool

A professional markdown builder that helps developers create stunning README.md files with badges, tech stack icons, and file tree structures for open-source projects.

## 🎯 Features

### ✨ Core Features
- **Automatic Tech Stack Detection** - Scans `package.json` to detect your project's technologies
- **Professional Badges** - License, version, and status badges with shield.io integration
- **File Tree Generation** - Auto-generates your project's directory structure
- **Smart Icon System** - Different icons for different file types
- **Interactive UI** - Beautiful web interface built with Next.js and Tailwind CSS
- **CLI Tool** - Command-line interface for scripting and automation
- **One-Click Export** - Download as markdown or copy to clipboard

## 🚀 Getting Started

### Installation

```bash
# Clone or navigate to the project
cd readmeflow

# Install dependencies
npm install
```

### Usage

#### Method 1: Web Interface (Recommended)

```bash
npm run dev
```

Then open http://localhost:3000 in your browser to access the interactive README generator with live preview.

#### Method 2: CLI Tool

```bash
npm run generate-readme
```

This will prompt you with interactive questions:
- Project Name
- Description
- Author Name
- License
- Version
- Status (stable/beta/alpha)
- Include File Tree? (yes/no)
- Include Tech Stack Detection? (yes/no)
- Output Path

## 📚 How to Use

### Web Interface

1. **Fill in Project Details**
   - Project Name (required)
   - Description (required)
   - Author Name
   - License (default: MIT)
   - Version (default: 1.0.0)
   - Status (stable/beta/alpha)

2. **Select Tech Stack**
   - Check the technologies your project uses
   - Includes: JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, PostgreSQL, Python, Django, etc.

3. **Configure Options**
   - Include Badges ✓
   - Include File Tree ✓

4. **Generate**
   - Click "Generate README"
   - Preview appears on the right side

5. **Export**
   - Copy to Clipboard
   - Download as README.md file

### CLI Tool

```bash
npm run generate-readme

# Follow interactive prompts
# Example:
# 🏷️  Project Name (default: readmeflow): my-awesome-project
# 📝 Project Description: A tool for generating professional README files
# 👤 Author Name: John Doe
# 📄 License (default: MIT): MIT
# 🔢 Version (default: 1.0.0): 1.0.0
# ⚡ Status (stable/beta/alpha, default: stable): stable
# 📁 Include File Tree? (yes/no, default: yes): yes
# 🛠️  Include Tech Stack Detection? (yes/no, default: yes): yes
# 💾 Output path (default: ./README.md): ./README.md

# Generated file: ./README.md
```

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4, Next.js 16.2.7
- **Styling**: Tailwind CSS 4
- **Backend**: Node.js
- **Tools**: ESLint, PostCSS

## 📁 Project Structure

```
readmeflow/
├── app/
│   ├── api/
│   │   └── generate-readme/
│   │       └── route.js          # API endpoint for README generation
│   ├── components/
│   │   └── ReadmeGenerator.jsx   # Interactive UI component
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   └── page.js                   # Home page
├── bin/
│   └── readme-generator.js       # CLI tool entry point
├── lib/
│   └── readmeGenerator.js        # Core generation logic
├── public/                       # Static assets
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.mjs
└── README.md
```

## 🎨 Supported Tech Stack

The generator automatically detects and includes badges for:

- **Languages**: JavaScript, TypeScript, Python
- **Frontend**: React, Next.js, HTML, CSS, Tailwind CSS
- **Backend**: Node.js, Express, Django
- **Databases**: MongoDB, PostgreSQL
- **DevOps**: Docker, Git, GitHub
- **Package Managers**: npm, yarn
- And more...

## 📖 Generated README Includes

- 🎯 Professional title with emoji
- 📝 Project description
- 🏷️ License, version, and status badges
- 🛠️ Tech stack with icons
- ✨ Features section template
- 📦 Installation instructions
- 🚀 Usage examples (dev, build, production)
- 📁 Project file structure (optional)
- 🤝 Contributing guidelines
- 📄 License information
- 👤 Author information
- 💖 Footer with attribution

## 🔧 API Reference

### POST `/api/generate-readme`

Generate README content via API.

**Request Body:**
```json
{
  "projectName": "My Project",
  "description": "Project description",
  "author": "Your Name",
  "license": "MIT",
  "version": "1.0.0",
  "status": "stable",
  "includeFileTree": true,
  "includeTechStack": true,
  "selectedTechs": ["React", "Node.js"]
}
```

**Response:**
```json
{
  "success": true,
  "content": "# 🚀 My Project\n...",
  "timestamp": "2024-06-07T12:00:00.000Z"
}
```

### GET `/api/generate-readme`

Get auto-detected project information.

**Response:**
```json
{
  "success": true,
  "detectedTechs": ["next", "react", "npm"],
  "fileTree": "readmeflow/\n├── app/\n..."
}
```

## 🌟 Examples

### Example 1: Web Interface

1. Open http://localhost:3000
2. Fill in:
   - Name: "My React App"
   - Description: "A simple React application"
   - Author: "Jane Doe"
3. Select: React, Tailwind CSS, Node.js
4. Click "Generate README"
5. Click "Download" to save

### Example 2: CLI Tool

```bash
npm run generate-readme

# Interactive prompts:
# Project Name: my-django-api
# Description: REST API built with Django
# Author: John Smith
# License: Apache-2.0
# ...
# File saved to: ./README.md
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add NewFeature'`)
5. Push to your branch (`git push origin feature/NewFeature`)
6. Submit a Pull Request

## 📋 Features Coming Soon

- [ ] Template library (minimal, detailed, academic)
- [ ] Custom section support
- [ ] Screenshot/GIF embedding
- [ ] API documentation auto-generation
- [ ] Changelog auto-generation
- [ ] Interactive config file (.readmegen.json)
- [ ] Multi-language support
- [ ] Dark mode for generated READMEs

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**Sabeel Ahmed**
- GitHub: [@S4-code](https://github.com/S4-code)
- Email: sabeel2311@gmail.com

## 🙏 Acknowledgments

- Inspired by professional README standards
- Built with Next.js and Tailwind CSS
- Icons from shields.io

---

Made with ❤️ for Open Source Developers
