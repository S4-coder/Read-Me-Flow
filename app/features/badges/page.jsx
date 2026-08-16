"use client";
import { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const iconCategories = {
  languages: [
    { name: "JavaScript", slug: "js" },
    { name: "TypeScript", slug: "ts" },
    { name: "Python", slug: "py" },
    { name: "Java", slug: "java" },
    { name: "C", slug: "c" },
    { name: "C++", slug: "cpp" },
    { name: "C#", slug: "cs" },
    { name: "Go", slug: "go" },
    { name: "Rust", slug: "rust" },
    { name: "PHP", slug: "php" },
    { name: "Ruby", slug: "ruby" },
    { name: "Swift", slug: "swift" },
    { name: "Kotlin", slug: "kotlin" },
    { name: "Dart", slug: "dart" },
    { name: "HTML", slug: "html" },
    { name: "CSS", slug: "css" },
    { name: "Sass", slug: "sass" },
    { name: "SQL", slug: "sqlite" }
  ],
  frameworks: [
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "Vue.js", slug: "vue" },
    { name: "Nuxt.js", slug: "nuxt" },
    { name: "Angular", slug: "angular" },
    { name: "Svelte", slug: "svelte" },
    { name: "Node.js", slug: "nodejs" },
    { name: "Express", slug: "express" },
    { name: "Django", slug: "django" },
    { name: "Flask", slug: "flask" },
    { name: "FastAPI", slug: "fastapi" },
    { name: "Spring", slug: "spring" },
    { name: "Laravel", slug: "laravel" },
    { name: "Tailwind", slug: "tailwind" },
    { name: "Bootstrap", slug: "bootstrap" }
  ],
  databases: [
    { name: "MongoDB", slug: "mongodb" },
    { name: "PostgreSQL", slug: "postgres" },
    { name: "MySQL", slug: "mysql" },
    { name: "Redis", slug: "redis" },
    { name: "Firebase", slug: "firebase" },
    { name: "Supabase", slug: "supabase" },
    { name: "Appwrite", slug: "appwrite" },
    { name: "Prisma", slug: "prisma" }
  ],
  devopsTools: [
    { name: "Git", slug: "git" },
    { name: "GitHub", slug: "github" },
    { name: "GitLab", slug: "gitlab" },
    { name: "Docker", slug: "docker" },
    { name: "Kubernetes", slug: "kubernetes" },
    { name: "AWS", slug: "aws" },
    { name: "GCP", slug: "gcp" },
    { name: "Vercel", slug: "vercel" },
    { name: "Netlify", slug: "netlify" },
    { name: "Linux", slug: "linux" },
    { name: "Ubuntu", slug: "ubuntu" },
    { name: "VS Code", slug: "vscode" },
    { name: "Postman", slug: "postman" },
    { name: "Figma", slug: "figma" }
  ],
  social: [
    { name: "YouTube", badge: "https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white", link: "https://youtube.com/@sabeelcodes" },
    { name: "Instagram", badge: "https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white", link: "https://instagram.com/sabeelcodes" },
    { name: "LinkedIn", badge: "https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white", link: "https://linkedin.com" },
    { name: "WhatsApp", badge: "https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white", link: "https://wa.me/" },
    { name: "Twitter / X", badge: "https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white", link: "https://twitter.com" },
    { name: "Discord", badge: "https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white", link: "https://discord.com" }
  ]
};

function CategoryCard({ title, items, color, onItemClick, selectedItems }) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <h2 style={{ fontSize: '13px', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: '0.5rem' }}>
        {items.map((icon) => {
          const isSelected = selectedItems.some(t => t.slug === icon.slug);
          return (
            <button
              key={icon.slug}
              onClick={() => onItemClick(icon.slug, icon.name)}
              className="badge-btn"
              data-selected={isSelected ? "true" : "false"}
              type="button"
            >
              <img src={`https://skillicons.dev/icons?i=${icon.slug}`} alt={icon.name} className="badge-icon" />
              <span className="badge-label">{icon.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BadgesPage() {
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedSocial, setSelectedSocial] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleTechClick = (slug, name) => {
    setSelectedTech(prev => {
      if (prev.some(item => item.slug === slug)) {
        return prev.filter(item => item.slug !== slug);
      }
      return [...prev, { slug, name }];
    });
  };

  const handleSocialClick = (social) => {
    setSelectedSocial(prev => {
      if (prev.some(item => item.name === social.name)) {
        return prev.filter(item => item.name === social.name);
      }
      return [...prev, social];
    });
  };

  const generateMarkdown = () => {
    let markdown = "";

    if (selectedTech.length > 0) {
      markdown += `<p align="center">\n`;
      const techSlugs = selectedTech.map(i => i.slug).join(",");
      markdown += `  <img src="https://skillicons.dev/icons?i=${techSlugs}" />\n`;
      markdown += `</p>\n\n`;
    }

    if (selectedSocial.length > 0) {
      markdown += `<p align="center">\n`;
      selectedSocial.forEach(s => {
        markdown += `  <a href="${s.link}">\n    <img src="${s.badge}" />\n  </a>\n`;
      });
      markdown += `</p>`;
    }

    return markdown;
  };

  const copyToClipboard = () => {
    const markdown = generateMarkdown();
    if (markdown) {
      navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasSelection = selectedTech.length > 0 || selectedSocial.length > 0;

  return (
    <div className="layout-root">
      <Header />
      <main style={{ padding: '2rem 1.75rem', maxWidth: '1180px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, var(--accent), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
            Interactive Badge &amp; Icon Generator
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginTop: '1rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Select your favorite languages, frameworks, and social handles to instantly build and copy your custom GitHub README markdown block.
          </p>
        </div>

        <div className="badges-layout">
          <div className="badges-left">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))', gap: '1.5rem' }}>
              <CategoryCard
                title="Programming Languages"
                items={iconCategories.languages}
                color="var(--accent)"
                onItemClick={handleTechClick}
                selectedItems={selectedTech}
              />
              <CategoryCard
                title="Frameworks & Libraries"
                items={iconCategories.frameworks}
                color="var(--accent)"
                onItemClick={handleTechClick}
                selectedItems={selectedTech}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))', gap: '1.5rem' }}>
              <CategoryCard
                title="DevOps, Cloud & Editors"
                items={iconCategories.devopsTools}
                color="var(--accent)"
                onItemClick={handleTechClick}
                selectedItems={selectedTech}
              />
              <CategoryCard
                title="Databases & Backend Tools"
                items={iconCategories.databases}
                color="var(--accent)"
                onItemClick={handleTechClick}
                selectedItems={selectedTech}
              />
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Social &amp; Community Badges</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {iconCategories.social.map((social) => {
                  const isSelected = selectedSocial.some(s => s.name === social.name);
                  return (
                    <button
                      key={social.name}
                      onClick={() => handleSocialClick(social)}
                      className="badge-btn social-btn"
                      data-selected={isSelected ? "true" : "false"}
                      type="button"
                    >
                      <img src={social.badge} alt={social.name} style={{ height: '20px' }} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

            <div className="preview-sticky">
              <div className="preview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', marginTop: '0.5rem', paddingRight: '0.5rem', paddingLeft: '0.5rem' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Markdown Preview</h3>
                  <button
                    onClick={copyToClipboard}
                    disabled={!hasSelection}
                    className="btn btn-ghost btn-sm"
                    type="button"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="preview-body">
                  <pre className="md-content" style={{ fontSize: '11px' }}>{generateMarkdown() || 'Select icons to generate markdown...'}</pre>
                </div>
              </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
