import { Clock3, ImagePlus, TrendingUp } from "lucide-react";
import ClientSide from "@/components/Delivery/ClientSide";
import { headers } from "next/headers";

const getDeliveryData = async () => {
  try {
    const incomingHeaders = await headers();
    const cookieHeader = incomingHeaders.get("cookie") || "";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/userInterface/dataForDeliveryPage`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieHeader,
        },
      },
    );
    const result = await response.json();
    console.log("Delivery data response:", result);
    if (!response.ok) {
      console.log("Failed to fetch delivery data. Status:", response.status);
      throw new Error("Failed to fetch delivery data");
    }

    return {
      todayDelivery: Number(result?.data?.todayDeliveries || 0),
      lastMonthDelivery: Number(result?.data?.lastMonthDelivery || 0),
      last6MonthDeliveries: Number(result?.data?.last6MonthDeliveries || 0),
    };
  } catch (e) {
    console.log("Error fetching delivery data:", e);
    // toast.error("Failed to fetch delivery data. Please try again later.");
    return {
      todayDelivery: 0,
      lastMonthDelivery: 0,
      last6MonthDeliveries: 0,
    };
  }
};

export default async function DeliveriesPage() {
  const { todayDelivery, lastMonthDelivery, last6MonthDeliveries } =
    await getDeliveryData();

  return (
    <div className="relative overflow-hidden p-6 md:p-8 space-y-8">
      <div className="pointer-events-none absolute -top-40 -right-24 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/10" />
      <div className="pointer-events-none absolute -bottom-48 -left-24 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />

      <header className="relative">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Add Deliveries
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Record every incoming stock quickly using one of the three delivery
          capture modes.
        </p>
      </header>

      <section className="relative grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171B24]/90">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deliveries Today
            </p>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {todayDelivery}
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            +12% from yesterday
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171B24]/90">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Delivery Last Month
            </p>
            <ImagePlus className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {lastMonthDelivery}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Product Delivered last month
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171B24]/90">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Delivery Last 6 months
            </p>
            <Clock3 className="h-4 w-4 text-sky-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {last6MonthDeliveries}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Product Delivery last 6 months
          </p>
        </article>
      </section>

      <ClientSide />
    </div>
  );
}
