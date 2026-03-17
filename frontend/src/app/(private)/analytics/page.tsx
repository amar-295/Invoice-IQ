"use client";

import React, { useMemo, useState } from "react";
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

const BASE_MONTHLY_SPENDING = [
  { date: "2025-04-01", label: "Apr", value: 16500 },
  { date: "2025-05-01", label: "May", value: 18200 },
  { date: "2025-06-01", label: "Jun", value: 17400 },
  { date: "2025-07-01", label: "Jul", value: 19600 },
  { date: "2025-08-01", label: "Aug", value: 21500 },
  { date: "2025-09-01", label: "Sep", value: 23200 },
  { date: "2025-10-01", label: "Oct", value: 24800 },
  { date: "2025-11-01", label: "Nov", value: 22100 },
  { date: "2025-12-01", label: "Dec", value: 25900 },
  { date: "2026-01-01", label: "Jan", value: 20000 },
  { date: "2026-02-01", label: "Feb", value: 18500 },
  { date: "2026-03-01", label: "Mar", value: 27000 },
];

const RANGE_DATA: Record<Exclude<FilterKey, "custom">, AnalyticsData> = {
  last7Days: {
    totalSpending: 21450,
    activeSuppliers: 5,
    totalDeliveries: 9,
    mostPurchasedProduct: "Milk",
    spendingOverTime: [
      { label: "Mon", value: 2800 },
      { label: "Tue", value: 3100 },
      { label: "Wed", value: 2450 },
      { label: "Thu", value: 3650 },
      { label: "Fri", value: 2900 },
      { label: "Sat", value: 3320 },
      { label: "Sun", value: 3230 },
    ],
    supplierSpending: [
      { name: "Sharma Traders", value: 7200 },
      { name: "Gupta Suppliers", value: 5600 },
      { name: "Sai Dairy", value: 4800 },
      { name: "Laxmi Spices", value: 2150 },
      { name: "Om Trading", value: 1700 },
    ],
    topProducts: [
      { name: "Milk", value: 120, unit: "L" },
      { name: "Rice", value: 95, unit: "kg" },
      { name: "Sugar", value: 62, unit: "kg" },
      { name: "Oil", value: 45, unit: "L" },
    ],
    insights: [
      { id: "w1", text: "Mustard Oil price increased by ₹10/L since last purchase", direction: "up" },
      { id: "w2", text: "Sugar price decreased by ₹2/kg from Gupta Suppliers", direction: "down" },
      { id: "w3", text: "Basmati Rice price increased by ₹4/kg this week", direction: "up" },
    ],
  },
  lastMonth: {
    totalSpending: 68200,
    activeSuppliers: 7,
    totalDeliveries: 21,
    mostPurchasedProduct: "Basmati Rice",
    spendingOverTime: [
      { label: "Week 1", value: 15200 },
      { label: "Week 2", value: 17400 },
      { label: "Week 3", value: 16300 },
      { label: "Week 4", value: 19300 },
    ],
    supplierSpending: [
      { name: "Sharma Traders", value: 22000 },
      { name: "Gupta Suppliers", value: 16400 },
      { name: "Verma Wholesalers", value: 12100 },
      { name: "Sai Dairy", value: 9800 },
      { name: "Om Trading", value: 7900 },
    ],
    topProducts: [
      { name: "Rice", value: 220, unit: "kg" },
      { name: "Sugar", value: 145, unit: "kg" },
      { name: "Dal", value: 120, unit: "kg" },
      { name: "Oil", value: 90, unit: "L" },
    ],
    insights: [
      { id: "m1", text: "Basmati Rice price increased by ₹15/kg compared to last month", direction: "up" },
      { id: "m2", text: "Sugar price decreased by ₹2/kg from Gupta Suppliers", direction: "down" },
      { id: "m3", text: "Mustard Oil price increased by ₹10/L since last purchase", direction: "up" },
    ],
  },
  last6Months: {
    totalSpending: 145000,
    activeSuppliers: 8,
    totalDeliveries: 42,
    mostPurchasedProduct: "Basmati Rice",
    spendingOverTime: [
      { label: "Oct", value: 24800 },
      { label: "Nov", value: 22100 },
      { label: "Dec", value: 25900 },
      { label: "Jan", value: 20000 },
      { label: "Feb", value: 18500 },
      { label: "Mar", value: 27000 },
    ],
    supplierSpending: [
      { name: "Sharma Traders", value: 40000 },
      { name: "Gupta Suppliers", value: 25000 },
      { name: "Verma Wholesalers", value: 18000 },
      { name: "Sai Dairy", value: 22000 },
      { name: "Om Trading", value: 21000 },
      { name: "Laxmi Spices", value: 9000 },
    ],
    topProducts: [
      { name: "Rice", value: 500, unit: "kg" },
      { name: "Sugar", value: 320, unit: "kg" },
      { name: "Dal", value: 210, unit: "kg" },
      { name: "Oil", value: 180, unit: "L" },
    ],
    insights: [
      { id: "s1", text: "Mustard Oil price increased by ₹10/L since last purchase", direction: "up" },
      { id: "s2", text: "Basmati Rice price increased by ₹15/kg compared to last month", direction: "up" },
      { id: "s3", text: "Sugar price decreased by ₹2/kg from Gupta Suppliers", direction: "down" },
      { id: "s4", text: "Toor Dal price increased by ₹8/kg in March deliveries", direction: "up" },
    ],
  },
  lastYear: {
    totalSpending: 271700,
    activeSuppliers: 11,
    totalDeliveries: 88,
    mostPurchasedProduct: "Basmati Rice",
    spendingOverTime: BASE_MONTHLY_SPENDING.map((month) => ({
      label: month.label,
      value: month.value,
    })),
    supplierSpending: [
      { name: "Sharma Traders", value: 74200 },
      { name: "Gupta Suppliers", value: 50100 },
      { name: "Verma Wholesalers", value: 33000 },
      { name: "Sai Dairy", value: 39000 },
      { name: "Om Trading", value: 42800 },
      { name: "Laxmi Spices", value: 19200 },
      { name: "Bharat Distributors", value: 13400 },
    ],
    topProducts: [
      { name: "Rice", value: 910, unit: "kg" },
      { name: "Sugar", value: 610, unit: "kg" },
      { name: "Dal", value: 520, unit: "kg" },
      { name: "Oil", value: 420, unit: "L" },
      { name: "Milk", value: 380, unit: "L" },
    ],
    insights: [
      { id: "y1", text: "Mustard Oil price increased by ₹10/L since last purchase", direction: "up" },
      { id: "y2", text: "Basmati Rice price increased by ₹15/kg compared to last month", direction: "up" },
      { id: "y3", text: "Sugar price decreased by ₹2/kg from Gupta Suppliers", direction: "down" },
      { id: "y4", text: "Milk price decreased by ₹1/L from Sai Dairy", direction: "down" },
      { id: "y5", text: "Ghee price increased by ₹30/kg in festival season", direction: "up" },
    ],
  },
};

function buildCustomData(startDate: string, endDate: string): AnalyticsData {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const validRange =
    !Number.isNaN(start.getTime()) &&
    !Number.isNaN(end.getTime()) &&
    start <= end;

  if (!validRange) {
    return RANGE_DATA.last6Months;
  }

  const filteredMonths = BASE_MONTHLY_SPENDING.filter((month) => {
    const date = new Date(month.date);
    return date >= start && date <= end;
  });

  if (!filteredMonths.length) {
    return {
      totalSpending: 0,
      activeSuppliers: 0,
      totalDeliveries: 0,
      mostPurchasedProduct: "—",
      spendingOverTime: [],
      supplierSpending: [],
      topProducts: [],
      insights: [],
    };
  }

  const totalSpending = filteredMonths.reduce((sum, month) => sum + month.value, 0);
  const monthFactor = filteredMonths.length / 12;

  return {
    totalSpending,
    activeSuppliers: Math.max(2, Math.round(11 * monthFactor)),
    totalDeliveries: Math.max(4, Math.round(88 * monthFactor)),
    mostPurchasedProduct: "Basmati Rice",
    spendingOverTime: filteredMonths.map((month) => ({
      label: month.label,
      value: month.value,
    })),
    supplierSpending: [
      { name: "Sharma Traders", value: Math.round(74200 * monthFactor) },
      { name: "Gupta Suppliers", value: Math.round(50100 * monthFactor) },
      { name: "Verma Wholesalers", value: Math.round(33000 * monthFactor) },
      { name: "Sai Dairy", value: Math.round(39000 * monthFactor) },
      { name: "Om Trading", value: Math.round(42800 * monthFactor) },
    ].filter((supplier) => supplier.value > 0),
    topProducts: [
      { name: "Rice", value: Math.round(910 * monthFactor), unit: "kg" },
      { name: "Sugar", value: Math.round(610 * monthFactor), unit: "kg" },
      { name: "Dal", value: Math.round(520 * monthFactor), unit: "kg" },
      { name: "Oil", value: Math.round(420 * monthFactor), unit: "L" },
    ].filter((product) => product.value > 0),
    insights: [
      { id: "c1", text: "Mustard Oil price increased by ₹10/L since last purchase", direction: "up" },
      { id: "c2", text: "Sugar price decreased by ₹2/kg from Gupta Suppliers", direction: "down" },
      { id: "c3", text: "Basmati Rice price increased by ₹15/kg compared to last month", direction: "up" },
    ],
  };
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function AnalyticsPage() {
  const [filter, setFilter] = useState<FilterKey>("last6Months");
  const [customFrom, setCustomFrom] = useState("2025-10-01");
  const [customTo, setCustomTo] = useState("2026-03-31");

  const activeData = useMemo(() => {
    if (filter === "custom") {
      return buildCustomData(customFrom, customTo);
    }
    return RANGE_DATA[filter];
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
          <Line data={spendingLineData} options={spendingLineOptions} />
        </div>
      </div>

      {/* Supplier Spending Comparison */}
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Supplier Spending Comparison</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Compare how spending is distributed across suppliers.</p>
        </div>
        <div className="h-80">
          <Bar data={supplierBarData} options={supplierBarOptions} />
        </div>
      </div>

      {/* Top Purchased Products */}
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Top Purchased Products</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Products with highest purchased quantities in selected period.</p>
        </div>
        <div className="h-80">
          <Bar data={productHorizontalBarData} options={productHorizontalBarOptions} />
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
