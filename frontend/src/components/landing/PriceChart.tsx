"use client";

const bars = [
  { height: "40%", bg: "bg-primary/10", tooltip: "₹42.00" },
  { height: "55%", bg: "bg-primary/20" },
  { height: "45%", bg: "bg-primary/30" },
  { height: "70%", bg: "bg-primary/40" },
  { height: "85%", bg: "bg-primary/50", spike: true },
  { height: "75%", bg: "bg-primary/60" },
  { height: "95%", bg: "bg-primary/70" },
  { height: "80%", bg: "bg-primary/80" },
  { height: "60%", bg: "bg-primary" },
  { height: "40%", bg: "bg-primary/40" },
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
];

export default function PriceChart() {
  return (
    <div className="font-outfit bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Daily Essentials
          </h4>
          <p className="font-space-grotesk text-2xl font-bold">
            Amul Milk (1L Packet)
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded text-xs font-bold">
            +12.5% Spike
          </span>
          <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 rounded text-xs font-bold">
            Forecast: Downward
          </span>
        </div>
      </div>

      <div className="h-64 flex items-end gap-2 px-4 border-b border-slate-100 dark:border-slate-800">
        {bars.map((bar, i) => (
          <div
            key={i}
            className={`flex-1 ${bar.bg} rounded-t-lg relative group cursor-default transition-opacity hover:opacity-90`}
            style={{ height: bar.height }}
          >
            {"tooltip" in bar && (
              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity duration-200 pointer-events-none z-10">
                {bar.tooltip}
              </div>
            )}
            {"spike" in bar && bar.spike && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <span
                  className="material-symbols-outlined text-red-500"
                  style={{ fontSize: "20px" }}
                >
                  warning
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase tracking-tighter">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}
