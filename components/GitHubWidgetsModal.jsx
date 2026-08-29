'use client';

import { useState } from 'react';

export default function GitHubWidgetsModal({ onInsertMarkdown, isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('tokyonight');

  const handleGenerate = () => {
    if (!username.trim()) {
      alert('Please enter your GitHub username!');
      return;
    }

    const advancedMarkdown = `
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,10,25,30&height=160&section=header&text=Welcome%20To%20My%20Profile&fontSize=35&fontColor=fff&animation=fadeIn&fontAlignY=38" />
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Exploring%20New%20Tech-success?style=for-the-badge&logo=appveyor&logoColor=white" />
  <img src="https://img.shields.io/badge/Open%20Source-Contributor-blue?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/Profile%20Views-⚡-orange?style=for-the-badge" />
</p>

---

## 📊 GitHub Analytics & Metrics

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=false&count_private=true" alt="${username}'s stats" width="48%" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=false" alt="${username}'s top languages" width="48%" />
</p>

<p align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${theme}&hide_border=false" alt="${username}'s streak" width="100%" />
</p>

<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=react-dark&hide_border=false&area=true&custom_title=GitHub%20Activity%20Graph" alt="${username}'s activity graph" width="100%" />
</p>

---

## 🛠️ Tech Stack & Badges

<p align="left">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" />
  <br>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <br>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" />
</p>
`;

    onInsertMarkdown(advancedMarkdown);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Add Animated GitHub Stats
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Enter your GitHub username to generate live stats, activity graphs, and shields.io badges.
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
            GitHub Username
          </label>
          <input
            type="text"
            placeholder="e.g., torvalds"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
            Card Theme
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          >
            <option value="tokyonight">Tokyo Night</option>
            <option value="radical">Radical</option>
            <option value="dracula">Dracula</option>
            <option value="gruvbox">Gruvbox</option>
            <option value="github_dark">GitHub Dark</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="btn btn-primary btn-sm"
            type="button"
            style={{ background: 'var(--accent)', color: '#020817', border: '1px solid var(--accent)' }}
          >
            Generate & Insert
          </button>
        </div>
      </div>
    </div>
  );
}
