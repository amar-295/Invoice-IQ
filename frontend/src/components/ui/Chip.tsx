"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border outline-none",
        active 
          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105" 
          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
