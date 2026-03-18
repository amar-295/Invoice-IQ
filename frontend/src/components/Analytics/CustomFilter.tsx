"use client";

import { CalendarRange, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FilterKey } from "./types";

interface CustomFilterProps {
  filter: FilterKey;
  customFrom: string;
  customTo: string;
}

export default function CustomFilter({
  filter,
  customFrom,
  customTo,
}: CustomFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParams = (updates: {
    filter?: string;
    from?: string;
    to?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.filter !== undefined) {
      params.set("filter", updates.filter);

      if (updates.filter !== "custom") {
        params.delete("from");
        params.delete("to");
      }
    }

    if (updates.from !== undefined) {
      if (updates.from) {
        params.set("from", updates.from);
      } else {
        params.delete("from");
      }
    }

    if (updates.to !== undefined) {
      if (updates.to) {
        params.set("to", updates.to);
      } else {
        params.delete("to");
      }
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex items-center gap-2 self-start md:self-auto">
        <CalendarRange className="w-4 h-4 text-gray-400" />
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => updateQueryParams({ filter: e.target.value })}
            className="appearance-none min-w-54 pl-4 pr-10 py-2.5 text-sm font-medium bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-200 shadow-xs hover:bg-gray-50 dark:hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
          >
            <option value="last7Days">Last 7 Days</option>
            <option value="lastMonth">Last Month</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="lastYear">Last Year</option>
            <option value="custom">Custom Date Range</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {filter === "custom" && (
        <div className="bg-white dark:bg-[#1A1D24] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              From
              <input
                type="date"
                value={customFrom}
                onChange={(e) => updateQueryParams({ from: e.target.value })}
                className="px-3 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              To
              <input
                type="date"
                value={customTo}
                onChange={(e) => updateQueryParams({ to: e.target.value })}
                className="px-3 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
}
