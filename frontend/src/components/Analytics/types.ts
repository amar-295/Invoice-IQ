export type FilterKey =
  | "last7Days"
  | "lastMonth"
  | "last6Months"
  | "lastYear"
  | "custom";

export type InsightDirection = "up" | "down";

export interface Insight {
  id: string;
  text: string;
  direction: InsightDirection;
}

export interface AnalyticsData {
  totalSpending: number;
  activeSuppliers: number;
  totalDeliveries: number;
  mostPurchasedProduct: string;
  spendingOverTime: { label: string; value: number }[];
  supplierSpending: { name: string; value: number }[];
  topProducts: { name: string; value: number; unit: string }[];
  insights: Insight[];
}

export const EMPTY_ANALYTICS_DATA: AnalyticsData = {
  totalSpending: 0,
  activeSuppliers: 0,
  totalDeliveries: 0,
  mostPurchasedProduct: "-",
  spendingOverTime: [],
  supplierSpending: [],
  topProducts: [],
  insights: [],
};
