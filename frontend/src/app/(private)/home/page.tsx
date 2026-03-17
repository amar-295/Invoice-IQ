
import {
  IndianRupee,
  Users,
  Package,
  AlertCircle,
  TrendingUp,
  Plus,
  Scan,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ReceiptText
} from "lucide-react"

type DashboardStats = {
  totalSpendThisMonth: number
  activeSuppliers: number
  itemsPurchasedThisMonth: number
  priceAlerts: number
}

type AlertDelivery = {
  id: string
  date: string
  source: "Manual" | "Image" | "AI"
  quantity: string
  price: number
  averagePrice: number
  excessAmount: number
}

type RecentDelivery = {
  id: string
  date: string
  quantity: string
  price: string
  source: "Manual" | "Image" | "AI"
}

type TopItem = {
  name: string
  total: number
}

type TrendPoint = {
  label: string
  amount: number
}

type SourceBreakdown = {
  source: "Manual" | "Image" | "AI"
  totalAmount: number
  count: number
}

type DashboardResponse = {
  data: {
    period: {
      month: number
      year: number
    }
    stats: DashboardStats
    recentDeliveries: RecentDelivery[]
    alertDeliveries: AlertDelivery[]
    deliveriesBySource: SourceBreakdown[]
    topItems: TopItem[]
    monthlyTrend: TrendPoint[]
    aiSummary: string
    notes?: {
      scope?: string
    }
  }
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "INR"
})

const compactCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 1,
  notation: "compact"
})

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short"
})

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "long"
})

const formatCurrency = (amount: number): string => currencyFormatter.format(amount)

const formatCompactAmount = (amount: number): string => {
  if (amount <= 0) {
    return "0"
  }

  return compactCurrencyFormatter.format(amount).replace("T", "K")
}

const parsePrice = (price: string): number => Number(price.replace(/[^\d.-]/g, "")) || 0

const getDashboardData = async (): Promise<DashboardResponse["data"] | null> => {
  try {
    const now = new Date()
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"
    const response = await fetch(
      `${baseUrl}/api/userInterface/dashboardData?month=${now.getMonth() + 1}&year=${now.getFullYear()}`,
      {
        cache: "no-store"
      }
    )

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as DashboardResponse
    return payload.data ?? null
  } catch (error) {
    console.error("Failed to load dashboard data", error)
    return null
  }
}

export default async function HomePage() {
  const dashboard = await getDashboardData()
  const monthLabel = monthFormatter.format(new Date())
  const stats = dashboard?.stats ?? {
    totalSpendThisMonth: 0,
    activeSuppliers: 0,
    itemsPurchasedThisMonth: 0,
    priceAlerts: 0
  }
  const recentDeliveries = dashboard?.recentDeliveries ?? []
  const alertDeliveries = dashboard?.alertDeliveries ?? []
  const topItems = dashboard?.topItems ?? []
  const monthlyTrend = dashboard?.monthlyTrend ?? []
  const deliveriesBySource = dashboard?.deliveriesBySource ?? []
  const maxTrendAmount = Math.max(...monthlyTrend.map((item) => item.amount), 1)
  const peakTrend = monthlyTrend.reduce<TrendPoint>(
    (best, item) => (item.amount > best.amount ? item : best),
    { label: "N/A", amount: 0 }
  )

  return (
    <div className="p-6 md:p-8 max-w-400 mx-auto space-y-8 dark:bg-black">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here&apos;s your business summary for {monthLabel}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-xs">
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-xs">
            <Plus className="w-4 h-4" />
            Add Delivery
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-[#1E3A8A] to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <Scan className="w-4 h-4" />
            Scan Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-4">
            <span className="text-sm font-medium">Total Spend (This Month)</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <IndianRupee className="w-4 h-4 text-[#1E3A8A] dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalSpendThisMonth)}</h2>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-4">
            <span className="text-sm font-medium">Active Suppliers</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeSuppliers}</h2>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total registered</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-4">
            <span className="text-sm font-medium">Items Purchased</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
              <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.itemsPurchasedThisMonth}</h2>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">This month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1D24] border border-red-100 dark:border-red-900/30 rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500/80 group-hover:bg-red-500 transition-colors"></div>
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-4">
            <span className="text-sm font-medium">Price Alerts</span>
            <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.priceAlerts}</h2>
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Needs review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/30 dark:bg-white/1">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Price Alerts Detected
              </h3>
              <span className="text-sm font-medium text-[#1E3A8A] dark:text-blue-400">{stats.priceAlerts} flagged</span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {alertDeliveries.length > 0 ? (
                alertDeliveries.map((alert) => (
                  <div key={alert.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors group">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{alert.source} entry</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{dateFormatter.format(new Date(alert.date))} • Qty {alert.quantity}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{formatCurrency(alert.excessAmount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 mt-4 text-sm bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Monthly Average</span>
                        <span className="font-medium text-gray-900 dark:text-gray-300">{formatCurrency(alert.averagePrice)}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Recorded Price</span>
                        <span className="font-bold text-red-600 dark:text-red-400">{formatCurrency(alert.price)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-sm text-gray-500 dark:text-gray-400">No price alerts detected for this month.</div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden pb-2">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ReceiptText className="w-4 h-4 text-gray-400" />
                Recent Deliveries
              </h3>
              <span className="text-sm font-medium text-[#1E3A8A] dark:text-blue-400">{recentDeliveries.length} record(s)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/10">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                  {recentDeliveries.length > 0 ? (
                    recentDeliveries.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-white/2 cursor-default transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{dateFormatter.format(new Date(delivery.date))}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{delivery.source}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{delivery.quantity}</td>
                        <td className="px-6 py-4 font-medium text-right text-gray-900 dark:text-white">{formatCurrency(parsePrice(delivery.price))}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No deliveries found for this month.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-linear-to-br from-blue-50 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 dark:opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-500">
              <Sparkles className="w-32 h-32 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-1.5 bg-[#1E3A8A] dark:bg-blue-600 rounded-lg shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Smart Summary</h3>
            </div>
            <div className="space-y-3.5 text-sm text-gray-700 dark:text-gray-300 relative z-10 leading-relaxed">
              <p>{dashboard?.aiSummary ?? "Dashboard data is not available right now."}</p>
              <p>{dashboard?.notes?.scope ?? "Supplier-specific delivery insights will improve once deliveries are linked to sellers and users."}</p>
              <div className="pt-3 border-t border-blue-200/50 dark:border-blue-800/50 mt-3">
                <p className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 rotate-180" />
                  Peak month in view: {peakTrend.label} at {formatCurrency(peakTrend.amount)}
                </p>
              </div>
            </div>
            <button className="mt-6 w-full py-2.5 bg-white dark:bg-[#111318] hover:bg-gray-50 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl text-sm font-medium text-[#1E3A8A] dark:text-blue-400 transition-colors shadow-xs">
              Generate Full Report
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">Spend by Source</h3>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-6">
              {deliveriesBySource.length > 0 ? (
                deliveriesBySource.map((entry, index) => {
                  const width = stats.totalSpendThisMonth > 0 ? `${Math.max((entry.totalAmount / stats.totalSpendThisMonth) * 100, 8)}%` : "8%"
                  const barClassName = index === 0
                    ? "bg-[#1E3A8A] dark:bg-blue-500"
                    : index === 1
                      ? "bg-blue-400 dark:bg-blue-400"
                      : "bg-slate-300 dark:bg-slate-500"

                  return (
                    <div key={entry.source} className="group">
                      <div className="flex justify-between text-sm mb-2 gap-3">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{entry.source}</span>
                        <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(entry.totalAmount)}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div className={`${barClassName} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width }}></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{entry.count} delivery record(s)</p>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No source breakdown available for this month.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-xs">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Top Items Purchased</h3>
            <div className="space-y-5">
              {topItems.length > 0 ? (
                topItems.map((item, index) => {
                  const iconClassName = index === 0
                    ? "bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400"
                    : index === 1
                      ? "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-100 dark:border-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                      : index === 2
                        ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400"

                  return (
                    <div key={item.name} className="flex items-center gap-3 group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${iconClassName}`}>
                        <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{item.total} product record(s)</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No top items available yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white">Trend</h3>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-md">Last 3 months</span>
            </div>

            <div className="flex items-end justify-between h-28 gap-3 px-2">
              {monthlyTrend.length > 0 ? (
                monthlyTrend.map((point, index) => {
                  const barHeight = `${Math.max((point.amount / maxTrendAmount) * 100, 12)}%`
                  const barClassName = index === monthlyTrend.length - 1
                    ? "bg-[#1E3A8A] dark:bg-blue-500 group-hover:bg-blue-800 dark:group-hover:bg-blue-400"
                    : index === 1
                      ? "bg-blue-300 dark:bg-blue-700/50 group-hover:bg-blue-400 dark:group-hover:bg-blue-600/60"
                      : "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40"
                  const labelClassName = index === monthlyTrend.length - 1
                    ? "text-xs text-gray-900 dark:text-white font-semibold"
                    : "text-xs text-gray-500 dark:text-gray-400 font-medium"

                  return (
                    <div key={point.label} className="w-full flex flex-col items-center gap-3 group cursor-pointer">
                      <div className={`w-full rounded-t-lg transition-colors relative shadow-sm ${barClassName}`} style={{ height: barHeight }}>
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700 dark:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">{formatCompactAmount(point.amount)}</span>
                      </div>
                      <span className={labelClassName}>{point.label}</span>
                    </div>
                  )
                })
              ) : (
                <div className="w-full text-center text-sm text-gray-500 dark:text-gray-400">No trend data available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
