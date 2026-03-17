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