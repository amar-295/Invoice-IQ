import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductSellerModel } from "../Models/delivery.model";
import { ProductModel } from "../Models/product.model";
import { SellerModel } from "../Models/seller.model";

const parseNumber = (value: unknown): number => {
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

export const getProductDetailController = async (req: Request, res: Response): Promise<Response> => {
	try {
		const userId = req.userId;
		const { sellerId, productId } = req.params;

		if (!userId) {
			return res.status(401).json({ message: "User ID is missing. Please log in again." });
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Authenticated userId is invalid." });
		}

		if (!sellerId || !mongoose.Types.ObjectId.isValid(String(sellerId))) {
			return res.status(400).json({ message: "sellerId must be a valid ObjectId." });
		}

		if (!productId || !mongoose.Types.ObjectId.isValid(String(productId))) {
			return res.status(400).json({ message: "productId must be a valid ObjectId." });
		}

		const userObjectId = new mongoose.Types.ObjectId(userId);
		const sellerObjectId = new mongoose.Types.ObjectId(String(sellerId));
		const productObjectId = new mongoose.Types.ObjectId(String(productId));

		const [seller, product, deliveries] = await Promise.all([
			SellerModel.findOne({ _id: sellerObjectId, userId: userObjectId })
				.select({ _id: 1, name: 1 })
				.lean(),
			ProductModel.findOne({ _id: productObjectId, sellerId: sellerObjectId, userId: userObjectId })
				.select({ _id: 1, name: 1, sellerId: 1, unit: 1, normalizedName: 1, allies: 1 })
				.lean(),
			ProductSellerModel.find({ _id: { $exists: true }, productId: productObjectId, sellerId: sellerObjectId, userId: userObjectId })
				.select({ _id: 1, quantity: 1, unit: 1, price: 1, date: 1, source: 1 })
				.sort({ date: -1 })
				.lean()
		]);

		if (!seller) {
			return res.status(404).json({ message: "Seller not found for this user." });
		}

		if (!product) {
			return res.status(404).json({ message: "Product not found for this seller." });
		}

		const purchases = deliveries.map((delivery) => {
			const quantityValue = parseNumber(delivery.quantity);
			const totalPrice = parseNumber(delivery.price);
			const pricePerUnit = quantityValue > 0 ? roundToTwo(totalPrice / quantityValue) : roundToTwo(totalPrice);

			return {
				id: String(delivery._id),
				date: delivery.date,
				quantity: quantityValue,
				quantityLabel: delivery.quantity,
				unit: delivery.unit,
				totalPrice,
				priceLabel: delivery.price,
				pricePerUnit,
				source: delivery.source
			};
		});

		const totalSpend = roundToTwo(purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0));
		const totalQuantity = roundToTwo(purchases.reduce((sum, purchase) => sum + purchase.quantity, 0));
		const averagePricePerUnit = totalQuantity > 0 ? roundToTwo(totalSpend / totalQuantity) : 0;
		const latestPurchase = purchases[0] ?? null;
		const availableMonths = Array.from(new Set(
			purchases.map((purchase) => new Date(purchase.date).toISOString().slice(0, 7))
		));

		return res.status(200).json({
			message: "Product detail fetched successfully.",
			data: {
				id: String(product._id),
				name: product.name,
				sellerId: String(product.sellerId),
				sellerName: seller.name,
				unit: product.unit,
				normalizedName: product.normalizedName,
				allies: product.allies,
				purchases,
				analytics: {
					totalPurchases: purchases.length,
					totalSpend,
					totalQuantity,
					averagePricePerUnit,
					latestPurchaseDate: latestPurchase?.date ?? null,
					latestPurchasePricePerUnit: latestPurchase?.pricePerUnit ?? null,
					availableMonths
				}
			}
		});
	} catch (e: any) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: e?.message || "Unknown error"
		});
	}
};
