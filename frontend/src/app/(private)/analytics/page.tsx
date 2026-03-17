"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Store,
  Truck,
  Package,
  TrendingUp,
  TrendingDown,
  CalendarRange,
  ChevronDown,
} from "lucide-react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

type FilterKey = "last7Days" | "lastMonth" | "last6Months" | "lastYear" | "custom";

type InsightDirection = "up" | "down";

interface Insight {
  id: string;
  text: string;
  direction: InsightDirection;
}

interface AnalyticsData {
  totalSpending: number;
  activeSuppliers: number;
  totalDeliveries: number;
  mostPurchasedProduct: string;
  spendingOverTime: { label: string; value: number }[];
  supplierSpending: { name: string; value: number }[];
  topProducts: { name: string; value: number; unit: string }[];
  insights: Insight[];
}

const EMPTY_ANALYTICS_DATA: AnalyticsData = {
  totalSpending: 0,
  activeSuppliers: 0,
  totalDeliveries: 0,
  mostPurchasedProduct: "-",
  spendingOverTime: [],
  supplierSpending: [],
  topProducts: [],
  insights: [],
};

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function AnalyticsPage() {
  const [filter, setFilter] = useState<FilterKey>("last6Months");
  const [customFrom, setCustomFrom] = useState("2025-10-01");
  const [customTo, setCustomTo] = useState("2026-03-31");
  const [activeData, setActiveData] = useState<AnalyticsData>(EMPTY_ANALYTICS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
        const params = new URLSearchParams({ filter });

        if (filter === "custom") {
          params.set("from", customFrom);
          params.set("to", customTo);
        }

        const response = await fetch(`${baseUrl}/api/analytics/summary?${params.toString()}`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.message || "Failed to load analytics data.");
        }

        setActiveData({
          totalSpending: Number(result?.data?.totalSpending || 0),
          activeSuppliers: Number(result?.data?.activeSuppliers || 0),
          totalDeliveries: Number(result?.data?.totalDeliveries || 0),
          mostPurchasedProduct: String(result?.data?.mostPurchasedProduct || "-"),
          spendingOverTime: Array.isArray(result?.data?.spendingOverTime) ? result.data.spendingOverTime : [],
          supplierSpending: Array.isArray(result?.data?.supplierSpending) ? result.data.supplierSpending : [],
          topProducts: Array.isArray(result?.data?.topProducts) ? result.data.topProducts : [],
          insights: Array.isArray(result?.data?.insights) ? result.data.insights : [],
        });
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load analytics data.");
        setActiveData(EMPTY_ANALYTICS_DATA);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    if (filter === "custom") {
      const start = new Date(customFrom);
      const end = new Date(customTo);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
        setError("Please select a valid custom date range.");
        setActiveData(EMPTY_ANALYTICS_DATA);
        setIsLoading(false);
        return () => controller.abort();
      }
    }

    fetchAnalytics();

    return () => controller.abort();
  }, [filter, customFrom, customTo]);

  const spendingLineData = {
    labels: activeData.spendingOverTime.map((item) => item.label),
    datasets: [
      {
        label: "Total Spending",
        data: activeData.spendingOverTime.map((item) => item.value),
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
    labels: activeData.supplierSpending.map((item) => item.name),
    datasets: [
      {
        label: "Supplier Spending",
        data: activeData.supplierSpending.map((item) => item.value),
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
    labels: activeData.topProducts.map((item) => `${item.name} (${item.unit})`),
    datasets: [
      {
        label: "Purchased Quantity",
        data: activeData.topProducts.map((item) => item.value),
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
    <div className="p-6 md:p-8 max-w-400 mx-auto space-y-8">

      {/* Header + Global Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Insights about your purchases, suppliers, and pricing trends.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <CalendarRange className="w-4 h-4 text-gray-400" />
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterKey)}
              className="appearance-none min-w-54 pl-4 pr-10 py-2.5 text-sm font-medium bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-200 shadow-xs hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
            >
              <option value="last7Days">Last 7 Days</option>
              <option value="lastMonth">Last Month</option>
              <option value="last6Months">Last 6 Months</option>
              <option value="lastYear">Last Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-[#1A1D24] dark:text-slate-300">
          Loading analytics from database...
        </div>
      )}

      {filter === "custom" && (
        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              From
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="px-3 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              To
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="px-3 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </label>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spending</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(activeData.totalSpending)}</p>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Suppliers</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeData.activeSuppliers} Suppliers</p>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Deliveries</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10">
              <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeData.totalDeliveries} Deliveries</p>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Purchased Product</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{activeData.mostPurchasedProduct}</p>
        </div>
      </div>

      {/* Spending Over Time */}
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Spending Over Time</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track total spending trend across selected time period.</p>
        </div>
        <div className="h-72">
          {activeData.spendingOverTime.length > 0 ? (
            <Line data={spendingLineData} options={spendingLineOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              No spending data available for selected range.
            </div>
          )}
        </div>
      </div>

      {/* Supplier Spending Comparison */}
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Supplier Spending Comparison</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Compare how spending is distributed across suppliers.</p>
        </div>
        <div className="h-80">
          {activeData.supplierSpending.length > 0 ? (
            <Bar data={supplierBarData} options={supplierBarOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              No supplier spending data available.
            </div>
          )}
        </div>
      </div>

      {/* Top Purchased Products */}
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Top Purchased Products</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Products with highest purchased quantities in selected period.</p>
        </div>
        <div className="h-80">
          {activeData.topProducts.length > 0 ? (
            <Bar data={productHorizontalBarData} options={productHorizontalBarOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              No product purchase data available.
            </div>
          )}
        </div>
      </div>

      {/* Price Change Insights */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Price Change Insights</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Recent price changes detected from suppliers.</p>
        </div>

        {activeData.insights.length > 0 ? (
          <div className="space-y-3">
            {activeData.insights.map((insight) => (
              <div
                key={insight.id}
                className={`flex items-start gap-3 px-4 py-3 rounded-2xl border ${
                  insight.direction === "up"
                    ? "bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20"
                    : "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20"
                }`}
              >
                <div className={`mt-0.5 ${
                  insight.direction === "up"
                    ? "text-red-600 dark:text-red-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}>
                  {insight.direction === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-6 text-sm text-gray-500 dark:text-gray-400">
            No price-change insights available for this time range.
          </div>
        )}
      </div>
    </div>
  );
}
