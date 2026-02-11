"use client";
import { useEffect, useState } from "react";
import "./dashboard.css";
import SummaryCards from "@/Components/SummaryCards";
import StatsChart from "@/Components/StatsChart";

type DomainInfo = { _id: string; eventCount: number };
type StatsData = {
  pageViews: { _id: string; count: number }[];
  clicks: { _id: string; count: number }[];
  durations: { _id: string; avgDuration: number }[];
};

export default function DashboardPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for saved password on mount
  useEffect(() => {
    const saved = localStorage.getItem("autotrack_admin_pw");
    if (saved) {
      setPassword(saved);
      authenticate(saved);
    }
  }, []);

  const authenticate = async (pw: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (data.valid) {
        localStorage.setItem("autotrack_admin_pw", pw);
        setAuthenticated(true);
        fetchDomains(pw);
      } else {
        localStorage.removeItem("autotrack_admin_pw");
        setAuthError(data.error || "Wrong password.");
      }
    } catch {
      setAuthError("Failed to connect.");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchDomains = async (pw: string) => {
    try {
      const res = await fetch("/api/domains", {
        headers: { "x-admin-password": pw },
      });
      const data = await res.json();
      setDomains(data.domains || []);
      // Auto-select first domain
      if (data.domains?.length > 0 && !selectedDomain) {
        selectDomain(data.domains[0]._id, pw);
      }
    } catch {
      console.error("Failed to fetch domains");
    }
  };

  const selectDomain = async (domain: string, pw?: string) => {
    const adminPw = pw || password;
    setSelectedDomain(domain);
    setLoading(true);
    try {
      const res = await fetch(`/api/stats?domain=${encodeURIComponent(domain)}`, {
        headers: { "x-admin-password": adminPw },
      });
      const data = await res.json();
      setStats(data);
    } catch {
      console.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    authenticate(password);
  };

  const handleLogout = () => {
    localStorage.removeItem("autotrack_admin_pw");
    setAuthenticated(false);
    setPassword("");
    setStats(null);
    setDomains([]);
    setSelectedDomain(null);
  };

  // --- Auth gate ---
  if (!authenticated) {
    return (
      <div style={authStyles.container}>
        <h1 style={authStyles.title}>AutoTrack Dashboard</h1>
        <form onSubmit={handleLogin} style={authStyles.form}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={authStyles.input}
          />
          <button type="submit" disabled={authLoading} style={authStyles.button}>
            {authLoading ? "Checking..." : "Login"}
          </button>
          {authError && <p style={authStyles.error}>{authError}</p>}
        </form>
      </div>
    );
  }

  // --- Dashboard ---
  const totalPageViews = stats?.pageViews.reduce((a, b) => a + b.count, 0) ?? 0;
  const totalClicks = stats?.clicks.reduce((a, b) => a + b.count, 0) ?? 0;
  const avgDuration =
    stats && stats.durations.length > 0
      ? stats.durations.reduce((a, b) => a + (b.avgDuration || 0), 0) / stats.durations.length
      : 0;

  const pageViewData = {
    labels: stats?.pageViews.map((pv) => pv._id) ?? [],
    datasets: [{
      label: "Page Views",
      data: stats?.pageViews.map((pv) => pv.count) ?? [],
      backgroundColor: "rgba(54, 162, 235, 0.7)",
    }],
  };

  const clickData = {
    labels: stats?.clicks.map((c) => c._id || "Unknown") ?? [],
    datasets: [{
      label: "Clicks",
      data: stats?.clicks.map((c) => c.count) ?? [],
      backgroundColor: ["rgba(255, 99, 132, 0.7)", "rgba(255, 206, 86, 0.7)"],
    }],
  };

  const durationData = {
    labels: stats?.durations.map((d) => d._id) ?? [],
    datasets: [{
      label: "Average Duration (s)",
      data: stats?.durations.map((d) => d.avgDuration || 0) ?? [],
      backgroundColor: "rgba(75, 192, 192, 0.7)",
    }],
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">AutoTrack Analytics</header>

      {/* Domain selector */}
      <div className="domain-selector">
        {domains.map((d) => (
          <button
            key={d._id}
            className={`domain-btn ${selectedDomain === d._id ? "active" : ""}`}
            onClick={() => selectDomain(d._id)}
          >
            {d._id} ({d.eventCount})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty-state">Loading stats...</p>
      ) : !stats || (totalPageViews === 0 && totalClicks === 0) ? (
        <p className="empty-state">No events recorded yet for {selectedDomain}.</p>
      ) : (
        <>
          <SummaryCards
            totalPageViews={totalPageViews}
            totalClicks={totalClicks}
            avgDuration={avgDuration}
          />

          <div className="charts-grid">
            <StatsChart type="bar" title="Page Views" data={pageViewData} />
            <StatsChart type="pie" title="Clicks" data={clickData} />
            <StatsChart type="bar" title="Average Duration" data={durationData} />
          </div>
        </>
      )}

      <div className="dashboard-footer">
        <button className="refresh-btn" onClick={() => { fetchDomains(password); if (selectedDomain) selectDomain(selectedDomain); }}>
          Refresh
        </button>
        <button
          className="refresh-btn"
          onClick={handleLogout}
          style={{ marginLeft: "0.5rem", background: "#666" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const authStyles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 400,
    margin: "120px auto",
    padding: "0 1.5rem",
    fontFamily: "system-ui, sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#0366d6",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: "1rem",
    textAlign: "center",
  },
  button: {
    padding: "0.75rem 1rem",
    borderRadius: 8,
    border: "none",
    background: "#0366d6",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "#d63031",
    margin: 0,
  },
};
