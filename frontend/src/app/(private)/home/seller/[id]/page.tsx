
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Truck,
  Package,
  Calendar,
  Tag,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Star,
  Phone,
  Building2,
  FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  lastPurchaseDate: string;
  lastQuantity: string;
  lastPrice: string;
  unit: string;
}

interface PriceInsight {
  id: string;
  product: string;
  direction: "up" | "down";
  change: string;
  description: string;
}

interface SellerDetail {
  id: string;
  _id?: string;
  name: string;
  address: string;
  mobile: string;
  nickname?: string;
  notes?: string;
  isFavorite?: boolean;
  totalSpend: string;
  totalDeliveries: number;
  totalProducts: number;
  products: Product[];
  insights: PriceInsight[];
}

const getSellerLocation = (address: string): string => {
  const firstSegment = address.split(",")[0]?.trim();
  return firstSegment || "—";
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 shadow-xs hover:shadow-sm transition-shadow">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SellerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [seller, setSeller] = useState<SellerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const extractAndFetch = async () => {
      try {
        const { id } = await params;
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
        const response = await fetch(
          `${baseUrl}/api/sellerManagement/getSeller/${id}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch seller");
        }

        const data = await response.json();
        const sellerData = data.data;

        if (sellerData) {
          const transformedSeller: SellerDetail = {
            id: sellerData._id || id,
            name: sellerData.name,
            address: sellerData.address || "—",
            mobile: sellerData.mobile || "",
            nickname: sellerData.nickname || "",
            notes: sellerData.notes || "",
            isFavorite: sellerData.isFavorite || false,
            totalSpend: "₹0", // From dashboard data
            totalDeliveries: 0, // From deliveries
            totalProducts: 0, // From products
            products: [],
            insights: [],
          };

          setSeller(transformedSeller);
        } else {
          toast.error("Seller not found");
        }
      } catch (error) {
        console.error("Error fetching seller:", error);
        toast.error("Failed to load seller details");
      } finally {
        setIsLoading(false);
      }
    };

    extractAndFetch();
  }, [params]);
  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Loading seller details...</h2>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Seller not found.</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This seller does not exist or was removed.</p>
        <Link
          href="/home/seller"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sellers
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-400 mx-auto space-y-8">

      {/* ── Back + Header ──────────────────────────────────────── */}
      <div>
        <Link
          href="/home/seller"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors mb-5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Sellers
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {seller.name}
              </h1>
              {seller.isFavorite && (
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              {seller.address && seller.address !== "—" && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {getSellerLocation(seller.address)}
                </span>
              )}
              {seller.mobile && seller.mobile !== "—" && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {seller.mobile}
                </span>
              )}
              {seller.address && seller.address !== "—" && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  {seller.address}
                </span>
              )}
              {seller.nickname && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-white/10 dark:text-gray-300">
                  {seller.nickname}
                </span>
              )}
            </div>

            {seller.notes && (
              <div className="flex items-start gap-1.5 mt-3 max-w-xl">
                <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{seller.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          label="Total Spend"
          value={seller.totalSpend}
        />
        <StatCard
          icon={<Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          label="Total Deliveries"
          value={`${seller.totalDeliveries} Deliveries`}
        />
        <StatCard
          icon={<Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          label="Total Products"
          value={`${seller.totalProducts} Products`}
        />
      </div>

      {/* ── Products Section ───────────────────────────────────── */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Products Purchased</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Products purchased from this seller and their latest delivery details.
          </p>
        </div>

        {seller.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xs">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">No products recorded yet.</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center max-w-xs">
              Add deliveries to start tracking purchase history.
            </p>
            <button className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#1E3A8A] to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
              <Truck className="w-4 h-4" />
              Add Delivery
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[1fr_160px_120px_140px_100px] items-center px-6 py-3 border-b border-gray-100 dark:border-white/5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Product</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Last Purchase</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Qty</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Price</span>
              <span />
            </div>

            {seller.products.map((product, index) => (
              <div
                key={product.id}
                className={`group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_160px_120px_140px_100px] items-center gap-3 px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors ${
                  index !== 0 ? "border-t border-gray-100 dark:border-white/5" : ""
                }`}
              >
                {/* Product Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center">
                    <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</span>
                </div>

                {/* Last Purchase Date */}
                <div className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {product.lastPurchaseDate}
                </div>

                {/* Quantity */}
                <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
                  {product.lastQuantity}
                </div>

                {/* Price */}
                <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                  <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {product.lastPrice}
                </div>

                {/* Action */}
                <div className="flex justify-end">
                  <Link
                    href={`/home/seller/${seller.id}/product/${product.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors group-hover:shadow-xs"
                  >
                    View Details
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Price Insights ─────────────────────────────────────── */}
      {seller.insights.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Price Insights</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Recent price changes detected from this seller.
            </p>
          </div>

          <div className="space-y-3">
            {seller.insights.map((insight) => (
              <div
                key={insight.id}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${
                  insight.direction === "up"
                    ? "bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/15"
                    : "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/15"
                }`}
              >
                <div
                  className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                    insight.direction === "up"
                      ? "bg-red-100 dark:bg-red-500/15"
                      : "bg-emerald-100 dark:bg-emerald-500/15"
                  }`}
                >
                  {insight.direction === "up" ? (
                    <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${
                    insight.direction === "up"
                      ? "text-red-700 dark:text-red-400"
                      : "text-emerald-700 dark:text-emerald-400"
                  }`}>
                    {insight.product}
                    <span className="ml-2 font-bold">{insight.change}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
