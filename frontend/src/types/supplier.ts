export type TrendDirection = "up" | "down" | "neutral";

export interface Supplier {
  id: string;
  name: string;
  category: string;
  status: string;
  statusVariant: "azure" | "stable" | "spike";
  itemCount: number;
  spikeCount: number;
  prices: number[];
}

/**
 * Lead Developer Logic:
 * Automatically determine if a price trend is positive (Bad for shopkeeper)
 * or negative (Good for profit).
 */
export function getTrendDirection(prices: number[]): TrendDirection {
  if (prices.length < 2) return "neutral";
  const start = prices[0];
  const end = prices[prices.length - 1];

  if (end > start * 1.05) return "up"; // Significant increase
  if (end < start * 0.95) return "down"; // Significant decrease
  return "neutral";
}
