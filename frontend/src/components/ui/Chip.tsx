"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, active, onClick, className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2 rounded-full text-[11px] font-bold tracking-tight whitespace-nowrap transition-all duration-300 border outline-none active:scale-95 cursor-pointer",
        active 
          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" 
          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-primary/5",
        className
      )}
    >
      {label}
    </button>
  );
}
