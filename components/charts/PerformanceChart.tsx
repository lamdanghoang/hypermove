'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Generate mock historical data
const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const portfolioValue = [420000, 428000, 435000, 442000, 448000, 445000, 451500]

const data = {
  labels: months,
  datasets: [
    {
      label: 'Portfolio Value ($)',
      data: portfolioValue,
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
  ],
}

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: function (value) {
          return '$' + Number(value).toLocaleString()
        },
        color: '#a7a9a9', // gray-300
      },
      grid: {
        color: 'rgba(167, 169, 169, 0.1)', // gray-300 with opacity
      },
    },
    x: {
      ticks: {
        color: '#a7a9a9', // gray-300
      },
      grid: {
        display: false,
      },
    },
  },
}

export function PerformanceChart() {
  return <Line data={data} options={options} />
}
