import { headers } from "next/headers";
import {
  Wallet,
  Store,
  Truck,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AnalyticsCharts from "@/components/Analytics/AnalyticsCharts";
import CustomFilter from "@/components/Analytics/CustomFilter";
import {
  EMPTY_ANALYTICS_DATA,
  type AnalyticsData,
  type FilterKey,
} from "@/components/Analytics/types";

interface AnalyticsPageProps {
  searchParams: Promise<{
    filter?: string;
    from?: string;
    to?: string;
  }>;
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function normalizeFilter(value?: string): FilterKey {
  if (
    value === "last7Days" ||
    value === "lastMonth" ||
    value === "last6Months" ||
    value === "lastYear" ||
    value === "custom"
  ) {
    return value;
  }

  return "last6Months";
}

async function getAnalyticsData(
  filter: FilterKey,
  from: string,
  to: string,
): Promise<{ data: AnalyticsData; error: string | null }> {
  if (filter === "custom") {
    const start = new Date(from);
    const end = new Date(to);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start > end
    ) {
      return {
        data: EMPTY_ANALYTICS_DATA,
        error: "Please select a valid custom date range.",
      };
    }
  }

  try {
    const incomingHeaders = await headers();
    const cookieHeader = incomingHeaders.get("cookie") || "";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
    const params = new URLSearchParams({ filter });

    if (filter === "custom") {
      params.set("from", from);
      params.set("to", to);
    }

    const response = await fetch(
      `${baseUrl}/api/analytics/summary?${params.toString()}`,
      {
        method: "GET",
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to load analytics data.");
    }

    return {
      data: {
        totalSpending: Number(result?.data?.totalSpending || 0),
        activeSuppliers: Number(result?.data?.activeSuppliers || 0),
        totalDeliveries: Number(result?.data?.totalDeliveries || 0),
        mostPurchasedProduct: String(result?.data?.mostPurchasedProduct || "-"),
        spendingOverTime: Array.isArray(result?.data?.spendingOverTime)
          ? result.data.spendingOverTime
          : [],
        supplierSpending: Array.isArray(result?.data?.supplierSpending)
          ? result.data.supplierSpending
          : [],
        topProducts: Array.isArray(result?.data?.topProducts)
          ? result.data.topProducts
          : [],
        insights: Array.isArray(result?.data?.insights)
          ? result.data.insights
          : [],
      },
      error: null,
    };
  } catch (error) {
    return {
      data: EMPTY_ANALYTICS_DATA,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load analytics data.",
    };
  }
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const params = await searchParams;
  const filter = normalizeFilter(params.filter);
  const customFrom = params.from || "2025-10-01";
  const customTo = params.to || "2026-03-31";

  const { data: activeData, error } = await getAnalyticsData(
    filter,
    customFrom,
    customTo,
  );

  return (
    <div className="p-6 md:p-8 max-w-400 mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Insights about your purchases, suppliers, and pricing trends.
          </p>
        </div>

        <CustomFilter
          filter={filter}
          customFrom={customFrom}
          customTo={customTo}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Spending
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(activeData.totalSpending)}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Active Suppliers
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeData.activeSuppliers} Suppliers
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Deliveries
            </span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10">
              <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeData.totalDeliveries} Deliveries
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Most Purchased Product
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {activeData.mostPurchasedProduct}
          </p>
        </div>
      </div>

      <AnalyticsCharts data={activeData} />

      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Price Change Insights
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Recent price changes detected from suppliers.
          </p>
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
                <div
                  className={`mt-0.5 ${
                    insight.direction === "up"
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {insight.direction === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {insight.text}
                </p>
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
