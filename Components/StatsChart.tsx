// components/StatsChart.tsx
"use client";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

type StatsChartProps = {
    type: "bar" | "pie";
    title: string;
    data: any;
};

export default function StatsChart({ type, title, data }: StatsChartProps) {
    return (
        <div className="card">
            <h2>{title}</h2>
            {type === "bar" ? (
                <Bar data={data} options={{ maintainAspectRatio: false, responsive: true }} />
            ) : (
                <Pie data={data} options={{ maintainAspectRatio: false, responsive: true }} />
            )}
        </div>
    );
}
