import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductSellerModel } from "../Models/delivery.model";
import { ProductModel } from "../Models/product.model";
import { SellerModel } from "../Models/seller.model";

type FilterKey = "last7Days" | "lastMonth" | "last6Months" | "lastYear" | "custom";
type InsightDirection = "up" | "down";

type Insight = {
	id: string;
	text: string;
	direction: InsightDirection;
};

const parseNumericValue = (value: unknown): number => {
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : 0;
	}

	if (typeof value !== "string") {
		return 0;
	}

	const parsed = Number(value.replace(/[^\d.-]/g, ""));
	return Number.isFinite(parsed) ? parsed : 0;
};

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

const monthLabel = (date: Date): string =>
	date.toLocaleString("en-IN", { month: "short", timeZone: "UTC" });

const weekdayLabel = (date: Date): string =>
	date.toLocaleString("en-IN", { weekday: "short", timeZone: "UTC" });

const startOfDay = (date: Date): Date => {
	const value = new Date(date);
	value.setHours(0, 0, 0, 0);
	return value;
};

const endOfDay = (date: Date): Date => {
	const value = new Date(date);
	value.setHours(23, 59, 59, 999);
	return value;
};

const resolveDateRange = (filter: FilterKey, from?: string, to?: string): { start: Date; end: Date; filter: FilterKey } => {
	const now = new Date();

	if (filter === "custom") {
		const customFrom = from ? new Date(from) : null;
		const customTo = to ? new Date(to) : null;

		if (
			customFrom &&
			customTo &&
			!Number.isNaN(customFrom.getTime()) &&
			!Number.isNaN(customTo.getTime()) &&
			customFrom <= customTo
		) {
			return {
				start: startOfDay(customFrom),
				end: endOfDay(customTo),
				filter
			};
		}
	}

	if (filter === "last7Days") {
		const start = new Date(now);
		start.setDate(start.getDate() - 6);
		return { start: startOfDay(start), end: endOfDay(now), filter };
	}

	if (filter === "lastMonth") {
		const start = new Date(now);
		start.setDate(start.getDate() - 29);
		return { start: startOfDay(start), end: endOfDay(now), filter };
	}

	if (filter === "lastYear") {
		const start = new Date(now);
		start.setFullYear(start.getFullYear() - 1);
		start.setDate(start.getDate() + 1);
		return { start: startOfDay(start), end: endOfDay(now), filter };
	}

	const start = new Date(now);
	start.setMonth(start.getMonth() - 5);
	start.setDate(1);
	return { start: startOfDay(start), end: endOfDay(now), filter: "last6Months" };
};

const createTimeSeries = (
	filter: FilterKey,
	deliveries: Array<{ date: Date; priceValue: number }>,
	rangeStart: Date,
	rangeEnd: Date
): Array<{ label: string; value: number }> => {
	const buckets = new Map<string, { label: string; value: number; sortKey: number }>();

	if (filter === "last7Days") {
		for (let i = 0; i < 7; i += 1) {
			const current = new Date(rangeStart);
			current.setDate(rangeStart.getDate() + i);
			const key = current.toISOString().slice(0, 10);
			buckets.set(key, { label: weekdayLabel(current), value: 0, sortKey: current.getTime() });
		}
	}

	if (filter === "lastMonth") {
		const oneDayMs = 24 * 60 * 60 * 1000;
		const totalDays = Math.max(1, Math.floor((rangeEnd.getTime() - rangeStart.getTime()) / oneDayMs) + 1);
		const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
		for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex += 1) {
			const weekStart = new Date(rangeStart);
			weekStart.setDate(rangeStart.getDate() + weekIndex * 7);
			const key = `week-${weekIndex + 1}`;
			buckets.set(key, { label: `Week ${weekIndex + 1}`, value: 0, sortKey: weekStart.getTime() });
		}
	}

	if (filter === "last6Months" || filter === "lastYear" || filter === "custom") {
		const useDayBucketsForCustom =
			filter === "custom" && (rangeEnd.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000) <= 31;

		if (useDayBucketsForCustom) {
			const cursor = new Date(rangeStart);
			while (cursor <= rangeEnd) {
				const key = cursor.toISOString().slice(0, 10);
				buckets.set(key, {
					label: cursor.toLocaleDateString("en-IN", { day: "2-digit", month: "short", timeZone: "UTC" }),
					value: 0,
					sortKey: cursor.getTime()
				});

				cursor.setDate(cursor.getDate() + 1);
			}
		} else {
			const cursor = new Date(Date.UTC(rangeStart.getUTCFullYear(), rangeStart.getUTCMonth(), 1));
			const rangeEndMonth = new Date(Date.UTC(rangeEnd.getUTCFullYear(), rangeEnd.getUTCMonth(), 1));

			while (cursor <= rangeEndMonth) {
				const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`;
				buckets.set(key, {
					label: monthLabel(cursor),
					value: 0,
					sortKey: cursor.getTime()
				});

				cursor.setUTCMonth(cursor.getUTCMonth() + 1);
			}
		}
	}

	for (const delivery of deliveries) {
		const deliveryDate = new Date(delivery.date);

		if (filter === "last7Days") {
			const key = deliveryDate.toISOString().slice(0, 10);
			const bucket = buckets.get(key);
			if (bucket) {
				bucket.value += delivery.priceValue;
			}
			continue;
		}

		if (filter === "lastMonth") {
			const oneDayMs = 24 * 60 * 60 * 1000;
			const dayOffset = Math.floor((deliveryDate.getTime() - rangeStart.getTime()) / oneDayMs);
			const weekNumber = Math.floor(dayOffset / 7) + 1;
			const key = `week-${Math.max(1, weekNumber)}`;
			const bucket = buckets.get(key);
			if (bucket) {
				bucket.value += delivery.priceValue;
			}
			continue;
		}

		const isCustomShortRange =
			filter === "custom" && (rangeEnd.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000) <= 31;

		const key = isCustomShortRange
			? deliveryDate.toISOString().slice(0, 10)
			: `${deliveryDate.getUTCFullYear()}-${String(deliveryDate.getUTCMonth() + 1).padStart(2, "0")}`;

		const bucket = buckets.get(key);
		if (bucket) {
			bucket.value += delivery.priceValue;
		}
	}

	return Array.from(buckets.values())
		.sort((a, b) => a.sortKey - b.sortKey)
		.map((item) => ({ label: item.label, value: roundToTwo(item.value) }));
};

export const getAnalyticsSummaryController = async (req: Request, res: Response): Promise<Response> => {
	try {
		const userId = req.userId;
		const filter = String(req.query.filter || "last6Months") as FilterKey;
		const from = req.query.from ? String(req.query.from) : undefined;
		const to = req.query.to ? String(req.query.to) : undefined;

		if (!userId) {
			return res.status(401).json({ message: "User ID is missing. Please log in again." });
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Authenticated userId is invalid." });
		}

		const allowedFilters: FilterKey[] = ["last7Days", "lastMonth", "last6Months", "lastYear", "custom"];
		const safeFilter = allowedFilters.includes(filter) ? filter : "last6Months";
		const { start, end, filter: resolvedFilter } = resolveDateRange(safeFilter, from, to);

		const userObjectId = new mongoose.Types.ObjectId(userId);

		const deliveries = await ProductSellerModel.find({
			userId: userObjectId,
			date: { $gte: start, $lte: end }
		})
			.select({ _id: 1, sellerId: 1, productId: 1, unit: 1, quantity: 1, price: 1, date: 1 })
			.sort({ date: -1 })
			.lean();

		if (deliveries.length === 0) {
			return res.status(200).json({
				message: "Analytics fetched successfully.",
				data: {
					totalSpending: 0,
					activeSuppliers: 0,
					totalDeliveries: 0,
					mostPurchasedProduct: "-",
					spendingOverTime: [],
					supplierSpending: [],
					topProducts: [],
					insights: []
				}
			});
		}

		const productIds = Array.from(new Set(deliveries.map((item) => String(item.productId))));
		const sellerIds = Array.from(new Set(deliveries.map((item) => String(item.sellerId))));

		const [products, sellers] = await Promise.all([
			ProductModel.find({ _id: { $in: productIds } }).select({ _id: 1, name: 1, unit: 1 }).lean(),
			SellerModel.find({ _id: { $in: sellerIds }, userId: userObjectId }).select({ _id: 1, name: 1 }).lean()
		]);

		const productMap = new Map(products.map((item) => [String(item._id), item]));
		const sellerMap = new Map(sellers.map((item) => [String(item._id), item]));

		const parsedDeliveries = deliveries.map((delivery) => {
			const priceValue = parseNumericValue(delivery.price);
			const quantityValue = parseNumericValue(delivery.quantity);

			return {
				...delivery,
				priceValue,
				quantityValue,
				productName: productMap.get(String(delivery.productId))?.name || "Unknown Product",
				productUnit: productMap.get(String(delivery.productId))?.unit || delivery.unit,
				sellerName: sellerMap.get(String(delivery.sellerId))?.name || "Unknown Supplier"
			};
		});

		const totalSpending = roundToTwo(parsedDeliveries.reduce((sum, item) => sum + item.priceValue, 0));
		const activeSuppliers = new Set(parsedDeliveries.map((item) => String(item.sellerId))).size;
		const totalDeliveries = parsedDeliveries.length;

		const productQuantityMap = new Map<string, { name: string; unit: string; value: number }>();
		for (const delivery of parsedDeliveries) {
			const key = String(delivery.productId);
			const existing = productQuantityMap.get(key);

			if (existing) {
				existing.value += delivery.quantityValue;
			} else {
				productQuantityMap.set(key, {
					name: delivery.productName,
					unit: delivery.productUnit,
					value: delivery.quantityValue
				});
			}
		}

		const topProducts = Array.from(productQuantityMap.values())
			.sort((a, b) => b.value - a.value)
			.slice(0, 5)
			.map((item) => ({ ...item, value: roundToTwo(item.value) }));

		const mostPurchasedProduct = topProducts[0]?.name || "-";

		const supplierSpendingMap = new Map<string, { name: string; value: number }>();
		for (const delivery of parsedDeliveries) {
			const key = String(delivery.sellerId);
			const existing = supplierSpendingMap.get(key);

			if (existing) {
				existing.value += delivery.priceValue;
			} else {
				supplierSpendingMap.set(key, {
					name: delivery.sellerName,
					value: delivery.priceValue
				});
			}
		}

		const supplierSpending = Array.from(supplierSpendingMap.values())
			.sort((a, b) => b.value - a.value)
			.map((item) => ({ ...item, value: roundToTwo(item.value) }));

		const spendingOverTime = createTimeSeries(resolvedFilter, parsedDeliveries, start, end);

		const insights: Insight[] = [];
		const productDeliveryMap = new Map<string, typeof parsedDeliveries>();

		for (const delivery of parsedDeliveries) {
			const key = String(delivery.productId);
			const existing = productDeliveryMap.get(key);

			if (existing) {
				existing.push(delivery);
			} else {
				productDeliveryMap.set(key, [delivery]);
			}
		}

		for (const [key, records] of productDeliveryMap.entries()) {
			const sorted = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
			if (sorted.length < 2) {
				continue;
			}

			const latest = sorted[0];
			const previous = sorted[1];

			if (!latest || !previous || latest.quantityValue <= 0 || previous.quantityValue <= 0) {
				continue;
			}

			const latestPerUnit = latest.priceValue / latest.quantityValue;
			const previousPerUnit = previous.priceValue / previous.quantityValue;
			const delta = roundToTwo(latestPerUnit - previousPerUnit);

			if (delta === 0) {
				continue;
			}

			const direction: InsightDirection = delta > 0 ? "up" : "down";
			const absDelta = Math.abs(delta).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

			insights.push({
				id: `${key}-${latest._id}`,
				direction,
				text: `${latest.productName} price ${direction === "up" ? "increased" : "decreased"} by Rs ${absDelta}/${latest.productUnit} compared to previous purchase`
			});
		}

		const sortedInsights = insights
			.sort((a, b) => {
				const numberFromA = parseNumericValue(a.text.match(/Rs\s([\d.,]+)/)?.[1] || 0);
				const numberFromB = parseNumericValue(b.text.match(/Rs\s([\d.,]+)/)?.[1] || 0);
				return numberFromB - numberFromA;
			})
			.slice(0, 6);

		return res.status(200).json({
			message: "Analytics fetched successfully.",
			data: {
				totalSpending,
				activeSuppliers,
				totalDeliveries,
				mostPurchasedProduct,
				spendingOverTime,
				supplierSpending,
				topProducts,
				insights: sortedInsights
			}
		});
	} catch (e: any) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: e?.message || "Unknown error"
		});
	}
};
