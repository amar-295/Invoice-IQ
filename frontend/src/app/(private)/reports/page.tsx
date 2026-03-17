"use client"

import { useState, useEffect, useCallback } from "react"
import {
  IndianRupee,
  Truck,
  Users,
  Package,
  Download,
  Printer,
  TrendingUp,
} from "lucide-react"
import { Skeleton } from "@/components/ui/Skeleton"

// ─── Types ────────────────────────────────────────────────────────────────────

type Summary = {
  totalSpend: number
  deliveryCount: number
  uniqueSellers: number
  uniqueProducts: number
}

type SupplierRow = {
  name: string
  totalSpend: number
  deliveryCount: number
  avgOrderValue: number
  percentOfTotal: number
}

type ProductRow = {
  name: string
  unit: string
  avgPrice: number
  minPrice: number
  maxPrice: number
  totalQty: number
  deliveryCount: number
}

type DeliveryRow = {
  id: string
  date: string
  sellerName: string
  productName: string
  quantity: string
  unit: string
  price: string
  source: "Manual" | "Image" | "AI"
}

type ReportData = {
  summary: Summary
  supplierBreakdown: SupplierRow[]
  productBreakdown: ProductRow[]
  deliveryLog: DeliveryRow[]
}

// ─── Presets ──────────────────────────────────────────────────────────────────

type PresetKey = "thisMonth" | "lastMonth" | "last3Months" | "last6Months" | "thisYear"

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "thisMonth",    label: "This Month" },
  { key: "lastMonth",    label: "Last Month" },
  { key: "last3Months",  label: "Last 3 Months" },
  { key: "last6Months",  label: "Last 6 Months" },
  { key: "thisYear",     label: "This Year" },
]

const getDateRange = (preset: PresetKey): { startDate: string; endDate: string } => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  if (preset === "thisMonth") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { startDate: fmt(start), endDate: fmt(end) }
  }
  if (preset === "lastMonth") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
    return { startDate: fmt(start), endDate: fmt(end) }
  }
  if (preset === "last3Months") {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { startDate: fmt(start), endDate: fmt(end) }
  }
  if (preset === "last6Months") {
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { startDate: fmt(start), endDate: fmt(end) }
  }
  // thisYear
  const start = new Date(now.getFullYear(), 0, 1)
  const end = new Date(now.getFullYear(), 11, 31)
  return { startDate: fmt(start), endDate: fmt(end) }
}

// ─── Formatters ───────────────────────────────────────────────────────────────

const currFmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 })
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" })

const fmtRupee = (n: number) => currFmt.format(n)
const fmtDate = (d: string) => dateFmt.format(new Date(d))

// ─── Source badge ─────────────────────────────────────────────────────────────

const SOURCE_STYLE: Record<string, string> = {
  Manual: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Image:  "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
  AI:     "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${SOURCE_STYLE[source] ?? ""}`}>
      {source}
    </span>
  )
}

// ─── CSV export ───────────────────────────────────────────────────────────────

const exportCSV = (data: ReportData, preset: PresetKey) => {
  const lines: string[] = []
  const { startDate, endDate } = getDateRange(preset)

  lines.push(`Invoice IQ — Report (${startDate} to ${endDate})`)
  lines.push("")

  // Summary
  lines.push("SUMMARY")
  lines.push("Total Spend,Total Deliveries,Suppliers Used,Products Tracked")
  lines.push(`${data.summary.totalSpend},${data.summary.deliveryCount},${data.summary.uniqueSellers},${data.summary.uniqueProducts}`)
  lines.push("")

  // Supplier breakdown
  lines.push("SUPPLIER BREAKDOWN")
  lines.push("Supplier,Total Spend,Deliveries,Avg Order Value,% of Total")
  data.supplierBreakdown.forEach((r) =>
    lines.push(`"${r.name}",${r.totalSpend},${r.deliveryCount},${r.avgOrderValue},${r.percentOfTotal}`)
  )
  lines.push("")

  // Product breakdown
  lines.push("PRODUCT ANALYSIS")
  lines.push("Product,Unit,Avg Price,Min Price,Max Price,Total Qty,Deliveries")
  data.productBreakdown.forEach((r) =>
    lines.push(`"${r.name}","${r.unit}",${r.avgPrice},${r.minPrice},${r.maxPrice},${r.totalQty},${r.deliveryCount}`)
  )
  lines.push("")

  // Delivery log
  lines.push("DELIVERY LOG")
  lines.push("Date,Supplier,Product,Qty,Unit,Price,Source")
  data.deliveryLog.forEach((r) =>
    lines.push(`"${fmtDate(r.date)}","${r.sellerName}","${r.productName}",${r.quantity},"${r.unit}",${r.price},"${r.source}"`)
  )

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `report-${startDate}-to-${endDate}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function TableSkeletonRows({ cols, rows = 4 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 dark:border-white/5">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton className="h-4 w-full rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [preset, setPreset] = useState<PresetKey>("thisMonth")
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async (p: PresetKey) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const { startDate, endDate } = getDateRange(p)
      const base = process.env.NEXT_PUBLIC_API_URL
      if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set.")
      const res = await fetch(
        `${base}/api/userInterface/report?startDate=${startDate}&endDate=${endDate}`,
        { credentials: "include" }
      )
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const json = await res.json() as { data: ReportData }
      setData(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load report.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReport(preset) }, [preset, fetchReport])

  const { startDate, endDate } = getDateRange(preset)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 print:p-4 print:space-y-6">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {startDate} → {endDate}
          </p>
        </div>

        {/* Action buttons — hidden on print */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {/* Presets */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl p-1">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPreset(p.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  preset === p.key
                    ? "bg-[#1E3A8A] text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Export & Print */}
          <button
            onClick={() => data && exportCSV(data, preset)}
            disabled={!data || loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-5 py-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ── Section 1: Summary Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Spend",       icon: IndianRupee, color: "blue",    value: loading ? null : fmtRupee(data?.summary.totalSpend ?? 0) },
          { label: "Total Deliveries",  icon: Truck,       color: "emerald", value: loading ? null : String(data?.summary.deliveryCount ?? 0) },
          { label: "Suppliers Used",    icon: Users,       color: "violet",  value: loading ? null : String(data?.summary.uniqueSellers ?? 0) },
          { label: "Products Tracked",  icon: Package,     color: "amber",   value: loading ? null : String(data?.summary.uniqueProducts ?? 0) },
        ].map(({ label, icon: Icon, color, value }) => {
          const palette: Record<string, string> = {
            blue:    "bg-blue-50 dark:bg-blue-500/10 text-[#1E3A8A] dark:text-blue-400",
            emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            violet:  "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
            amber:   "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
          }
          return (
            <div key={label} className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
                <div className={`p-2 rounded-lg ${palette[color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-28 rounded-lg" />
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Section 2: Supplier Breakdown ─────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-500" />
          Supplier Breakdown
        </h2>
        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50/60 dark:bg-white/3">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spend</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deliveries</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Order</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeletonRows cols={6} />
                ) : !data || data.supplierBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                      No supplier data for this period.
                    </td>
                  </tr>
                ) : (
                  data.supplierBreakdown.map((row, i) => (
                    <tr key={row.name} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/60 dark:hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-gray-400 dark:text-gray-500 font-medium">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.name}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">{fmtRupee(row.totalSpend)}</td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{row.deliveryCount}</td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{fmtRupee(row.avgOrderValue)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#1E3A8A] dark:bg-blue-500"
                              style={{ width: `${Math.min(row.percentOfTotal, 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-600 dark:text-gray-300 tabular-nums">{row.percentOfTotal.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Section 3: Product Analysis ───────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-500" />
          Product Analysis
        </h2>
        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50/60 dark:bg-white/3">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Min</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deliveries</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeletonRows cols={7} />
                ) : !data || data.productBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                      No product data for this period.
                    </td>
                  </tr>
                ) : (
                  data.productBreakdown.map((row) => {
                    const spread = row.maxPrice - row.minPrice
                    const spreadPct = row.maxPrice > 0 ? ((spread / row.maxPrice) * 100).toFixed(1) : "0.0"
                    return (
                      <tr key={row.name} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/60 dark:hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.name}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.unit}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">{fmtRupee(row.avgPrice)}</td>
                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">{fmtRupee(row.minPrice)}</td>
                        <td className="px-4 py-3 text-right text-red-500 dark:text-red-400">
                          <span>{fmtRupee(row.maxPrice)}</span>
                          {spread > 0 && (
                            <span className="ml-1.5 text-[10px] font-medium text-amber-500 dark:text-amber-400 flex items-center justify-end gap-0.5">
                              <TrendingUp className="w-2.5 h-2.5" />
                              {spreadPct}% spread
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{row.totalQty}</td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{row.deliveryCount}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Section 4: Delivery Log ────────────────────────────────── */}
      <section className="pb-8">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-500" />
          Delivery Log
          {!loading && data && (
            <span className="ml-1 text-xs font-normal text-gray-400 dark:text-gray-500">
              ({data.deliveryLog.length} entries)
            </span>
          )}
        </h2>
        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50/60 dark:bg-white/3">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeletonRows cols={7} rows={6} />
                ) : !data || data.deliveryLog.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                      No deliveries recorded for this period.
                    </td>
                  </tr>
                ) : (
                  data.deliveryLog.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/60 dark:hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{fmtDate(row.date)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.sellerName}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.productName}</td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300 tabular-nums">{row.quantity}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.unit}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white tabular-nums">
                        ₹{row.price}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <SourceBadge source={row.source} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
