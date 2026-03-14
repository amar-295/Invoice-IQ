"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Audit Update:
 * - Standardized to use CSS variables (--primary, --border, etc.)
 * - Improved responsive behavior: "+ Create Seller" hidden on mobile as per PRD patterns.
 */
export function TopNav({ 
  title, 
  showBack = false, 
  actionText,
  onBack 
}: { 
  title?: React.ReactNode, 
  showBack?: boolean, 
  actionText?: string,
  onBack?: () => void
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 h-16 border-b border-border/5 bg-background/60 backdrop-blur-xl sticky top-0 z-40 w-full lg:hidden">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button 
            onClick={onBack}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
        ) : (
          <Link href="/" className="flex items-center">
            <Image 
              src="/Logo.png" 
              alt="Invoice-IQ Logo" 
              width={100} 
              height={30} 
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        )}
      </div>

      {title && (
        <div className="text-sm font-bold absolute left-1/2 -translate-x-1/2 text-foreground">
          {title}
        </div>
      )}

      <div className="flex items-center gap-2">
        {mounted && (
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
        {!showBack && (
          <Button variant="glossy" size="icon-sm" className="rounded-xl font-bold text-xs border border-border shadow-sm shrink-0">
            AK
          </Button>
        )}
      </div>
    </nav>
  );
}
