"use client";

import { useMemo } from "react";

/**
 * Lead Developer Tip:
 * A Sparkline is a tiny chart used to show a trend. 
 * Instead of a heavy charting library, we build it directly 
 * with a single SVG <polyline> which is 100x faster to render.
 */
export function PriceSparkline({ data, variant = "neutral" }: { data: number[], variant?: "up" | "down" | "neutral" }) {
  const points = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 20;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
  }, [data]);

  const color = {
    up: "stroke-spike",    // Red if trending up (bad for shopkeeper)
    down: "stroke-stable",  // Green if trending down (good)
    neutral: "stroke-azure"
  }[variant];

  return (
    <svg width="80" height="20" className="overflow-visible">
      <polyline
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={cn(color, "transition-all duration-700")}
      />
    </svg>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
