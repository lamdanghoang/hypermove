"use client";

import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Sample current allocation
const allocations = [
    { name: "Babylon Labs", percentage: 30 },
    { name: "Stacks sBTC", percentage: 25 },
    { name: "wBTC Uniswap", percentage: 20 },
    { name: "Lombard LBTC", percentage: 15 },
    { name: "CoreDAO", percentage: 10 },
];

const data = {
    labels: allocations.map((a) => a.name),
    datasets: [
        {
            data: allocations.map((a) => a.percentage),
            backgroundColor: [
                "#1FB8CD",
                "#FFC185",
                "#B4413C",
                "#ECEBD5",
                "#5D878F",
            ],
            borderWidth: 2,
            borderColor: "#1f2121", // charcoal-700
        },
    ],
};

const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                    size: 12,
                },
                color: "#a7a9a9", // gray-300
            },
        },
    },
    cutout: "70%",
};

export default function AllocationChart() {
    return <Doughnut data={data} options={options} />;
}
