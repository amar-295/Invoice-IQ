"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import type { AnalyticsData } from "./types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
);

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const spendingLineData = {
    labels: data.spendingOverTime.map((item) => item.label),
    datasets: [
      {
        label: "Total Spending",
        data: data.spendingOverTime.map((item) => item.value),
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  const spendingLineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const value = context.parsed.y ?? 0;
            return `Spending: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${Number(value).toLocaleString("en-IN")}`,
        },
        grid: { color: "rgba(148, 163, 184, 0.15)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const supplierBarData = {
    labels: data.supplierSpending.map((item) => item.name),
    datasets: [
      {
        label: "Supplier Spending",
        data: data.supplierSpending.map((item) => item.value),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(99, 102, 241, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(14, 165, 233, 0.7)",
        ],
        borderRadius: 8,
      },
    ],
  };

  const supplierBarOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const value = context.parsed.y ?? 0;
            return `Spending: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${Number(value).toLocaleString("en-IN")}`,
        },
        grid: { color: "rgba(148, 163, 184, 0.15)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const productHorizontalBarData = {
    labels: data.topProducts.map((item) => `${item.name} (${item.unit})`),
    datasets: [
      {
        label: "Purchased Quantity",
        data: data.topProducts.map((item) => item.value),
        backgroundColor: "rgba(30, 58, 138, 0.75)",
        borderRadius: 8,
      },
    ],
  };

  const productHorizontalBarOptions: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const value = context.parsed.x ?? 0;
            return `Quantity: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(148, 163, 184, 0.15)" },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return (
    <>
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Spending Over Time
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Track total spending trend across selected time period.
          </p>
        </div>
        <div className="h-72">
          {data.spendingOverTime.length > 0 ? (
            <Line data={spendingLineData} options={spendingLineOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              No spending data available for selected range.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Supplier Spending Comparison
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Compare how spending is distributed across suppliers.
          </p>
        </div>
        <div className="h-80">
          {data.supplierSpending.length > 0 ? (
            <Bar data={supplierBarData} options={supplierBarOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              No supplier spending data available.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Top Purchased Products
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Products with highest purchased quantities in selected period.
          </p>
        </div>
        <div className="h-80">
          {data.topProducts.length > 0 ? (
            <Bar
              data={productHorizontalBarData}
              options={productHorizontalBarOptions}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              No product purchase data available.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
