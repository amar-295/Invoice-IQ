"use client";

import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  Calendar,
  Package,
  Tag,
  FileText,
  ChevronRight,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type RangeKey = "today" | "lastWeek" | "lastMonth" | "last6Months" | "lastYear" | "last2Years" | "last5Years";

interface PurchaseRow {
  id: string;
  date: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  source: string;
}

interface ProductDetail {
  id: string;
  name: string;
  sellerId: string;
  sellerName: string;
  purchases: PurchaseRow[];
}

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "lastWeek", label: "Last Week" },
  { key: "lastMonth", label: "Last Month" },
  { key: "last6Months", label: "Last 6 Months" },
  { key: "lastYear", label: "Last Year" },
  { key: "last2Years", label: "Last 2 Years" },
  { key: "last5Years", label: "Last 5 Years" },
];

const PRODUCT_DATA: Record<string, Record<string, ProductDetail>> = {
  "1": {
    p1: {
      id: "p1",
      name: "Sunflower Oil",
      sellerId: "1",
      sellerName: "Om Trading Co.",
      purchases: [
        { id: "a1", date: "2026-03-15", quantity: 20, unit: "L", pricePerUnit: 140, source: "Invoice Upload" },
        { id: "a2", date: "2026-02-28", quantity: 18, unit: "L", pricePerUnit: 138, source: "Manual Entry" },
        { id: "a3", date: "2026-02-10", quantity: 20, unit: "L", pricePerUnit: 136, source: "Invoice Upload" },
        { id: "a4", date: "2026-01-14", quantity: 16, unit: "L", pricePerUnit: 132, source: "Invoice Upload" },
        { id: "a5", date: "2025-12-12", quantity: 15, unit: "L", pricePerUnit: 129, source: "Invoice Upload" },
      ],
    },
    p2: {
      id: "p2",
      name: "Mustard Oil",
      sellerId: "1",
      sellerName: "Om Trading Co.",
      purchases: [
        { id: "b1", date: "2026-03-15", quantity: 10, unit: "L", pricePerUnit: 175, source: "Invoice Upload" },
        { id: "b2", date: "2026-03-01", quantity: 10, unit: "L", pricePerUnit: 168, source: "Invoice Upload" },
        { id: "b3", date: "2026-02-14", quantity: 8, unit: "L", pricePerUnit: 165, source: "Manual Entry" },
        { id: "b4", date: "2026-01-10", quantity: 10, unit: "L", pricePerUnit: 162, source: "Invoice Upload" },
      ],
    },
    p3: {
      id: "p3",
      name: "Groundnut Oil",
      sellerId: "1",
      sellerName: "Om Trading Co.",
      purchases: [
        { id: "c1", date: "2026-03-08", quantity: 15, unit: "L", pricePerUnit: 160, source: "Invoice Upload" },
        { id: "c2", date: "2026-02-08", quantity: 15, unit: "L", pricePerUnit: 157, source: "Invoice Upload" },
        { id: "c3", date: "2026-01-07", quantity: 12, unit: "L", pricePerUnit: 154, source: "Manual Entry" },
      ],
    },
    p4: {
      id: "p4",
      name: "Ghee (Tin)",
      sellerId: "1",
      sellerName: "Om Trading Co.",
      purchases: [
        { id: "d1", date: "2026-03-01", quantity: 5, unit: "kg", pricePerUnit: 580, source: "Invoice Upload" },
        { id: "d2", date: "2026-02-01", quantity: 5, unit: "kg", pricePerUnit: 565, source: "Invoice Upload" },
        { id: "d3", date: "2026-01-01", quantity: 4, unit: "kg", pricePerUnit: 552, source: "Manual Entry" },
      ],
    },
  },
  "2": {
    p1: {
      id: "p1",
      name: "Basmati Rice",
      sellerId: "2",
      sellerName: "Bharat Distributors",
      purchases: [
        { id: "e1", date: "2026-03-12", quantity: 50, unit: "kg", pricePerUnit: 120, source: "Invoice Upload" },
        { id: "e2", date: "2026-02-25", quantity: 45, unit: "kg", pricePerUnit: 115, source: "Invoice Upload" },
        { id: "e3", date: "2026-01-28", quantity: 40, unit: "kg", pricePerUnit: 112, source: "Manual Entry" },
        { id: "e4", date: "2025-12-20", quantity: 45, unit: "kg", pricePerUnit: 109, source: "Invoice Upload" },
      ],
    },
    p2: {
      id: "p2",
      name: "Toor Dal",
      sellerId: "2",
      sellerName: "Bharat Distributors",
      purchases: [
        { id: "f1", date: "2026-03-12", quantity: 25, unit: "kg", pricePerUnit: 145, source: "Invoice Upload" },
        { id: "f2", date: "2026-02-12", quantity: 24, unit: "kg", pricePerUnit: 141, source: "Invoice Upload" },
        { id: "f3", date: "2026-01-10", quantity: 22, unit: "kg", pricePerUnit: 136, source: "Manual Entry" },
      ],
    },
    p3: {
      id: "p3",
      name: "Wheat Flour",
      sellerId: "2",
      sellerName: "Bharat Distributors",
      purchases: [
        { id: "g1", date: "2026-03-05", quantity: 100, unit: "kg", pricePerUnit: 38, source: "Invoice Upload" },
        { id: "g2", date: "2026-02-05", quantity: 95, unit: "kg", pricePerUnit: 37, source: "Invoice Upload" },
      ],
    },
    p4: {
      id: "p4",
      name: "Sugar",
      sellerId: "2",
      sellerName: "Bharat Distributors",
      purchases: [
        { id: "h1", date: "2026-02-28", quantity: 50, unit: "kg", pricePerUnit: 42, source: "Invoice Upload" },
        { id: "h2", date: "2026-01-28", quantity: 50, unit: "kg", pricePerUnit: 45, source: "Manual Entry" },
        { id: "h3", date: "2025-12-15", quantity: 45, unit: "kg", pricePerUnit: 44, source: "Invoice Upload" },
      ],
    },
    p5: {
      id: "p5",
      name: "Chana Dal",
      sellerId: "2",
      sellerName: "Bharat Distributors",
      purchases: [
        { id: "i1", date: "2026-02-20", quantity: 30, unit: "kg", pricePerUnit: 92, source: "Invoice Upload" },
        { id: "i2", date: "2026-01-18", quantity: 28, unit: "kg", pricePerUnit: 90, source: "Invoice Upload" },
      ],
    },
  },
  "3": {
    p1: {
      id: "p1",
      name: "Full Cream Milk",
      sellerId: "3",
      sellerName: "Sai Dairy Products",
      purchases: [
        { id: "j1", date: "2026-03-10", quantity: 100, unit: "L", pricePerUnit: 58, source: "Invoice Upload" },
        { id: "j2", date: "2026-02-10", quantity: 95, unit: "L", pricePerUnit: 60, source: "Invoice Upload" },
      ],
    },
    p2: {
      id: "p2",
      name: "Paneer",
      sellerId: "3",
      sellerName: "Sai Dairy Products",
      purchases: [
        { id: "k1", date: "2026-03-10", quantity: 10, unit: "kg", pricePerUnit: 340, source: "Invoice Upload" },
        { id: "k2", date: "2026-02-10", quantity: 10, unit: "kg", pricePerUnit: 360, source: "Invoice Upload" },
        { id: "k3", date: "2026-01-10", quantity: 9, unit: "kg", pricePerUnit: 355, source: "Manual Entry" },
      ],
    },
    p3: {
      id: "p3",
      name: "Curd (Dahi)",
      sellerId: "3",
      sellerName: "Sai Dairy Products",
      purchases: [
        { id: "l1", date: "2026-03-08", quantity: 20, unit: "kg", pricePerUnit: 65, source: "Invoice Upload" },
        { id: "l2", date: "2026-02-08", quantity: 18, unit: "kg", pricePerUnit: 66, source: "Invoice Upload" },
      ],
    },
  },
};

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMonthLabel(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function isDateInRange(date: Date, range: RangeKey) {
  const now = new Date();
  const start = new Date(now);

  if (range === "today") {
    return date.toDateString() === now.toDateString();
  }
  if (range === "lastWeek") {
    start.setDate(now.getDate() - 7);
    return date >= start && date <= now;
  }
  if (range === "lastMonth") {
    start.setMonth(now.getMonth() - 1);
    return date >= start && date <= now;
  }
  if (range === "last6Months") {
    start.setMonth(now.getMonth() - 6);
    return date >= start && date <= now;
  }
  if (range === "lastYear") {
    start.setFullYear(now.getFullYear() - 1);
    return date >= start && date <= now;
  }
  if (range === "last2Years") {
    start.setFullYear(now.getFullYear() - 2);
    return date >= start && date <= now;
  }

  start.setFullYear(now.getFullYear() - 5);
  return date >= start && date <= now;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = use(params);
  const [activeRange, setActiveRange] = useState<RangeKey>("last6Months");
  const [selectedMonth, setSelectedMonth] = useState("");

  const product = PRODUCT_DATA[id]?.[productId];

  const purchases = useMemo(() => product?.purchases ?? [], [product]);

  const filteredPurchases = useMemo(() => {
    const sorted = [...purchases].sort((a, b) => b.date.localeCompare(a.date));

    if (selectedMonth) {
      return sorted.filter((row) => row.date.startsWith(selectedMonth));
    }

    return sorted.filter((row) => isDateInRange(new Date(row.date), activeRange));
  }, [purchases, activeRange, selectedMonth]);

  const chartBaseData = selectedMonth ? filteredPurchases : purchases;
  const chartRows = [...chartBaseData].sort((a, b) => a.date.localeCompare(b.date));

  const chartData = {
    labels: chartRows.map((row) => formatMonthLabel(row.date)),
    datasets: [
      {
        label: "Price per Unit",
        data: chartRows.map((row) => row.pricePerUnit),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 5,
        fill: false,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const yValue = context.parsed.y ?? 0;
            return `₹${yValue} / unit`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `₹${value}`,
        },
        grid: {
          color: "rgba(148, 163, 184, 0.15)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (!product) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Product not found.</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This product was not found for the selected seller.</p>
        <Link
          href={`/home/seller/${id}`}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Seller
        </Link>
      </div>
    );
  }

  const totalRowPrice = (row: PurchaseRow) => row.quantity * row.pricePerUnit;

  return (
    <div className="p-6 md:p-8 max-w-400 mx-auto space-y-8">

      {/* Header */}
      <div>
        <Link
          href={`/home/seller/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Seller
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {product.name}
        </h1>

        <div className="mt-2 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2">
          <Store className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-600 dark:text-gray-300">Supplier:</span>
          <span>{product.sellerName}</span>
        </div>
      </div>

      {/* Purchase History Controls */}
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Purchase History</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Filter delivery records by time range or specific month.</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Time Range</p>
          <div className="flex flex-wrap gap-2">
            {RANGE_OPTIONS.map((option) => {
              const isActive = !selectedMonth && activeRange === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => {
                    setActiveRange(option.key);
                    setSelectedMonth("");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30"
                      : "bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Select Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <p className="text-xs text-gray-400">Selecting a month automatically disables time-range filters.</p>
        </div>
      </div>

      {/* Purchase Table */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Purchase History Table</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Latest delivery and purchase events for this product.</p>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
          <div className="max-h-95 overflow-auto">
            <div className="min-w-190">
              <div className="grid grid-cols-[140px_100px_80px_140px_130px_140px] items-center px-6 py-3 border-b border-gray-100 dark:border-white/5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                <span>Date</span>
                <span>Quantity</span>
                <span>Unit</span>
                <span>Price / Unit</span>
                <span>Total Price</span>
                <span>Source</span>
              </div>

              {filteredPurchases.map((row, index) => (
                <div
                  key={row.id}
                  className={`grid grid-cols-[140px_100px_80px_140px_130px_140px] items-center px-6 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/3 transition-colors ${
                    index !== 0 ? "border-t border-gray-100 dark:border-white/5" : ""
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {formatDate(row.date)}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <Package className="w-3.5 h-3.5 text-gray-400" />
                    {row.quantity}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">{row.unit}</span>
                  <span className="flex items-center gap-1.5 text-gray-900 dark:text-white font-medium">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    ₹{row.pricePerUnit}
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">₹{totalRowPrice(row)}</span>
                  <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    {row.source}
                  </span>
                </div>
              ))}

              {filteredPurchases.length === 0 && (
                <div className="py-16 px-6 text-center">
                  <Package className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">No purchases found for current filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price Trend */}
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Price Trend</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Price movement from first recorded purchase to most recent purchase.</p>
        </div>

        <div className="h-70">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Need deeper history?</span>
          <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
            View Details
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
