"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const CARD_OPTIONS = [
  { id: "stats", label: "Stats Card", description: "Commits, PRs, issues, stars, and contributions overview" },
  { id: "languages", label: "Top Languages", description: "Most used languages across your repositories" },
  { id: "streak", label: "Streak Stats", description: "Current and longest contribution streak" },
  { id: "trophies", label: "Profile Trophies", description: "Achievements and trophy showcase for your profile" },
  { id: "visitor", label: "Visitor Count", description: "Profile view counter badge" },
];

async function fetchGithubUser(username) {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}`);
  if (!res.ok) {
    if (res.status === 403) throw new Error("RATE_LIMITED");
    if (res.status === 404) throw new Error("NOT_FOUND");
    throw new Error("FETCH_ERROR");
  }
  return res.json();
}

async function fetchGithubRepos(username) {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}/repos?per_page=100&sort=updated`);
  if (!res.ok) return [];
  return res.json();
}

function buildExternalCardUrl(username, type) {
  const encoded = encodeURIComponent(username.trim());
  switch (type) {
    case "streak":
      return `https://streak-stats.demolab.com/?user=${encoded}&theme=radical`;
    case "trophies":
      return `https://github-profile-trophy.vercel.app/?username=${encoded}&theme=radical&no-frame=true`;
    case "visitor":
      return `https://visitor-badge.laobi.icu/badge?username=${encoded}`;
    default:
      return "";
  }
}

function buildStatsSvg(user) {
  const width = 480;
  const height = 200;
  const repos = user.public_repos || 0;
  const followers = user.followers || 0;
  const following = user.following || 0;
  const gists = user.public_gists || 0;
  const name = user.name || user.login || "User";

  const items = [
    { label: "Repos", value: repos },
    { label: "Followers", value: followers },
    { label: "Following", value: following },
    { label: "Gists", value: gists },
  ];

  const rows = items
    .map((item, index) =>
      `<rect x="20" y="${index * 42 + 28}" width="8" height="8" rx="2" fill="#6366f1" />
     <text x="36" y="${index * 42 + 36}" font-family="sans-serif" font-size="14" fill="#94a3b8">${item.label}</text>
     <text x="${width - 20}" y="${index * 42 + 36}" text-anchor="end" font-family="sans-serif" font-size="14" fill="#f1f5f9" font-weight="600">${item.value}</text>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="18" fill="url(#bg)" />
  <text x="24" y="28" font-family="sans-serif" font-size="18" fill="#f1f5f9" font-weight="700">${escapeXml(name)}</text>
  ${rows}
</svg>`;
}

function buildLanguagesSvg(repos) {
  const width = 480;
  const height = 260;
  const langMap = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    }
  });
  const total = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const bars = sorted
    .map(([lang, count], idx) => {
      const pct = ((count / total) * 100).toFixed(1);
      const y = idx * 32 + 60;
      return `<rect x="24" y="${y}" width="${Math.max((count / total) * 340, 4)}" height="16" rx="4" fill="#6366f1" opacity="${1 - idx * 0.08}" />
      <text x="24" y="${y + 12}" font-family="sans-serif" font-size="13" fill="#f1f5f9" font-weight="500">${escapeXml(lang)}</text>
      <text x="${width - 20}" y="${y + 12}" text-anchor="end" font-family="sans-serif" font-size="13" fill="#94a3b8">${pct}%</text>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="18" fill="url(#bg)" />
  <text x="24" y="36" font-family="sans-serif" font-size="18" fill="#f1f5f9" font-weight="700">Top Languages</text>
  ${bars}
</svg>`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function svgToBase64(svgString) {
  return `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;
}

function buildCardMarkdown(username, type, svgBase64) {
  return `<p align="center">\n  <img src="${svgBase64}" alt="${type} card" />\n</p>`;
}

export default function GithubStatsPage() {
  const [username, setUsername] = useState("");
  const [selectedCards, setSelectedCards] = useState(new Set(["stats"]));
  const [copiedType, setCopiedType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [repoData, setRepoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username.trim()) {
      setUserData(null);
      setRepoData([]);
      setError("");
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");

      Promise.all([fetchGithubUser(username), fetchGithubRepos(username)])
        .then(([user, repos]) => {
          if (cancelled) return;
          setUserData(user);
          setRepoData(Array.isArray(repos) ? repos : []);
        })
        .catch((err) => {
          if (cancelled) return;
          if (err.message === "RATE_LIMITED") {
            setError("GitHub API rate limit exceeded. Please wait a minute and try again.");
          } else if (err.message === "NOT_FOUND") {
            setError("User not found. Please check the username.");
          } else {
            setError("Failed to fetch GitHub data. Please try again.");
          }
          setUserData(null);
          setRepoData([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username]);

  const toggleCard = (id) => {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyCard = async (type) => {
    if (!username.trim()) return;
    let markdown = "";
    if (type === "stats" && userData) {
      const svg = buildStatsSvg(userData);
      markdown = buildCardMarkdown(username, "stats", svgToBase64(svg));
    } else if (type === "languages" && repoData.length > 0) {
      const svg = buildLanguagesSvg(repoData);
      markdown = buildCardMarkdown(username, "languages", svgToBase64(svg));
    } else if (type === "streak" || type === "visitor" || type === "trophies") {
      const url = buildExternalCardUrl(username, type);
      markdown = buildExternalMarkdown(url, type);
    }
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const copyAll = async () => {
    if (!username.trim() || selectedCards.size === 0) return;
    const markdown = Array.from(selectedCards)
      .map((type) => {
        if (type === "stats" && userData) {
          const svg = buildStatsSvg(userData);
          return buildCardMarkdown(username, "stats", svgToBase64(svg));
        }
        if (type === "languages" && repoData.length > 0) {
          const svg = buildLanguagesSvg(repoData);
          return buildCardMarkdown(username, "languages", svgToBase64(svg));
        }
        if (type === "streak" || type === "visitor" || type === "trophies") {
          const url = buildExternalCardUrl(username, type);
          return buildExternalMarkdown(url, type);
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedType("all");
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      setCopiedType("all");
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const renderPreviewCard = (type) => {
    if (type === "stats" && userData) {
      const svg = buildStatsSvg(userData);
      const src = svgToBase64(svg);
      return (
        <img src={src} alt="Stats Card" style={{ width: "100%", height: "auto", display: "block" }} />
      );
    }
    if (type === "languages" && repoData.length > 0) {
      const svg = buildLanguagesSvg(repoData);
      const src = svgToBase64(svg);
      return (
        <img src={src} alt="Top Languages" style={{ width: "100%", height: "auto", display: "block" }} />
      );
    }
    if (type === "streak" || type === "visitor" || type === "trophies") {
      const url = buildExternalCardUrl(username, type);
      return (
        <ExternalImage
          src={url}
          alt={type}
          fallback={`${type} image could not be loaded. You can still copy the markdown.`}
        />
      );
    }
    return <p style={{ color: "var(--text-muted)" }}>Select this card and enter a valid username to preview.</p>;
  };

  function ExternalImage({ src, alt, fallback }) {
    const [errored, setErrored] = useState(false);
    if (errored) {
      return <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>{fallback}</p>;
    }
    return (
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "auto", display: "block" }}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div className="layout-root">
      <Header />
      <main style={{ padding: '2rem 1.75rem', maxWidth: '1180px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, var(--accent), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
            GitHub Stats &amp; Trophies
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginTop: '1rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Generate GitHub stats cards, top languages, streak stats, profile trophies, and visitor count badges for your README.
          </p>
        </div>

        {error && (
          <div style={{ maxWidth: '1180px', margin: '0 auto 1.25rem', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #f87171', background: 'rgba(248,113,113,0.08)', color: '#fca5a5', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div className="badges-layout">
          <div className="badges-left">
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>GitHub Username</h2>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                    placeholder="e.g. torvalds"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Select Cards</h2>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {CARD_OPTIONS.map((option) => {
                  const isSelected = selectedCards.has(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleCard(option.id)}
                      className="badge-btn"
                      data-selected={isSelected ? "true" : "false"}
                      type="button"
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        textAlign: 'left',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-dim)',
                        background: 'var(--bg-surface)',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      <div style={{ flex: '1 1 auto' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{option.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{option.description}</div>
                      </div>
                      <div style={{
                        marginTop: '2px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-default)',
                        background: isSelected ? 'var(--accent)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#fff' : 'transparent',
                        fontSize: '12px',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}>
                        ✓
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="preview-sticky">
            <div className="preview-card">
              <div className="preview-header">
                <div className="preview-title-area">
                  <div className="preview-dot" />
                  <span className="preview-title">Live Preview</span>
                </div>
                <div className="preview-actions">
                  <button onClick={copyAll} disabled={!username.trim() || selectedCards.size === 0 || loading} className="btn btn-ghost btn-sm" type="button">
                    {copiedType === "all" ? "Copied!" : "Copy All"}
                  </button>
                </div>
              </div>

              <div className="preview-body" style={{ overflow: 'auto', padding: '1.5rem', background: 'var(--bg-base)' }}>
                {loading ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading GitHub data...</p>
                ) : username.trim() && selectedCards.size > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                    {Array.from(selectedCards).map((type) => {
                      const label = CARD_OPTIONS.find(c => c.id === type)?.label || type;
                      return (
                        <div key={type} style={{ width: '100%', maxWidth: '500px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                            <button onClick={() => copyCard(type)} disabled={loading} className="btn btn-ghost btn-sm" type="button">
                              {copiedType === type ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-dim)', background: 'var(--bg-surface)' }}>
                            {renderPreviewCard(type)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Enter a GitHub username and select cards to preview...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function buildExternalMarkdown(url, type) {
  return `<p align="center">\n  <img src="${url}" alt="${type} card" />\n</p>`;
}
