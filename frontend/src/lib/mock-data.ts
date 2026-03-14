import { Supplier } from "@/types/supplier";

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "1",
    name: "Om Trading Co.",
    category: "Oil & Ghee",
    status: "Active",
    statusVariant: "azure",
    itemCount: 12,
    spikeCount: 0,
    prices: [120, 125, 122, 130, 128]
  },
  {
    id: "2",
    name: "Bharat Distributors",
    category: "Grains & Pulses",
    status: "3 Spikes",
    statusVariant: "spike",
    itemCount: 45,
    spikeCount: 3,
    prices: [100, 105, 115, 140, 165]
  },
  {
    id: "3",
    name: "Sai Dairy Products",
    category: "Dairy",
    status: "Saving",
    statusVariant: "stable",
    itemCount: 8,
    spikeCount: 0,
    prices: [95, 90, 92, 85, 80]
  },
  {
    id: "4",
    name: "Laxmi Spices",
    category: "Spices",
    status: "1 Spike",
    statusVariant: "spike",
    itemCount: 22,
    spikeCount: 1,
    prices: [200, 210, 205, 230, 225]
  }
];

export const CATEGORIES = [
  "All",
  "Oil & Ghee",
  "Grains & Pulses",
  "Dairy",
  "Spices",
  "Beverages",
  "Cleaning"
];
