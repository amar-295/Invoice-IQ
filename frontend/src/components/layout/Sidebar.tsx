"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { icon: Users, label: "Sellers", href: "/sellers" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: BarChart3, label: "Summary", href: "/summary" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-[210px] bg-surface border-r border-border/10 h-screen sticky top-0 p-5">
      <div className="flex items-center gap-2 px-1 mb-12 mt-4">
        <Link href="/" className="flex items-center">
          <Image 
            src="/Logo.png" 
            alt="Invoice-IQ Logo" 
            width={140} 
            height={40} 
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-4 mt-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold tracking-tight transition-all duration-300 ease-premium group active:scale-95 hover:translate-x-1",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-btn" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <Icon className={cn("w-4 h-4 transition-transform duration-300 ease-premium group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border/10">
        <div className="flex items-center justify-between px-1">
          {/* Avatar/Logo */}
          <Button variant="glossy" size="icon-sm" className="rounded-lg font-bold text-[10px] border border-border shadow-sm shrink-0">
            AK
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              size="icon-sm"
              variant="ghost"
              className="rounded-lg text-muted-foreground hover:text-primary transition-colors shrink-0"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
