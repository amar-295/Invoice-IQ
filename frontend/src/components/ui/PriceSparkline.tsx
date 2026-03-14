"use client";

import { useMemo } from "react";

/**
 * Lead Developer Tip:
 * A Sparkline is a tiny chart used to show a trend. 
 * Instead of a heavy charting library, we build it directly 
 * with a single SVG <polyline> which is 100x faster to render.
 */
export function PriceSparkline({ data, variant = "neutral" }: { data: number[], variant?: "up" | "down" | "neutral" }) {
  const pathData = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 30;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(" ");
  }, [data]);

  const fillPathData = `${pathData} L 100 30 L 0 30 Z`;

  const colorConfig = {
    up: { stroke: "stroke-spike", fill: "fill-spike/5" },
    down: { stroke: "stroke-stable", fill: "fill-stable/5" },
    neutral: { stroke: "stroke-azure", fill: "fill-azure/5" }
  }[variant];

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="30" className="overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className={`stop-${variant}-top`} style={{ stopOpacity: 0.1 }} />
            <stop offset="100%" className={`stop-${variant}-bottom`} style={{ stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path
          d={fillPathData}
          className={cn(colorConfig.fill)}
        />
        <path
          d={pathData}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(colorConfig.stroke, "transition-all duration-700")}
        />
      </svg>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
