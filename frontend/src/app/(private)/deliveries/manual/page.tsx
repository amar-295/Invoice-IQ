"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  Package,
  Plus,
  Store,
} from "lucide-react";

type SellerOption = {
  _id: string;
  name: string;
  mobile: string;
  address: string;
};

type ProductOption = {
  _id: string;
  sellerId: string;
  name: string;
  unit: string;
  normalizedName: string;
};

type FormState = {
  sellerId: string;
  productId: string;
  unit: string;
  quantity: string;
  price: string;
  date: string;
};

const initialForm: FormState = {
  sellerId: "",
  productId: "",
  unit: "",
  quantity: "",
  price: "",
  date: new Date().toISOString().split("T")[0] || "",
};

export default function ManualDeliveryPage() {
  const [sellers, setSellers] = useState<SellerOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");

  const productsForUser = useMemo(() => products, [products]);

  const selectedSeller = useMemo(
    () => sellers.find((seller) => seller._id === form.sellerId),
    [sellers, form.sellerId],
  );

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setIsLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

        const response = await fetch(
          `${baseUrl}/api/delivery/manual/form-data`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.message || "Failed to fetch form data.");
        }

        setSellers(
          Array.isArray(result?.data?.sellers) ? result.data.sellers : [],
        );
        setProducts(
          Array.isArray(result?.data?.products) ? result.data.products : [],
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load form data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, []);

  const onSelectSeller = (sellerId: string) => {
    setForm((current) => ({
      ...current,
      sellerId,
    }));
  };

  const onSelectProduct = (productId: string) => {
    const selectedProduct = productsForUser.find(
      (item) => item._id === productId,
    );
    setForm((current) => ({
      ...current,
      sellerId: selectedProduct
        ? String(selectedProduct.sellerId)
        : current.sellerId,
      productId,
      unit: selectedProduct?.unit || "",
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.sellerId ||
      !form.productId ||
      !form.unit ||
      !form.quantity.trim() ||
      !form.price.trim()
    ) {
      toast.error("Seller, product, unit, quantity and price are required.");
      return;
    }

    try {
      setIsSaving(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

      const response = await fetch(
        `${baseUrl}/api/delivery/addDelivery/byManual`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sellerId: form.sellerId,
            productId: form.productId,
            unit: form.unit,
            quantity: form.quantity.trim(),
            price: form.price.trim(),
            date: form.date,
          }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to add manual delivery.");
      }

      toast.success("Manual delivery saved successfully.");
      setForm(initialForm);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save delivery.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!form.sellerId) {
      toast.error("Please select a seller first.");
      return;
    }

    if (!newProductName.trim() || !newProductUnit.trim()) {
      toast.error("Product name and unit are required.");
      return;
    }

    try {
      setIsCreatingProduct(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

      const response = await fetch(
        `${baseUrl}/api/delivery/manual/add-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sellerId: form.sellerId,
            name: newProductName.trim(),
            unit: newProductUnit.trim(),
          }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to create product.");
      }

      const createdProduct = result?.data as ProductOption;
      if (!createdProduct?._id) {
        throw new Error("Invalid product data received from server.");
      }

      setProducts((current) => {
        const exists = current.some((item) => item._id === createdProduct._id);
        if (exists) {
          return current;
        }

        return [...current, createdProduct];
      });

      setForm((current) => ({
        ...current,
        productId: createdProduct._id,
        unit: createdProduct.unit,
      }));

      setNewProductName("");
      setNewProductUnit("");

      toast.success(result?.message || "Product saved successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <header className="space-y-2">
        <Link
          href="/deliveries"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Deliveries
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Manual Delivery Entry
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Select seller and product, then fill quantity, price and date.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 dark:border-white/10 dark:bg-[#171B24] space-y-5">
        {isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading sellers and products...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300">
                  Seller
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={form.sellerId}
                    onChange={(e) => onSelectSeller(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                  >
                    <option value="">Select seller</option>
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
                  Product
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={form.productId}
                    onChange={(e) => onSelectProduct(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                  >
                    <option value="">Select product (all your products)</option>
                    {productsForUser.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  All products are loaded by user. Selecting a product
                  auto-selects its seller.
                </p>
              </div>
            </div>

            {selectedSeller && (
              <div className="rounded-xl border border-slate-200 p-3 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300">
                Selected seller:{" "}
                <span className="font-semibold">{selectedSeller.name}</span>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10 bg-slate-50/70 dark:bg-white/5">
              <p className="text-xs uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300 mb-3">
                Add Custom Product
              </p>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_auto] gap-3">
                <input
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Product name"
                  disabled={!form.sellerId || isCreatingProduct}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                />
                <input
                  value={newProductUnit}
                  onChange={(e) => setNewProductUnit(e.target.value)}
                  placeholder="Unit (kg, L, etc.)"
                  disabled={!form.sellerId || isCreatingProduct}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={handleCreateProduct}
                  disabled={!form.sellerId || isCreatingProduct}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-[#1D4ED8] to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {isCreatingProduct ? "Adding..." : "Add Product"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300">
                  Unit
                </label>
                <input
                  value={form.unit}
                  readOnly
                  placeholder="Auto-filled from product"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300">
                  Quantity
                </label>
                <input
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      quantity: e.target.value,
                    }))
                  }
                  placeholder="e.g. 25"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300">
                  Price
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={form.price}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        price: e.target.value,
                      }))
                    }
                    placeholder="e.g. 1250"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:max-w-md">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300">
                  Delivery Date
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        date: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#0F766E] to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Manual Delivery"}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
