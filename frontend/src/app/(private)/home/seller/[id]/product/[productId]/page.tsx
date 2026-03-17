"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Store,
  Calendar,
  Package,
  Tag,
  FileText,
  ChevronRight,
  User,
  Wallet,
  Activity,
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
  quantityLabel?: string;
  unit: string;
  totalPrice: number;
  priceLabel?: string;
  pricePerUnit: number;
  source: string;
}

interface Ally {
  name: string;
}

interface ProductAnalytics {
  totalPurchases: number;
  totalSpend: number;
  totalQuantity: number;
  averagePricePerUnit: number;
  latestPurchaseDate: string | null;
  latestPurchasePricePerUnit: number | null;
  availableMonths: string[];
}

interface ProductDetail {
  id: string;
  name: string;
  sellerId: string;
  sellerName: string;
  unit: string;
  normalizedName: string;
  allies: Ally[];
  purchases: PurchaseRow[];
  analytics: ProductAnalytics;
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

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCompactQuantity(value: number, unit: string) {
  return `${value} ${unit}`.trim();
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
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
        const response = await fetch(`${baseUrl}/api/product/${id}/${productId}`, {
          credentials: "include",
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.message || "Failed to fetch product details.");
        }

        setProduct(result?.data || null);
      } catch (error) {
        console.error("Error fetching product detail:", error);
        toast.error(error instanceof Error ? error.message : "Failed to load product details.");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, productId]);

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

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Loading product details...</h2>
      </div>
    );
  }

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

  const totalRowPrice = (row: PurchaseRow) => row.totalPrice;

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

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2">
            <Store className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-600 dark:text-gray-300">Supplier:</span>
            <span>{product.sellerName}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-600 dark:text-gray-300">Unit:</span>
            <span>{product.unit}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-600 dark:text-gray-300">Normalized:</span>
            <span>{product.normalizedName}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-600 dark:text-gray-300">Aliases:</span>
            <span>{product.allies.length ? product.allies.map((ally) => ally.name).join(", ") : "—"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xs dark:border-white/10 dark:bg-[#1A1D24]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Total Deliveries</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{product.analytics.totalPurchases}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xs dark:border-white/10 dark:bg-[#1A1D24]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Total Spend</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(product.analytics.totalSpend)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xs dark:border-white/10 dark:bg-[#1A1D24]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
              <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Total Quantity</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCompactQuantity(product.analytics.totalQuantity, product.unit)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xs dark:border-white/10 dark:bg-[#1A1D24]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
              <Tag className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Avg Price / Unit</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(product.analytics.averagePricePerUnit)}</p>
            </div>
          </div>
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
          {product.analytics.availableMonths.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Available months: {product.analytics.availableMonths.join(", ")}
            </p>
          )}
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
                    {row.quantityLabel || row.quantity}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">{row.unit}</span>
                  <span className="flex items-center gap-1.5 text-gray-900 dark:text-white font-medium">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    {formatCurrency(row.pricePerUnit)}
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">{formatCurrency(totalRowPrice(row))}</span>
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

        {chartRows.length > 0 ? (
          <div className="h-70">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="flex h-70 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
            No chart data available for the selected range.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Latest purchase: {product.analytics.latestPurchaseDate ? `${formatDate(product.analytics.latestPurchaseDate)} at ${formatCurrency(product.analytics.latestPurchasePricePerUnit || 0)}/unit` : "No purchases yet"}
          </span>
          <Link
            href={`/home/seller/${id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
          >
            Back to Seller
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
