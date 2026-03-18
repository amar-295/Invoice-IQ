"use client";
import { Plus } from "lucide-react";
import Link from "next/link";

const ActionButton = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/home/seller"
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-xs"
      >
        <Plus className="w-4 h-4" />
        Add Supplier
      </Link>
      <Link
        href="/deliveries"
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-xs"
      >
        <Plus className="w-4 h-4" />
        Add Delivery
      </Link>
    </div>
  );
};

export default ActionButton;
