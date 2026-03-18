"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, BarChart3, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Users, label: "Sellers", href: "/" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Plus, label: "Add", href: "/add-invoice", primary: true }, // Add Invoice primary action
  { icon: BarChart3, label: "Summary", href: "/summary" },
  { icon: Users, label: "More", href: "/settings" }, // Re-using Users for more/settings placeholder
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden border-t border-border/50 bg-background/80 backdrop-blur-md pb-safe fixed bottom-0 left-0 right-0 z-50">
      <div className="flex justify-around items-end h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -translate-y-4"
              >
                <div className="bg-primary p-3 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-primary">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn("w-5 h-5 mb-1", isActive && "stroke-[2.5px]")}
              />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
