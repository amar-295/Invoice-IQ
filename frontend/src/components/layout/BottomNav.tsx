"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, BarChart3, Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Users, label: "Sellers", href: "/sellers" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Plus, label: "Add", href: "/add-invoice", primary: true }, // Add Invoice primary action
  { icon: BarChart3, label: "Summary", href: "/summary" },
  { icon: MoreHorizontal, label: "More", href: "/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-6 flex justify-center">
      <div className="flex justify-between items-center h-[58px] bg-background/20 border border-primary/10 rounded-[20px] backdrop-blur-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.2)] px-4 w-full max-w-[360px]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center -translate-y-4"
              >
                <div className="bg-primary p-2.5 rounded-full shadow-[0_4px_15px_rgba(30,58,138,0.4)] active:scale-90 transition-all duration-300">
                  <Plus className="w-5 h-5 text-white stroke-[2.5px]" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              <Icon className={cn("w-4 h-4 mb-1", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
              <span className={cn(
                "text-[10px] tracking-tight leading-none capitalize",
                isActive ? "font-semibold" : "font-normal"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
