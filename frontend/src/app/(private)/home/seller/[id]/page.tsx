
"use client";

import React, { use } from "react";
import Link from "next/link";
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
  name: string;
  location: string;
  address: string;
  contact: string;
  nickname: string;
  notes: string;
  isFavorite: boolean;
  totalSpend: string;
  totalDeliveries: number;
  totalProducts: number;
  products: Product[];
  insights: PriceInsight[];
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const SELLER_DATA: Record<string, SellerDetail> = {
  "1": {
    id: "1",
    name: "Om Trading Co.",
    location: "Dadar, Mumbai",
    address: "Shop 4, Gokhale Road, Dadar West, Mumbai - 400028",
    contact: "+91 98201 12345",
    nickname: "Om Bhai",
    notes: "Delivers every Monday and Thursday.",
    isFavorite: true,
    totalSpend: "₹1,02,500",
    totalDeliveries: 38,
    totalProducts: 12,
    products: [
      { id: "p1", name: "Sunflower Oil", lastPurchaseDate: "Mar 15, 2026", lastQuantity: "20 L", lastPrice: "₹140 / L", unit: "L" },
      { id: "p2", name: "Mustard Oil", lastPurchaseDate: "Mar 15, 2026", lastQuantity: "10 L", lastPrice: "₹175 / L", unit: "L" },
      { id: "p3", name: "Groundnut Oil", lastPurchaseDate: "Mar 08, 2026", lastQuantity: "15 L", lastPrice: "₹160 / L", unit: "L" },
      { id: "p4", name: "Ghee (Tin)", lastPurchaseDate: "Mar 01, 2026", lastQuantity: "5 kg", lastPrice: "₹580 / kg", unit: "kg" },
    ],
    insights: [
      { id: "i1", product: "Mustard Oil", direction: "up", change: "+₹10", description: "Price increased by ₹10 since last purchase." },
      { id: "i2", product: "Sunflower Oil", direction: "down", change: "−₹5", description: "Price decreased by ₹5 this month." },
      { id: "i3", product: "Ghee (Tin)", direction: "up", change: "+₹30", description: "Price increased by ₹30 compared to last month." },
    ],
  },
  "2": {
    id: "2",
    name: "Bharat Distributors",
    location: "Vashi, Navi Mumbai",
    address: "Plot 22, Sector 19A, Vashi, Navi Mumbai - 400703",
    contact: "+91 99870 56789",
    nickname: "",
    notes: "",
    isFavorite: false,
    totalSpend: "₹2,14,800",
    totalDeliveries: 54,
    totalProducts: 18,
    products: [
      { id: "p1", name: "Basmati Rice", lastPurchaseDate: "Mar 12, 2026", lastQuantity: "50 kg", lastPrice: "₹120 / kg", unit: "kg" },
      { id: "p2", name: "Toor Dal", lastPurchaseDate: "Mar 12, 2026", lastQuantity: "25 kg", lastPrice: "₹145 / kg", unit: "kg" },
      { id: "p3", name: "Wheat Flour", lastPurchaseDate: "Mar 05, 2026", lastQuantity: "100 kg", lastPrice: "₹38 / kg", unit: "kg" },
      { id: "p4", name: "Sugar", lastPurchaseDate: "Feb 28, 2026", lastQuantity: "50 kg", lastPrice: "₹42 / kg", unit: "kg" },
      { id: "p5", name: "Chana Dal", lastPurchaseDate: "Feb 20, 2026", lastQuantity: "30 kg", lastPrice: "₹92 / kg", unit: "kg" },
    ],
    insights: [
      { id: "i1", product: "Basmati Rice", direction: "up", change: "+₹15", description: "Price increased by ₹15 compared to last month." },
      { id: "i2", product: "Sugar", direction: "down", change: "−₹3", description: "Price decreased by ₹3 since last purchase." },
      { id: "i3", product: "Toor Dal", direction: "up", change: "+₹8", description: "Price increased by ₹8 this week." },
    ],
  },
  "3": {
    id: "3",
    name: "Sai Dairy Products",
    location: "Thane West",
    address: "Near Panchpakhadi, Thane West - 400601",
    contact: "+91 98330 44321",
    nickname: "Sai Doodh",
    notes: "",
    isFavorite: true,
    totalSpend: "₹68,250",
    totalDeliveries: 22,
    totalProducts: 8,
    products: [
      { id: "p1", name: "Full Cream Milk", lastPurchaseDate: "Mar 10, 2026", lastQuantity: "100 L", lastPrice: "₹58 / L", unit: "L" },
      { id: "p2", name: "Paneer", lastPurchaseDate: "Mar 10, 2026", lastQuantity: "10 kg", lastPrice: "₹340 / kg", unit: "kg" },
      { id: "p3", name: "Curd (Dahi)", lastPurchaseDate: "Mar 08, 2026", lastQuantity: "20 kg", lastPrice: "₹65 / kg", unit: "kg" },
    ],
    insights: [
      { id: "i1", product: "Paneer", direction: "down", change: "−₹20", description: "Price decreased by ₹20 this month." },
      { id: "i2", product: "Full Cream Milk", direction: "down", change: "−₹2", description: "Price slightly decreased by ₹2 per litre." },
    ],
  },
  "4": {
    id: "4",
    name: "Laxmi Spices",
    location: "Kurla, Mumbai",
    address: "Shop 7, LBS Marg, Kurla West, Mumbai - 400070",
    contact: "+91 70451 98765",
    nickname: "",
    notes: "Prices spike during festival season.",
    isFavorite: false,
    totalSpend: "₹38,700",
    totalDeliveries: 14,
    totalProducts: 22,
    products: [],
    insights: [],
  },
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
  const { id } = use(params);
  const seller = SELLER_DATA[id];

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
              <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {seller.location}
              </span>
              {seller.contact !== "—" && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {seller.contact}
                </span>
              )}
              {seller.address !== "—" && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  {seller.address}
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
