"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Store,
  MapPin,
  Calendar,
  Wallet,
  ChevronRight,
  X,
  Phone,
  Star,
  Hash,
  FileText,
  Building2,
} from "lucide-react";

interface Seller {
  _id?: string;
  id?: string;
  name: string;
  mobile: string;
  address: string;
  nickname?: string;
  notes?: string;
  isFavorite?: boolean;
  lastDelivery?: string;
  monthlySpend?: string;
  status?: "active" | "inactive";
}

type SellerFormState = {
  name: string;
  mobile: string;
  address: string;
  nickname: string;
  notes: string;
  isFavorite: boolean;
};

const EMPTY_FORM: SellerFormState = { name: "", mobile: "", address: "", nickname: "", notes: "", isFavorite: false };

const mapSellerFromApi = (seller: Partial<Seller>): Seller => ({
  _id: seller._id,
  id: seller._id || seller.id,
  name: seller.name || "Unnamed seller",
  mobile: seller.mobile || "",
  address: seller.address || "",
  nickname: seller.nickname || "",
  notes: seller.notes || "",
  isFavorite: Boolean(seller.isFavorite),
  lastDelivery: seller.lastDelivery,
  monthlySpend: seller.monthlySpend,
  status: seller.status,
});

const getSellerLocation = (address: string): string => {
  const firstSegment = address.split(",")[0]?.trim();
  return firstSegment || "—";
};

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<{ name?: string; mobile?: string; address?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch sellers from backend
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
        const response = await fetch(`${baseUrl}/api/sellerManagement/getSeller`, {
          credentials: "include"
        });
        const data = await response.json();
        console.log("Fetch Sellers Response:", data);

        if (!response.ok) {
          console.log(data  )
          throw new Error("Failed to fetch sellers");
        }

        const sellersList = Array.isArray(data.data) ? data.data.map(mapSellerFromApi) : [];
        setSellers(sellersList);
      } catch (error) {
        console.log(error);
        console.error("Error fetching sellers:", error);
        toast.error("Failed to load sellers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const filteredSellers = useMemo(() => {
    return sellers.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nickname || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sellers, searchQuery]);

  function openModal() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleSave() {
    const nextErrors: { name?: string; mobile?: string; address?: string } = {};

    if (!form.name.trim()) {
      nextErrors.name = "Seller name is required.";
    }

    if (!form.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Address is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    try {
      setIsSaving(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
      const response = await fetch(`${baseUrl}/api/sellerManagement/createSeller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          address: form.address.trim(),
          nickname: form.nickname.trim() || undefined,
          notes: form.notes.trim() || undefined,
          isFavorite: form.isFavorite
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create seller");
      }

      const data = await response.json();
      setSellers((prev) => [mapSellerFromApi(data.data), ...prev]);
      toast.success("Seller added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error saving seller:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save seller");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-400 mx-auto space-y-8">

      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Sellers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage suppliers and track purchase history.
          </p>
        </div>

        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#1E3A8A] to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Seller
        </button>
      </div>

      {/* ── Search ────────────────────────────────────────────── */}
      {!isLoading && (
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
          />
        </div>
      )}

      {/* ── Loading State ─────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xs">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-5">
            <Store className="w-7 h-7 text-blue-500 dark:text-blue-400 animate-spin" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Loading sellers...
          </h3>
        </div>
      ) : filteredSellers.length > 0 ? (
        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_160px_160px_32px] items-center px-6 py-3 border-b border-gray-100 dark:border-white/5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Seller</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 text-right">Last Delivery</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 text-right">Monthly Spend</span>
            <span />
          </div>

          {filteredSellers.map((seller, index) => (
            <Link
              key={seller._id || seller.id}
              href={`/home/seller/${seller._id || seller.id}`}
              className={`group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_160px_160px_32px] items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/3 transition-all ${
                index !== 0 ? "border-t border-gray-100 dark:border-white/5" : ""
              }`}
            >
              {/* Seller Name + Address */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  {seller.isFavorite
                    ? <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    : <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-snug">
                      {seller.name}
                    </p>
                    {seller.nickname && (
                      <span className="inline-flex max-w-[10rem] truncate rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600 dark:bg-white/10 dark:text-gray-300">
                        {seller.nickname}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{seller.mobile || "—"}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{getSellerLocation(seller.address)}</span>
                  </div>
                </div>
              </div>

              {/* Last Delivery */}
              <div className="hidden md:flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-3 h-3" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{seller.lastDelivery || "—"}</span>
              </div>

              {/* Monthly Spend */}
              <div className="hidden md:flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1 text-gray-400">
                  <Wallet className="w-3 h-3" />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{seller.monthlySpend || "₹0"}</span>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all justify-self-end" />
            </Link>
          ))}
        </div>
      ) : searchQuery && sellers.length > 0 ? (
        /* ── No Search Results ──────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xs">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center mb-5">
            <Search className="w-7 h-7 text-amber-500 dark:text-amber-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            No sellers match your search.
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center max-w-xs">
            Try searching with different keywords.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* ── No Sellers Added ────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xs">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-5">
            <Store className="w-7 h-7 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            No sellers added yet.
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center max-w-xs">
            Add your first supplier to start tracking purchases and managing deliveries.
          </p>
          <button
            onClick={openModal}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#1E3A8A] to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Your First Seller
          </button>
        </div>
      )}

      {/* ── Add Seller Modal ───────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Panel */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Add New Seller
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Fill in the details to register a new supplier.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <div className="px-6 py-5 space-y-4 overflow-y-auto">

              {/* ── Favorite Toggle ─────────────────────────── */}
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, isFavorite: !f.isFavorite }))}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                  form.isFavorite
                    ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
                    : "bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star
                    className={`w-4 h-4 transition-colors ${
                      form.isFavorite
                        ? "text-amber-500 fill-amber-400"
                        : "text-gray-400"
                    }`}
                  />
                  <span className={`text-sm font-medium ${
                    form.isFavorite
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}>
                    Mark as Favourite
                  </span>
                </div>
                <div className={`w-9 h-5 rounded-full transition-all relative ${
                  form.isFavorite ? "bg-amber-400" : "bg-gray-200 dark:bg-white/10"
                }`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    form.isFavorite ? "left-4.5" : "left-0.5"
                  }`} />
                </div>
              </button>

              {/* Seller Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                  Seller Name <span className="text-red-500 normal-case tracking-normal">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Om Trading Co."
                    value={form.name}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, name: e.target.value }));
                      if (formErrors.name) setFormErrors({});
                    }}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-black/20 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all ${
                      formErrors.name
                        ? "border-red-400 dark:border-red-500"
                        : "border-gray-200 dark:border-white/10"
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                  Nickname <span className="text-gray-400 normal-case font-normal tracking-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Om Bhai"
                    value={form.nickname}
                    onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                  Address <span className="text-red-500 normal-case tracking-normal">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <textarea
                    rows={2}
                    placeholder="e.g. Shop 4, Gokhale Road, Dadar West - 400028"
                    value={form.address}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, address: e.target.value }));
                      if (formErrors.address) {
                        setFormErrors((current) => ({ ...current, address: undefined }));
                      }
                    }}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-black/20 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all resize-none ${
                      formErrors.address
                        ? "border-red-400 dark:border-red-500"
                        : "border-gray-200 dark:border-white/10"
                    }`}
                  />
                </div>
                {formErrors.address && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                  Mobile Number <span className="text-red-500 normal-case tracking-normal">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="e.g. +91 98201 12345"
                    value={form.mobile}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, mobile: e.target.value }));
                      if (formErrors.mobile) {
                        setFormErrors((current) => ({ ...current, mobile: undefined }));
                      }
                    }}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-black/20 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all ${
                      formErrors.mobile
                        ? "border-red-400 dark:border-red-500"
                        : "border-gray-200 dark:border-white/10"
                    }`}
                  />
                </div>
                {formErrors.mobile && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.mobile}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                  Notes <span className="text-gray-400 normal-case font-normal tracking-normal">(optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <textarea
                    rows={3}
                    placeholder="e.g. Delivers every Monday, call before ordering..."
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-[#1E3A8A] to-blue-600 hover:from-blue-800 hover:to-blue-700 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Seller"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
