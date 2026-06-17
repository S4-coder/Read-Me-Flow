import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FeaturesPage() {
  const features = [
    "Instant README generation with GitHub repo URL",
    "Auto-detect project topics and tech stack",
    "Shields.io badges integration",
    "Live preview toggle (raw/rendered)",
    "Copy to clipboard and download",
    "Direct GitHub commit integration",
  ];

  return (
    <div className="layout-root">
      <Header />
      <div className="workspace">
        <main
          className="panel"
          style={{ maxWidth: "none", padding: "2rem 1.75rem" }}
        >
          <h1 className="text-4xl font-semibold mb-8 text-slate-100">
            Features
          </h1>

          <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
            ReadMeFlow provides these core capabilities for professional
            documentation.
          </p>

          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-dim)",
              borderRadius: "18px",
              padding: "2rem",
            }}
          >
            <ul
              className="text-slate-300 space-y-5"
              style={{ "--text-secondary": "#94a3b8" }}
            >
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 px-4 py-3 rounded-lg hover:bg-slate-800/30 transition-colors"
                  style={{ color: "var(--text-secondary)", fontSize: "13.5px" }}
                >
                  <span style={{ color: "var(--accent)", fontSize: "16px" }}>
                    •
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
