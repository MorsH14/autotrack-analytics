"use client";
import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://your-autotrack-domain.com";
  const snippet = `<script src="${origin}/tracker.js"></script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AutoTrack</h1>
      <p style={styles.subtitle}>
        Lightweight, self-hosted website analytics.
        <br />
        Privacy-first. No cookies. No sign-up.
      </p>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Setup</h2>
        <p style={styles.text}>
          Add this one line to any website you want to track, right before <code>&lt;/body&gt;</code>:
        </p>
        <div style={styles.snippetBox}>
          <code style={styles.snippetCode}>{snippet}</code>
          <button onClick={copySnippet} style={styles.copyBtn}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p style={styles.text}>
          That&apos;s it. Page views, clicks, and time-on-page are tracked automatically.
          The domain is detected from the page URL — no configuration needed.
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>View Analytics</h2>
        <p style={styles.text}>
          Your dashboard is at{" "}
          <a href="/dashboard" style={styles.link}>/dashboard</a>.
          It&apos;s protected by the admin password set in your <code>ADMIN_PASSWORD</code> environment variable.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 640,
    margin: "80px auto",
    padding: "0 1.5rem",
    fontFamily: "system-ui, sans-serif",
    color: "#1e1e1e",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#0366d6",
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "#555",
    fontSize: "1.1rem",
    lineHeight: 1.6,
    marginBottom: "2.5rem",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
  },
  text: {
    color: "#444",
    lineHeight: 1.6,
  },
  snippetBox: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    background: "#f6f8fa",
    border: "1px solid #e1e4e8",
    borderRadius: 8,
    padding: "0.75rem",
    margin: "0.75rem 0",
  },
  snippetCode: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: "0.85rem",
    wordBreak: "break-all",
  },
  copyBtn: {
    padding: "0.4rem 0.75rem",
    borderRadius: 6,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
  },
  link: {
    color: "#0366d6",
    fontWeight: 600,
    textDecoration: "none",
  },
};
