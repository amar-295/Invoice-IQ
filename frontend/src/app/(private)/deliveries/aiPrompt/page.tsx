"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
  Store,
  Trash2,
} from "lucide-react";

type SellerOption = {
  _id: string;
  name: string;
  mobile: string;
  address: string;
};

type DraftItem = {
  draftId: string;
  name: string;
  normalizedName: string;
  unit: string;
  quantity: string;
  price: string;
  date: string;
  rawText: string;
  matchedProduct: {
    _id: string;
    name: string;
    unit: string;
  } | null;
  isExistingProduct: boolean;
};

const today = new Date().toISOString().split("T")[0] || "";

export default function AIPromptDeliveryPage() {
  const [sellers, setSellers] = useState<SellerOption[]>([]);
  const [isLoadingSellers, setIsLoadingSellers] = useState(true);

  const [sellerId, setSellerId] = useState("");
  const [fallbackDate, setFallbackDate] = useState(today);
  const [prompt, setPrompt] = useState("");

  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const selectedSeller = useMemo(
    () => sellers.find((seller) => seller._id === sellerId) || null,
    [sellers, sellerId],
  );

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setIsLoadingSellers(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

        const response = await fetch(
          `${baseUrl}/api/sellerManagement/getSeller`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.message || "Failed to load sellers.");
        }

        setSellers(Array.isArray(result?.data) ? result.data : []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load sellers.",
        );
      } finally {
        setIsLoadingSellers(false);
      }
    };

    fetchSellers();
  }, []);

  const handleTransform = async () => {
    if (!sellerId) {
      toast.error("Please select a seller first.");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a delivery prompt.");
      return;
    }

    try {
      setIsTransforming(true);
      setHasConfirmed(false);

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
      const response = await fetch(`${baseUrl}/api/delivery/prompt/transform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          sellerId,
          prompt: prompt.trim(),
          fallbackDate,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to transform prompt.");
      }

      const items = Array.isArray(result?.data?.items) ? result.data.items : [];
      setDraftItems(items);

      if (items.length === 0) {
        toast.error("No valid items found in prompt.");
        return;
      }

      toast.success(
        `Draft ready with ${items.length} item${items.length > 1 ? "s" : ""}. Review before saving.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to transform prompt.",
      );
    } finally {
      setIsTransforming(false);
    }
  };

  const updateDraftField = (
    draftId: string,
    field: keyof DraftItem,
    value: string,
  ) => {
    setDraftItems((current) =>
      current.map((item) => {
        if (item.draftId !== draftId) {
          return item;
        }

        if (field === "name") {
          return {
            ...item,
            name: value,
            normalizedName: value.trim().toLowerCase(),
          };
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    );
  };

  const removeDraftItem = (draftId: string) => {
    setDraftItems((current) =>
      current.filter((item) => item.draftId !== draftId),
    );
    setHasConfirmed(false);
  };

  const handleSave = async () => {
    if (!sellerId) {
      toast.error("Please select a seller first.");
      return;
    }

    if (draftItems.length === 0) {
      toast.error("No draft items to save.");
      return;
    }

    if (!hasConfirmed) {
      toast.error("Please confirm the draft before saving.");
      return;
    }

    const invalidItem = draftItems.find(
      (item) =>
        !item.name.trim() ||
        !item.unit.trim() ||
        !item.quantity.trim() ||
        !item.price.trim(),
    );

    if (invalidItem) {
      toast.error("Each item must include name, unit, quantity and price.");
      return;
    }

    try {
      setIsSaving(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

      const response = await fetch(`${baseUrl}/api/delivery/prompt/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          sellerId,
          items: draftItems.map((item) => ({
            name: item.name.trim(),
            normalizedName: item.normalizedName.trim().toLowerCase(),
            unit: item.unit.trim(),
            quantity: item.quantity.trim(),
            price: item.price.trim(),
            date: item.date,
          })),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to save AI prompt deliveries.",
        );
      }

      toast.success(
        result?.message || "AI prompt deliveries saved successfully.",
      );
      setPrompt("");
      setDraftItems([]);
      setHasConfirmed(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save AI prompt deliveries.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative p-6 md:p-8 max-w-7xl mx-auto space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl dark:bg-cyan-500/10" />
      <div className="pointer-events-none absolute -bottom-44 -left-24 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-emerald-500/10" />

      <header className="relative space-y-2">
        <Link
          href="/deliveries"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Deliveries
        </Link>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          AI Prompt Delivery Entry
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
          Pick seller, paste natural language lines, transform into structured
          rows, verify each item, and save to MongoDB only after confirmation.
        </p>
      </header>

      <section className="relative rounded-2xl border border-slate-200 bg-white/95 p-5 md:p-6 shadow-sm dark:border-white/10 dark:bg-[#171B24]/95 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300">
              Seller
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={sellerId}
                onChange={(e) => {
                  setSellerId(e.target.value);
                  setDraftItems([]);
                  setHasConfirmed(false);
                }}
                disabled={isLoadingSellers}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
              >
                <option value="">
                  {isLoadingSellers ? "Loading sellers..." : "Select seller"}
                </option>
                {sellers.map((seller) => (
                  <option key={seller._id} value={seller._id}>
                    {seller.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300">
              Fallback Date
            </label>
            <input
              type="date"
              value={fallbackDate}
              onChange={(e) => setFallbackDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
          </div>
        </div>

        {selectedSeller && (
          <div className="rounded-xl border border-slate-200 p-3 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300">
            Selected seller:{" "}
            <span className="font-semibold">{selectedSeller.name}</span>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setHasConfirmed(false);
            }}
            rows={8}
            placeholder="Example:\nTomato, 10 kg, 500, 2026-03-17\nPotato, 5 kg, 180\nOnion 7 kg 280"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Use one item per line for best results.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTransform}
          disabled={isTransforming}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#1D4ED8] to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
        >
          {isTransforming ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isTransforming ? "Transforming..." : "Transform Prompt"}
        </button>
      </section>

      <section className="relative rounded-2xl border border-slate-200 bg-white/95 p-5 md:p-6 shadow-sm dark:border-white/10 dark:bg-[#171B24]/95 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Review Draft
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Confirm these values before saving to database.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300">
            <Bot className="h-3.5 w-3.5" />
            {draftItems.length} Items
          </span>
        </div>

        {draftItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
            Transform a prompt to preview draft items here.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-white/5">
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {draftItems.map((item) => (
                    <tr
                      key={item.draftId}
                      className="border-t border-slate-100 dark:border-white/10"
                    >
                      <td className="p-2.5 min-w-44">
                        <input
                          value={item.name}
                          onChange={(e) =>
                            updateDraftField(
                              item.draftId,
                              "name",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                        />
                      </td>
                      <td className="p-2.5 min-w-28">
                        <input
                          value={item.unit}
                          onChange={(e) =>
                            updateDraftField(
                              item.draftId,
                              "unit",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                        />
                      </td>
                      <td className="p-2.5 min-w-24">
                        <input
                          value={item.quantity}
                          onChange={(e) =>
                            updateDraftField(
                              item.draftId,
                              "quantity",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                        />
                      </td>
                      <td className="p-2.5 min-w-28">
                        <input
                          value={item.price}
                          onChange={(e) =>
                            updateDraftField(
                              item.draftId,
                              "price",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                        />
                      </td>
                      <td className="p-2.5 min-w-36">
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) =>
                            updateDraftField(
                              item.draftId,
                              "date",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                        />
                      </td>
                      <td className="p-2.5">
                        {item.isExistingProduct ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                            Existing
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300">
                            New Product
                          </span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <button
                          type="button"
                          onClick={() => removeDraftItem(item.draftId)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200">
              <input
                type="checkbox"
                checked={hasConfirmed}
                onChange={(e) => setHasConfirmed(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              I reviewed this draft and confirm these are the records to save.
            </label>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !hasConfirmed || draftItems.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0F766E] to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
            >
              {isSaving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save to MongoDB"}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
