import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductSellerModel } from "../Models/delivery.model";
import { ProductModel } from "../Models/product.model";
import { SellerModel } from "../Models/seller.model";

type TrendPoint = {
    label: string;
    amount: number;
};

type SourceBreakdown = {
    source: "Manual" | "Image" | "AI";
    totalAmount: number;
    count: number;
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parseNumber = (value: unknown): number => {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (typeof value !== "string") {
        return 0;
    }

    const numeric = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
};

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

const buildRecentTrend = async (): Promise<TrendPoint[]> => {
    const now = new Date();
    const months: { start: Date; end: Date; label: string }[] = [];

    for (let offset = 2; offset >= 0; offset -= 1) {
        const year = now.getFullYear();
        const month = now.getMonth() - offset;
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 1);
        months.push({
            start,
            end,
            label: monthLabels[start.getMonth()] || "N/A"
        });
    }

    const trend = await Promise.all(
        months.map(async (item) => {
            const deliveries = await ProductSellerModel.find({
                date: { $gte: item.start, $lt: item.end }
            })
                .select({ price: 1 })
                .lean();

            const amount = deliveries.reduce((sum, delivery) => sum + parseNumber(delivery.price), 0);
            return {
                label: item.label,
                amount: roundToTwo(amount)
            };
        })
    );

    return trend;
};

export const dashboardDataController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const now = new Date();
        const month = Number(req.query.month ?? now.getMonth() + 1);
        const year = Number(req.query.year ?? now.getFullYear());
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "User ID is missing. Please log in again." });
        }

        if (!Number.isInteger(month) || month < 1 || month > 12) {
            return res.status(400).json({ message: "month must be between 1 and 12." });
        }

        if (!Number.isInteger(year) || year < 1970 || year > 3000) {
            return res.status(400).json({ message: "year must be a valid 4-digit value." });
        }

        let userObjectId: mongoose.Types.ObjectId | undefined;
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "userId must be a valid ObjectId." });
            }
            userObjectId = new mongoose.Types.ObjectId(userId);
        }

        const startOfMonth = new Date(year, month - 1, 1);
        const startOfNextMonth = new Date(year, month, 1);

        const deliveryFilter = {
            date: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        };

        const productFilter = userObjectId ? { userId: userObjectId } : {};
        const sellerFilter = userObjectId ? ({ userId: userObjectId } as unknown as Record<string, unknown>) : {};

        const [
            monthlyDeliveries,
            recentDeliveries,
            activeSuppliers,
            topItems,
            monthlyTrend
        ] = await Promise.all([
            ProductSellerModel.find(deliveryFilter).lean(),
            ProductSellerModel.find(deliveryFilter)
                .sort({ date: -1 })
                .limit(10)
                .lean(),
            SellerModel.countDocuments(sellerFilter),
            ProductModel.aggregate([
                { $match: productFilter },
                { $group: { _id: "$name", total: { $sum: 1 } } },
                { $sort: { total: -1, _id: 1 } },
                { $limit: 5 },
                { $project: { _id: 0, name: "$_id", total: 1 } }
            ]),
            buildRecentTrend()
        ]);

        const totalSpendThisMonth = roundToTwo(
            monthlyDeliveries.reduce((sum, delivery) => sum + parseNumber(delivery.price), 0)
        );

        const itemsPurchasedThisMonth = monthlyDeliveries.reduce((sum, delivery) => {
            const parsedQuantity = parseNumber(delivery.quantity);
            return sum + (parsedQuantity > 0 ? parsedQuantity : 1);
        }, 0);

        const averagePrice = monthlyDeliveries.length > 0 ? totalSpendThisMonth / monthlyDeliveries.length : 0;
        const priceAlertThreshold = averagePrice * 1.15;
        const alertDeliveries = monthlyDeliveries
            .filter((delivery) => parseNumber(delivery.price) > priceAlertThreshold)
            .sort((left, right) => parseNumber(right.price) - parseNumber(left.price))
            .slice(0, 5)
            .map((delivery) => {
                const currentPrice = parseNumber(delivery.price);
                return {
                    id: String(delivery._id),
                    date: delivery.date,
                    source: delivery.source,
                    quantity: delivery.quantity,
                    price: currentPrice,
                    averagePrice: roundToTwo(averagePrice),
                    excessAmount: roundToTwo(currentPrice - averagePrice)
                };
            });
        const priceAlerts = alertDeliveries.length;

        const deliveriesBySourceMap = monthlyDeliveries.reduce<Record<string, SourceBreakdown>>((accumulator, delivery) => {
            const key = delivery.source;
            const current = accumulator[key] ?? {
                source: delivery.source,
                totalAmount: 0,
                count: 0
            };

            current.totalAmount += parseNumber(delivery.price);
            current.count += 1;
            accumulator[key] = current;
            return accumulator;
        }, {});

        const deliveriesBySource = Object.values(deliveriesBySourceMap)
            .map((item) => ({
                ...item,
                totalAmount: roundToTwo(item.totalAmount)
            }))
            .sort((left, right) => right.totalAmount - left.totalAmount);

        const aiSummary = [
            `In ${monthLabels[month - 1]}, total spend was ₹${totalSpendThisMonth.toLocaleString("en-IN")}.`,
            `${activeSuppliers} active supplier(s) and ${Math.round(itemsPurchasedThisMonth)} item unit(s) were recorded.`,
            `${priceAlerts} potential high-price delivery alert(s) were identified.`
        ].join(" ");

        return res.status(200).json({
            message: "Dashboard data fetched successfully.",
            data: {
                period: {
                    month,
                    year,
                    startDate: startOfMonth,
                    endDate: new Date(startOfNextMonth.getTime() - 1)
                },
                stats: {
                    totalSpendThisMonth,
                    activeSuppliers,
                    itemsPurchasedThisMonth: Math.round(itemsPurchasedThisMonth),
                    priceAlerts
                },
                recentDeliveries: recentDeliveries.map((delivery) => ({
                    id: String(delivery._id),
                    date: delivery.date,
                    quantity: delivery.quantity,
                    price: delivery.price,
                    source: delivery.source,
                    invoiceImageUrl: delivery.invoiceImageUrl || null
                })),
                alertDeliveries,
                deliveriesBySource,
                topItems,
                monthlyTrend,
                aiSummary,
                notes: {
                    scope: userObjectId
                        ? "Products and suppliers are filtered by userId. Deliveries are global because ProductSeller schema has no userId relation yet."
                        : "Global dashboard (all users) based on current schema."
                }
            }
        });
    }
    catch (e) {
        console.error("Error fetching dashboard data:", e);
        return res.status(500).json({ error: "An error occurred while fetching dashboard data." });
    }
};

export const reportController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: "User ID is missing or invalid. Please log in again." });
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "startDate and endDate query params are required (YYYY-MM-DD)." });
        }

        const start = new Date(String(startDate));
        const end = new Date(String(endDate));
        end.setHours(23, 59, 59, 999);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "startDate and endDate must be valid dates (YYYY-MM-DD)." });
        }
        if (start > end) {
            return res.status(400).json({ message: "startDate must be before or equal to endDate." });
        }

        const dateFilter = {
            userId: userObjectId,
            date: { $gte: start, $lte: end }
        };

        // Fetch all deliveries for this user in the date range
        const deliveries = await ProductSellerModel.find(dateFilter).lean();

        const totalSpend = roundToTwo(deliveries.reduce((sum, d) => sum + parseNumber(d.price), 0));
        const deliveryCount = deliveries.length;
        const uniqueSellers = new Set(deliveries.map((d) => String(d.sellerId))).size;
        const uniqueProducts = new Set(deliveries.map((d) => String(d.productId))).size;

        // Supplier breakdown
        const sellerMap = new Map<string, { totalSpend: number; deliveryCount: number }>();
        for (const d of deliveries) {
            const key = String(d.sellerId);
            const current = sellerMap.get(key) ?? { totalSpend: 0, deliveryCount: 0 };
            current.totalSpend += parseNumber(d.price);
            current.deliveryCount += 1;
            sellerMap.set(key, current);
        }

        const sellerIds = [...sellerMap.keys()].map((id) => new mongoose.Types.ObjectId(id));
        const sellers = await SellerModel.find({ _id: { $in: sellerIds } }).select({ name: 1 }).lean();
        const sellerNameMap = new Map(sellers.map((s) => [String(s._id), s.name]));

        const supplierBreakdown = [...sellerMap.entries()]
            .map(([id, data]) => ({
                name: sellerNameMap.get(id) ?? "Unknown",
                totalSpend: roundToTwo(data.totalSpend),
                deliveryCount: data.deliveryCount,
                avgOrderValue: roundToTwo(data.deliveryCount > 0 ? data.totalSpend / data.deliveryCount : 0),
                percentOfTotal: roundToTwo(totalSpend > 0 ? (data.totalSpend / totalSpend) * 100 : 0),
            }))
            .sort((a, b) => b.totalSpend - a.totalSpend);

        // Product breakdown
        const productMap = new Map<string, { totalSpend: number; totalQty: number; deliveryCount: number; prices: number[] }>();
        for (const d of deliveries) {
            const key = String(d.productId);
            const current = productMap.get(key) ?? { totalSpend: 0, totalQty: 0, deliveryCount: 0, prices: [] };
            const price = parseNumber(d.price);
            const qty = parseNumber(d.quantity);
            current.totalSpend += price;
            current.totalQty += qty > 0 ? qty : 1;
            current.deliveryCount += 1;
            current.prices.push(price);
            productMap.set(key, current);
        }

        const productIds = [...productMap.keys()].map((id) => new mongoose.Types.ObjectId(id));
        const products = await ProductModel.find({ _id: { $in: productIds } }).select({ name: 1, unit: 1 }).lean();
        const productInfoMap = new Map(products.map((p) => [String(p._id), { name: p.name, unit: p.unit }]));

        const productBreakdown = [...productMap.entries()]
            .map(([id, data]) => {
                const info = productInfoMap.get(id) ?? { name: "Unknown", unit: "" };
                return {
                    name: info.name,
                    unit: info.unit,
                    avgPrice: roundToTwo(data.prices.length > 0 ? data.totalSpend / data.prices.length : 0),
                    minPrice: roundToTwo(Math.min(...data.prices)),
                    maxPrice: roundToTwo(Math.max(...data.prices)),
                    totalQty: roundToTwo(data.totalQty),
                    deliveryCount: data.deliveryCount,
                };
            })
            .sort((a, b) => b.deliveryCount - a.deliveryCount);

        // Delivery log — join seller and product names
        const allSellerIds = deliveries.map((d) => new mongoose.Types.ObjectId(String(d.sellerId)));
        const allProductIds = deliveries.map((d) => new mongoose.Types.ObjectId(String(d.productId)));

        const [logSellers, logProducts] = await Promise.all([
            SellerModel.find({ _id: { $in: allSellerIds } }).select({ name: 1 }).lean(),
            ProductModel.find({ _id: { $in: allProductIds } }).select({ name: 1 }).lean(),
        ]);

        const logSellerMap = new Map(logSellers.map((s) => [String(s._id), s.name]));
        const logProductMap = new Map(logProducts.map((p) => [String(p._id), p.name]));

        const deliveryLog = deliveries
            .map((d) => ({
                id: String(d._id),
                date: d.date,
                sellerName: logSellerMap.get(String(d.sellerId)) ?? "Unknown",
                productName: logProductMap.get(String(d.productId)) ?? "Unknown",
                quantity: d.quantity,
                unit: d.unit,
                price: d.price,
                source: d.source,
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return res.status(200).json({
            message: "Report data fetched successfully.",
            data: {
                summary: { totalSpend, deliveryCount, uniqueSellers, uniqueProducts },
                supplierBreakdown,
                productBreakdown,
                deliveryLog,
            },
        });
    } catch (e) {
        console.error("Error fetching report data:", e);
        return res.status(500).json({ error: "An error occurred while fetching report data." });
    }
};