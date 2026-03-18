"use client";

import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Audit Update:
 * - Standardized to use CSS variables (--primary, --border, etc.)
 * - Improved responsive behavior: "+ Create Seller" hidden on mobile as per PRD patterns.
 */
export function TopNav({
  title,
  showBack = false,
  onBack,
}: {
  title?: React.ReactNode;
  showBack?: boolean;
  actionText?: string;
  onBack?: () => void;
}) {
  return (
    <nav className="flex items-center justify-between px-6 h-14 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40 w-full lg:hidden">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
        ) : (
          <div className="text-lg font-bold tracking-tight text-primary">
            Invoice<span className="text-foreground/80">IQ</span>
          </div>
        )}
      </div>

      {title && (
        <div className="text-sm font-bold absolute left-1/2 -translate-x-1/2 text-foreground">
          {title}
        </div>
      )}

      <div className="flex items-center gap-3">
        {!showBack && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden text-primary"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs border border-border">
              AK
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
