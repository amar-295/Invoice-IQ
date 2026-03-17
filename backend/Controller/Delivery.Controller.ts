
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductSellerModel } from "../Models/delivery.model";
import { SellerModel } from "../Models/seller.model";
import { ProductModel } from "../Models/product.model";

export const createManualDeliveryProductController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { sellerId, name, unit } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User ID is missing. Please log in again." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Authenticated userId is invalid." });
        }

        if (!sellerId || !name || !unit) {
            return res.status(400).json({ message: "sellerId, name and unit are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(String(sellerId))) {
            return res.status(400).json({ message: "sellerId must be a valid ObjectId." });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const sellerObjectId = new mongoose.Types.ObjectId(String(sellerId));

        const sellerExists = await SellerModel.exists({ _id: sellerObjectId, userId: userObjectId });
        if (!sellerExists) {
            return res.status(404).json({ message: "Seller not found for this user." });
        }

        const trimmedName = String(name).trim();
        const trimmedUnit = String(unit).trim();

        if (!trimmedName || !trimmedUnit) {
            return res.status(400).json({ message: "name and unit cannot be empty." });
        }

        const normalizedName = trimmedName.toLowerCase();

        const existingProduct = await ProductModel.findOne({
            userId: userObjectId,
            sellerId: sellerObjectId,
            normalizedName
        }).lean();

        if (existingProduct) {
            return res.status(200).json({
                message: "Product already exists for this seller.",
                data: existingProduct
            });
        }

        const newProduct = new ProductModel({
            sellerId: sellerObjectId,
            userId: userObjectId,
            name: trimmedName,
            unit: trimmedUnit,
            normalizedName,
            allies: []
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json({
            message: "Product created successfully.",
            data: savedProduct
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e?.message || "Unknown error"
        });
    }
};

export const getManualDeliveryFormDataController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "User ID is missing. Please log in again." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Authenticated userId is invalid." });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const [sellers, products] = await Promise.all([
            SellerModel.find({ userId: userObjectId })
                .select({ _id: 1, name: 1, mobile: 1, address: 1 })
                .sort({ name: 1 })
                .lean(),
            ProductModel.find({ userId: userObjectId })
                .select({ _id: 1, sellerId: 1, name: 1, unit: 1, normalizedName: 1, allies: 1 })
                .sort({ name: 1 })
                .lean()
        ]);

        return res.status(200).json({
            message: "Manual delivery form data fetched successfully.",
            data: {
                sellers,
                products
            }
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e?.message || "Unknown error"
        });
    }
};

export const addDeliveryByManualController = async (req: Request, res: Response): Promise<Response> => {
    try{
        const userId = req.userId;
        const { sellerId, productId, unit, quantity, price, date } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "User ID is missing. Please log in again."
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Authenticated userId is invalid."
            });
        }

        if (!sellerId || !productId || !unit) {
            return res.status(400).json({
                message: "sellerId, productId and unit are required."
            });
        }

        if (!mongoose.Types.ObjectId.isValid(String(sellerId)) || !mongoose.Types.ObjectId.isValid(String(productId))) {
            return res.status(400).json({
                message: "sellerId and productId must be valid ObjectIds."
            });
        }

        if (!quantity || !price) {
            return res.status(400).json({
                message: "quantity and price are required."
            });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const sellerObjectId = new mongoose.Types.ObjectId(String(sellerId));
        const productObjectId = new mongoose.Types.ObjectId(String(productId));

        const [sellerExists, productExists] = await Promise.all([
            SellerModel.exists({ _id: sellerObjectId, userId: userObjectId }),
            ProductModel.findOne({ _id: productObjectId, userId: userObjectId, sellerId: sellerObjectId })
                .select({ _id: 1, unit: 1 })
                .lean()
        ]);

        if (!sellerExists) {
            return res.status(404).json({
                message: "Seller not found for this user."
            });
        }

        if (!productExists) {
            return res.status(404).json({
                message: "Product not found for the selected seller."
            });
        }

        const trimmedQuantity = String(quantity).trim();
        const trimmedPrice = String(price).trim();
        const trimmedUnit = String(unit).trim();

        if (!trimmedUnit) {
            return res.status(400).json({
                message: "unit cannot be empty."
            });
        }

        if (String(productExists.unit).trim().toLowerCase() !== trimmedUnit.toLowerCase()) {
            return res.status(400).json({
                message: "Provided unit does not match the product unit."
            });
        }

        if (!trimmedQuantity || !trimmedPrice) {
            return res.status(400).json({
                message: "quantity and price cannot be empty."
            });
        }

        const numericPrice = Number(trimmedPrice.replace(/[^\d.-]/g, ""));
        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                message: "price must be a valid positive number or zero."
            });
        }

        const parsedDate = date ? new Date(String(date)) : new Date();
        if (Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                message: "date must be a valid date value."
            });
        }

        const manualDelivery = new ProductSellerModel({
            userId: userObjectId,
            sellerId: sellerObjectId,
            productId: productObjectId,
            unit: trimmedUnit,
            quantity: trimmedQuantity,
            price: trimmedPrice,
            date: parsedDate,
            source: "Manual"
        });

        const savedDelivery = await manualDelivery.save();

        return res.status(201).json({
            message: "Delivery added manually successfully.",
            data: savedDelivery
        });
    }
    catch(e: any){
        return res.status(500).json({
            message: "Internal Server Error",
            error: e?.message || "Unknown error"
        });
    }
}