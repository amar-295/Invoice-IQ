"use client";

import { Badge } from "@/components/ui/Badge";
import { PriceSparkline } from "@/components/ui/PriceSparkline";
import { Supplier, getTrendDirection } from "@/types/supplier";
import { ShoppingBag, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SellerCardProps {
  seller: Supplier;
}

/**
 * Senior Architecture Note:
 * This component is redesigned to maximize information density for the shopkeeper.
 * At a glance, they see: Trend, Spike Count, and Total Items being tracked.
 */
export function SellerCard({ seller }: SellerCardProps) {
  const trendDirection = getTrendDirection(seller.prices);
  const borderColor = {
    azure: "border-l-secondary",
    stable: "border-l-stable",
    spike: "border-l-spike"
  }[seller.statusVariant];

  return (
    <div className={cn(
      "flex justify-between items-center py-4 px-6 border-b border-border/30 last:border-0 hover:bg-muted/50 transition-all cursor-pointer group/item border-l-4",
      borderColor
    )}>
      <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground leading-tight">
              {seller.name}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[13px] text-muted-foreground font-normal uppercase tracking-wider bg-muted/60 px-1.5 py-0.5 rounded">
                {seller.category}
              </span>
              <span className="text-[13px] text-muted-foreground flex items-center gap-1 font-semibold">
                <ShoppingBag className="w-3.5 h-3.5" /> {seller.itemCount}
              </span>
            </div>
          </div>
      </div>
      
      <div className="flex items-center gap-6 h-full py-1">
        {/* Trend Section */}
        <div className="hidden sm:flex flex-col items-end gap-1 min-w-[80px]">
          <span className="text-[9px] font-bold text-muted-foreground uppercase">Price Trend</span>
          <PriceSparkline data={seller.prices} variant={trendDirection} />
        </div>

        {/* Status Area */}
        <div className="flex flex-col items-end justify-center min-w-[90px] h-10">
          <Badge 
            variant={seller.statusVariant} 
            className="font-bold py-1 px-3 shadow-sm group-hover/item:scale-105 transition-transform"
          >
            {seller.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
