"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, BarChart3, Settings, BookText } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Users, label: "Sellers", href: "/" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: BarChart3, label: "Summary", href: "/summary" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[190px] bg-surface border-r border-border/50 h-screen sticky top-0 p-4">
      <div className="flex items-center gap-2 px-1 mb-10 mt-2">
        <div className="bg-primary p-1.5 rounded-lg shadow-sm">
          <BookText className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-primary">
          Invoice-IQ
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs border border-border">
            AK
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none">Amar Kirana</span>
            <span className="text-[10px] text-muted-foreground">
              Premium Plan
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
