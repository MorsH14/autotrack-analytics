// components/SummaryCards.tsx
type SummaryCardsProps = {
    totalPageViews: number;
    totalClicks: number;
    avgDuration: number;
};

export default function SummaryCards({ totalPageViews, totalClicks, avgDuration }: SummaryCardsProps) {
    return (
        <div className="summary-cards">
            <div className="summary-card">
                <span className="summary-label">Page Views</span>
                <span className="summary-value">{totalPageViews}</span>
            </div>
            <div className="summary-card">
                <span className="summary-label">Clicks</span>
                <span className="summary-value">{totalClicks}</span>
            </div>
            <div className="summary-card">
                <span className="summary-label">Avg Duration</span>
                <span className="summary-value">{avgDuration.toFixed(1)}s</span>
            </div>
        </div>
    );
}
