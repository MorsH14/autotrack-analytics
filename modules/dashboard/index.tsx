// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import "./dashboard.css";
import SummaryCards from "@/Components/SummaryCards";
import StatsChart from "@/Components/StatsChart";

type StatsData = {
    pageViews: { _id: string; count: number }[];
    clicks: { _id: string; count: number }[];
    durations: { _id: string; avgDuration: number }[];
};

export default function Dashboard() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/stats");
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (!stats) return <p className="loading">Loading...</p>;

    const totalPageViews = stats.pageViews.reduce((a, b) => a + b.count, 0);
    const totalClicks = stats.clicks.reduce((a, b) => a + b.count, 0);
    const avgDuration =
        stats.durations.reduce((a, b) => a + (b.avgDuration || 0), 0) / stats.durations.length || 0;

    const pageViewData = {
        labels: stats.pageViews.map((pv) => pv._id),
        datasets: [
            {
                label: "Page Views",
                data: stats.pageViews.map((pv) => pv.count),
                backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
        ],
    };

    const clickData = {
        labels: stats.clicks.map((c) => c._id || "Unknown"),
        datasets: [
            {
                label: "Clicks",
                data: stats.clicks.map((c) => c.count),
                backgroundColor: ["rgba(255, 99, 132, 0.7)", "rgba(255, 206, 86, 0.7)"],
            },
        ],
    };

    const durationData = {
        labels: stats.durations.map((d) => d._id),
        datasets: [
            {
                label: "Average Duration (s)",
                data: stats.durations.map((d) => d.avgDuration || 0),
                backgroundColor: "rgba(75, 192, 192, 0.7)",
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">AutoTrack Analytics</header>

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

            <div className="dashboard-footer">
                <button className="refresh-btn" onClick={fetchStats}>
                    Refresh
                </button>
            </div>
        </div>
    );
}
