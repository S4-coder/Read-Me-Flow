"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const GRADIENTS = [
  { name: "Ocean", value: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)" },
  { name: "Sunset", value: "linear-gradient(135deg, #FF5E62 0%, #FF9966 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)" },
  { name: "Midnight", value: "linear-gradient(135deg, #232526 0%, #414345 100%)" },
  { name: "Aurora", value: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)" },
  { name: "Candy", value: "linear-gradient(135deg, #FF5f6d 0%, #ffc371 100%)" },
  { name: "Royal", value: "linear-gradient(135deg, #141e30 0%, #243b55 100%)" },
  { name: "Peach", value: "linear-gradient(135deg, #ED4264 0%, #FFEDBC 100%)" },
  { name: "Custom", value: "custom" },
];

const FONTS = [
  { name: "Geist", value: "Geist, sans-serif", google: null },
  {
    name: "Inter",
    value: "Inter, sans-serif",
    google: "Inter:wght@400;600;700",
  },
  {
    name: "Poppins",
    value: "Poppins, sans-serif",
    google: "Poppins:wght@400;600;700",
  },
  {
    name: "Montserrat",
    value: "Montserrat, sans-serif",
    google: "Montserrat:wght@400;600;700",
  },
  {
    name: "Roboto",
    value: "Roboto, sans-serif",
    google: "Roboto:wght@400;700",
  },
  {
    name: "Playfair Display",
    value: "'Playfair Display', serif",
    google: "Playfair+Display:wght@400;700",
  },
  {
    name: "Fira Code",
    value: "'Fira Code', monospace",
    google: "Fira+Code:wght@400;700",
  },
  {
    name: "JetBrains Mono",
    value: "'JetBrains Mono', monospace",
    google: "JetBrains+Mono:wght@400;700",
  },
];

const BANNER_WIDTH = 1000;
const BANNER_HEIGHT = 300;

function loadGoogleFont(fontFamily, googleParam) {
  if (!googleParam) return;
  const id = `google-font-${fontFamily.replace(/[^a-zA-Z]/g, "")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${googleParam}&display=swap`;
  document.head.appendChild(link);
}

function parseGradientColors(gradientValue) {
  const match = gradientValue.match(
    /linear-gradient\(135deg,\s*(#[A-Fa-f0-9]+)\s+0%,\s*(#[A-Fa-f0-9]+)\s+100%\)/
  );
  if (match) {
    return { from: match[1], to: match[2] };
  }
  return { from: "#6366f1", to: "#a855f7" };
}

function buildSvgString({
  title,
  subtitle,
  gradientFrom,
  gradientTo,
  fontFamily,
  textColor,
  alignment,
  width,
  height,
  gradientName,
}) {
  const safeTitle = title || "Your Project Title";
  const safeSubtitle = subtitle || "Short description here";
  const escapedTitle = safeTitle
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const escapedSubtitle = safeSubtitle
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const safeName = (gradientName || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  let textAnchor = "middle";
  let x = width / 2;
  if (alignment === "left") {
    textAnchor = "start";
    x = 60;
  } else if (alignment === "right") {
    textAnchor = "end";
    x = width - 60;
  }

  const titleY = height / 2 - (safeSubtitle ? 20 : 0);
  const subtitleY = height / 2 + 50;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientFrom}">
        <animate attributeName="stop-color" values="${gradientFrom};${gradientTo};${gradientFrom}" dur="6s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="${gradientTo}">
        <animate attributeName="stop-color" values="${gradientTo};${gradientFrom};${gradientTo}" dur="6s" repeatCount="indefinite" />
      </stop>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <text x="${x}" y="${titleY}" text-anchor="${textAnchor}" dominant-baseline="middle" font-family="${fontFamily}" font-size="52" font-weight="700" fill="${textColor}">
    ${escapedTitle}
    <animate attributeName="opacity" values="0.85;1;0.85" dur="4s" repeatCount="indefinite" />
  </text>
  ${safeSubtitle ? `<text x="${x}" y="${subtitleY}" text-anchor="${textAnchor}" dominant-baseline="middle" font-family="${fontFamily}" font-size="22" font-weight="400" fill="${textColor}" opacity="0.85">${escapedSubtitle}</text>` : ""}
  ${safeName ? `<text x="${width - 20}" y="${height - 18}" text-anchor="end" dominant-baseline="auto" font-family="sans-serif" font-size="13" font-weight="500" fill="${textColor}" opacity="0.7">${safeName}</text>` : ""}
</svg>`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function svgToPngBlob(svgString) {
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  const blob = await new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = BANNER_WIDTH;
      canvas.height = BANNER_HEIGHT;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(resolve, "image/png");
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
  return blob;
}

export default function BannerPage() {
  const [title, setTitle] = useState("ReadMe Flow");
  const [subtitle, setSubtitle] = useState(
    "Generate professional READMEs instantly",
  );
  const [selectedGradient, setSelectedGradient] = useState(
    GRADIENTS[0].value,
  );
  const [customFrom, setCustomFrom] = useState("#6366f1");
  const [customTo, setCustomTo] = useState("#a855f7");
  const [fontIndex, setFontIndex] = useState(0);
  const [textColor, setTextColor] = useState("#ffffff");
  const [alignment, setAlignment] = useState("center");
  const [copied, setCopied] = useState(false);

  const isCustom = selectedGradient === "custom";
  const activeGradient = isCustom
    ? { name: "Custom", value: `linear-gradient(135deg, ${customFrom} 0%, ${customTo} 100%)` }
    : GRADIENTS.find((g) => g.value === selectedGradient);

  const { from: gradientFrom, to: gradientTo } = isCustom
    ? { from: customFrom, to: customTo }
    : parseGradientColors(selectedGradient);

  const activeFont = FONTS[fontIndex];

  useEffect(() => {
    if (activeFont.google) {
      loadGoogleFont(activeFont.name, activeFont.google);
    }
  }, [activeFont]);

  const svgString = buildSvgString({
    title,
    subtitle,
    gradientFrom,
    gradientTo,
    fontFamily: activeFont.value,
    textColor,
    alignment,
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    gradientName: activeGradient.name,
  });

  const markdown = `<p align="center">
  <img src="data:image/svg+xml;base64,${btoa(
    unescape(encodeURIComponent(svgString)),
  )}" alt="banner" />
</p>`;

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, "banner.svg");
  };

  const handleDownloadPng = async () => {
    await document.fonts.ready;
    try {
      const blob = await svgToPngBlob(svgString);
      downloadBlob(blob, "banner.png");
    } catch {
      alert("Unable to generate PNG. Please try again.");
    }
  };

  return (
    <div className="layout-root">
      <Header />
      <main
        style={{
          padding: "2rem 1.75rem",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "720px",
            margin: "0 auto 3rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, var(--accent), #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Custom Banner &amp; Header Generator
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1rem",
              lineHeight: 1.7,
              marginTop: "1rem",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Design a custom SVG/PNG banner with title, subtitle, gradient
            background, and font styling. Use it at the top of your README.
          </p>
        </div>

        <div className="badges-layout">
          <div className="badges-left">
            <div
              className="card"
              style={{ padding: "1.25rem", marginBottom: "1.25rem" }}
            >
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "1rem",
                }}
              >
                Content
              </h2>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                    placeholder="Project title"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="input"
                    placeholder="Short description"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{ padding: "1.25rem", marginBottom: "1.25rem" }}
            >
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "1rem",
                }}
              >
                Background Gradient
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                {GRADIENTS.map((item) => {
                  const isSelected = selectedGradient === item.value;
                  const cardBackground =
                    item.name === "Custom"
                      ? `linear-gradient(135deg, ${customFrom} 0%, ${customTo} 100%)`
                      : item.value;

                  return (
                    <div
                      key={item.name}
                      onClick={() => setSelectedGradient(item.value)}
                      style={{ background: cardBackground }}
                      className={`h-24 rounded-xl flex items-end justify-center cursor-pointer border-2 transition-all overflow-hidden ${
                        isSelected
                          ? "border-white scale-105 shadow-lg"
                          : "border-transparent opacity-90 hover:opacity-100"
                      }`}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          background: "rgba(0,0,0,0.4)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
              {isCustom && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      From
                    </label>
                    <input
                      type="color"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      style={{
                        width: "100%",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-dim)",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      To
                    </label>
                    <input
                      type="color"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      style={{
                        width: "100%",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-dim)",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              className="card"
              style={{ padding: "1.25rem", marginBottom: "1.25rem" }}
            >
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "1rem",
                }}
              >
                Typography
              </h2>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Font Family
                  </label>
                  <select
                    value={fontIndex}
                    onChange={(e) => setFontIndex(Number(e.target.value))}
                    className="input"
                    style={{
                      width: "100%",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-lg)",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "13.5px",
                    }}
                  >
                    {FONTS.map((f, idx) => (
                      <option
                        key={f.name}
                        value={idx}
                        style={{ fontFamily: f.value }}
                      >
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      style={{
                        width: "100%",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-dim)",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Alignment
                    </label>
                    <select
                      value={alignment}
                      onChange={(e) => setAlignment(e.target.value)}
                      className="input"
                      style={{
                        width: "100%",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-lg)",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "13.5px",
                      }}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
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
                  <button
                    onClick={copyMarkdown}
                    disabled={!title}
                    className="btn btn-ghost btn-sm"
                    type="button"
                  >
                    {copied ? "Copied!" : "Copy Markdown"}
                  </button>
                  <button
                    onClick={handleDownloadSvg}
                    className="btn btn-ghost btn-sm"
                    type="button"
                  >
                    Download SVG
                  </button>
                  <button
                    onClick={handleDownloadPng}
                    className="btn btn-ghost btn-sm"
                    type="button"
                  >
                    Download PNG
                  </button>
                </div>
              </div>

              <div className="preview-body banner-preview-body">
                <div
                  className="banner-svg-wrap"
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
