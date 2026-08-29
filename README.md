# 🚀 ReadmeFlow - Professional Documentation Generator

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## About

> **ReadmeFlow** is a powerful Next.js application that automatically generates professional, feature-rich README.md files for GitHub repositories. Simply enter any GitHub repository URL and get a beautifully formatted README with tech stack badges, installation steps, project structure, API documentation, testing guidelines, deployment instructions, roadmap, FAQ, and more!

## ✨ Features

- 🔍 **GitHub Integration** - Fetch repository details directly from GitHub API (v3)
- 🛠️ **Advanced Tech Stack Detection** - Automatically detects 20+ technologies with icon badges
- 📁 **File Structure Visualization** - Generates a beautiful file tree with 40+ file-type icons
- 📋 **One-Click Copy** - Copy generated README to clipboard instantly
- ⬇️ **Download Support** - Download README.md file directly with proper naming
- 🎨 **Live Preview** - Real-time markdown preview in rendered and raw modes
- 🌙 **Modern UI** - Clean, responsive interface with Tailwind CSS and custom design system
- 🔄 **Multiple Templates** - 5 professional README templates with random selection on refresh
- 🎨 **Badges & Icons Generator** - Interactive tool to create custom badges and icons for READMEs
- 🖼️ **Custom Banner Generator** - Design SVG/PNG header banners with gradients, fonts, and animations
- 📊 **GitHub Stats & Trophies** - Generate GitHub stats cards, top languages, streak stats, and visitor badges
- 🔍 **Navbar Search** - Quick search bar to navigate between pages
- 🌓 **Theme Toggle** - Switch between dark and light modes
- 🚀 **Deployment Guides** - Instructions for Vercel, Netlify, and more
- 🗺️ **Roadmap Tracking** - Built-in project milestone checklist
- ❓ **FAQ Support** - Collapsible FAQ sections for documentation

## 🎨 Badges & Icons Generator

Interactive tool to create and customize README badges:
- Choose from multiple tech stacks, frameworks, and databases
- Preview badges in real-time
- Copy markdown instantly
- Supports custom colors and styles

## 🖼️ Custom Banner Generator

Design stunning header banners for your README:
- 8 gradient presets + custom gradient picker
- 8 font families with Google Fonts integration
- Title and subtitle customization
- Text color and alignment controls
- SVG/PNG download options
- Animated gradient effects
- Live preview with instant updates

## 📊 GitHub Stats & Trophies Integration

Generate GitHub profile widgets and stats:
- 📈 **Stats Card** - Commits, PRs, issues, stars overview
- 🏆 **Profile Trophies** - Achievement badges showcase
- 💻 **Top Languages** - Most used languages across repositories
- 🔥 **Streak Stats** - Current and longest contribution streaks
- 👁️ **Visitor Count** - Profile view counter badge

## 📁 Project Structure

```
readmeflow/
├── 📁 app/
│   ├── 📁 api/
│   │   └── 📁 generate-readme/
│   │       └── ⚛️ route.js
│   ├── 📁 badges/
│   │   └── 📄 page.jsx
│   ├── 📁 banner/
│   │   └── 📄 page.jsx
│   ├── 📁 github-stats/
│   │   └── 📄 page.jsx
│   ├── 📁 features/
│   │   └── 📄 page.jsx
│   ├── 📁 privacy/
│   │   └── 📄 page.jsx
│   ├── 🎨 globals.css
│   ├── ⚛️ layout.js
│   └── ⚛️ page.js
├── 📁 components/
│   ├── ⚛️ Header.jsx
│   ├── ⚛️ Footer.jsx
│   ├── ⚛️ ReadmeGenerator.jsx
│   └── ⚛️ GitHubWidgetsModal.jsx
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
```

## Installation

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** (for cloning repositories)

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/S4-coder/Read-Me-Flow.git
cd Read-Me-Flow

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Web Application

1. Run `npm run dev` and open `http://localhost:3000`
2. Enter a GitHub repository URL (e.g., `facebook/react`)
3. Click **Generate README**
4. Choose between **Rendered** or **Raw** preview
5. Use **Copy**, **Download**, or **Commit on GitHub**
6. Switch between 5 professional templates using the template button

### Badges & Icons Generator

1. Navigate to **Badges** from the navbar
2. Select categories: Languages, Frameworks, Databases, Social
3. Click badges to add/remove them
4. Preview the combined markdown
5. Copy to clipboard or download

### Custom Banner Generator

1. Navigate to **Banner** from the navbar
2. Enter title and subtitle
3. Choose a gradient preset or create custom colors
4. Select font family and text color
5. Adjust alignment
6. Preview live banner with animations
7. Download as SVG or PNG, or copy markdown

### GitHub Stats & Trophies

1. Navigate to **GitHub Stats** from the navbar
2. Enter a GitHub username
3. Select cards: Stats, Top Languages, Streak, Trophies, Visitor Count
4. Preview live images
5. Copy individual cards or all at once

### CLI Tool

```bash
# Run the interactive CLI generator
node bin/readme-generator.js

# Or use npm script
npm run generate-readme
```

### API Endpoint

```bash
# POST request to generate README
curl -X POST http://localhost:3000/api/generate-readme \
  -H "Content-Type: application/json" \
  -d '{"owner":"facebook","repo":"react"}'
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

### Request Example

```javascript
POST /api/generate-readme
Content-Type: application/json

{
  "owner": "facebook",
  "repo": "react"
}
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com/)
3. Import your repository
4. Click **Deploy**

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
- [x] Multiple README templates (5 templates)
- [x] Badges & Icons Generator
- [x] Custom Banner Generator with SVG/PNG export
- [x] GitHub Stats & Trophies Integration
- [x] Navbar search bar
- [x] Dark/Light theme toggle

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Author

**Sabeel Ahmed**
- GitHub: [@S4-coder](https://github.com/S4-coder)
- Email: sabeel2311@gmail.com

## Support

For support, email sabeel2311@gmail.com or open an issue on GitHub.

---

<p align="center">
  <b>Made with ❤️ by Sabeel Ahmed</b>
</p>
