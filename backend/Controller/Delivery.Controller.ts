
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductSellerModel } from "../Models/delivery.model";
import { SellerModel } from "../Models/seller.model";
import { ProductModel } from "../Models/product.model";
import { transformPromptToDeliveryItems } from "../utils/promptForTransforming";

const tesseract: {
    recognize: (image: Buffer | string, config?: Record<string, unknown>) => Promise<string>;
} = require("node-tesseract-ocr");

type DeliveryProductSnapshot = {
    _id: mongoose.Types.ObjectId;
    unit: string;
    name: string;
    normalizedName: string;
    allies?: Array<{ name: string }>;
};

const parseCurrencyValue = (value: string): number => {
    const numericValue = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isFinite(numericValue) ? numericValue : Number.NaN;
};

const formatDateInput = (value?: string): string => {
    const parsedDate = value ? new Date(String(value)) : new Date();
    if (Number.isNaN(parsedDate.getTime())) {
        return new Date().toISOString().split("T")[0] || "";
    }

    return parsedDate.toISOString().split("T")[0] || "";
};

const normalizeProductName = (value: string): string => {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const cleanOcrText = (ocrText: string): string => {
    return String(ocrText || "")
        .replace(/\r/g, "\n")
        .split("\n")
        .map((line) =>
            line
                .replace(/[|]/g, " ")
                .replace(/[^\w\s.,:/\-₹]/g, " ")
                .replace(/\s+/g, " ")
                .trim()
        )
        .filter((line) => line.length > 1)
        .join("\n");
};

const decodeImageBase64 = (value: string): Buffer => {
    const rawValue = String(value || "").trim();
    const base64Segment = rawValue.includes(",") ? rawValue.split(",")[1] || "" : rawValue;
    const decoded = Buffer.from(base64Segment, "base64");

    if (!decoded.length) {
        throw new Error("Image payload is empty or not valid base64.");
    }

    const maxSizeInBytes = 10 * 1024 * 1024;
    if (decoded.length > maxSizeInBytes) {
        throw new Error("Image payload is too large. Please upload an image smaller than 10MB.");
    }

    return decoded;
};

const buildProductLookupMap = (products: DeliveryProductSnapshot[]): Map<string, DeliveryProductSnapshot> => {
    const productLookup = new Map<string, DeliveryProductSnapshot>();

    for (const product of products) {
        const normalizedPrimary = normalizeProductName(product.normalizedName || product.name);
        if (normalizedPrimary) {
            productLookup.set(normalizedPrimary, product);
        }

        for (const ally of product.allies || []) {
            const normalizedAlly = normalizeProductName(ally.name);
            if (normalizedAlly) {
                productLookup.set(normalizedAlly, product);
            }
        }
    }

    return productLookup;
};

const addAliasIfMissing = async (
    product: DeliveryProductSnapshot,
    aliasName: string,
    productLookup: Map<string, DeliveryProductSnapshot>
): Promise<void> => {
    const cleanedAlias = String(aliasName || "").trim();
    const normalizedAlias = normalizeProductName(cleanedAlias);

    if (!cleanedAlias || !normalizedAlias) {
        return;
    }

    const existingAliases = [
        normalizeProductName(product.name),
        normalizeProductName(product.normalizedName),
        ...(product.allies || []).map((ally) => normalizeProductName(ally.name))
    ];

    if (existingAliases.includes(normalizedAlias)) {
        productLookup.set(normalizedAlias, product);
        return;
    }

    await ProductModel.updateOne(
        { _id: product._id },
        { $push: { allies: { name: cleanedAlias } } }
    );

    product.allies = [...(product.allies || []), { name: cleanedAlias }];
    productLookup.set(normalizedAlias, product);
};

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

        const normalizedName = normalizeProductName(trimmedName);

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

        if (!productId || !unit) {
            return res.status(400).json({
                message: "productId and unit are required."
            });
        }

        if (!mongoose.Types.ObjectId.isValid(String(productId))) {
            return res.status(400).json({
                message: "productId must be a valid ObjectId."
            });
        }

        if (sellerId && !mongoose.Types.ObjectId.isValid(String(sellerId))) {
            return res.status(400).json({
                message: "sellerId must be a valid ObjectId when provided."
            });
        }

        if (!quantity || !price) {
            return res.status(400).json({
                message: "quantity and price are required."
            });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const productObjectId = new mongoose.Types.ObjectId(String(productId));

        const productExists = await ProductModel.findOne({ _id: productObjectId, userId: userObjectId })
            .select({ _id: 1, unit: 1, sellerId: 1 })
            .lean();

        if (!productExists) {
            return res.status(404).json({
                message: "Product not found for this user."
            });
        }

        const sellerObjectId = new mongoose.Types.ObjectId(String(productExists.sellerId));
        const sellerExists = await SellerModel.exists({ _id: sellerObjectId, userId: userObjectId });

        if (!sellerExists) {
            return res.status(404).json({
                message: "Seller linked to product not found for this user."
            });
        }

        if (sellerId && String(sellerId) !== String(productExists.sellerId)) {
            return res.status(400).json({
                message: "Selected seller does not match the product owner seller."
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

export const transformPromptToDeliveryDraftController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { sellerId, prompt, fallbackDate } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User ID is missing. Please log in again." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Authenticated userId is invalid." });
        }

        if (!sellerId || !mongoose.Types.ObjectId.isValid(String(sellerId))) {
            return res.status(400).json({ message: "sellerId must be a valid ObjectId." });
        }

        if (!prompt || !String(prompt).trim()) {
            return res.status(400).json({ message: "prompt is required." });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const sellerObjectId = new mongoose.Types.ObjectId(String(sellerId));

        const seller = await SellerModel.findOne({ _id: sellerObjectId, userId: userObjectId })
            .select({ _id: 1, name: 1 })
            .lean();

        if (!seller) {
            return res.status(404).json({ message: "Seller not found for this user." });
        }

        const parsedItems = transformPromptToDeliveryItems(String(prompt), formatDateInput(String(fallbackDate || "")));

        if (parsedItems.length === 0) {
            return res.status(400).json({
                message: "Could not extract delivery items from the prompt. Use one item per line, for example: Tomato, 10 kg, 500, 2026-03-17"
            });
        }

        const existingProducts = await ProductModel.find({ sellerId: sellerObjectId, userId: userObjectId })
            .select({ _id: 1, name: 1, unit: 1, normalizedName: 1 })
            .lean();

        const existingProductMap = buildProductLookupMap(existingProducts as DeliveryProductSnapshot[]);

        const items = parsedItems.map((item, index) => {
            const matchedProduct = existingProductMap.get(normalizeProductName(item.normalizedName || item.name));

            return {
                draftId: `${item.normalizedName}-${index}`,
                name: item.name,
                normalizedName: item.normalizedName,
                unit: item.unit,
                quantity: item.quantity,
                price: item.price,
                date: item.date,
                rawText: item.rawText,
                matchedProduct: matchedProduct
                    ? {
                        _id: matchedProduct._id,
                        name: matchedProduct.name,
                        unit: matchedProduct.unit
                    }
                    : null,
                isExistingProduct: Boolean(matchedProduct)
            };
        });

        return res.status(200).json({
            message: "Prompt transformed successfully.",
            data: {
                seller,
                items
            }
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e?.message || "Unknown error"
        });
    }
};

export const savePromptDeliveryController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { sellerId, items } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User ID is missing. Please log in again." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Authenticated userId is invalid." });
        }

        if (!sellerId || !mongoose.Types.ObjectId.isValid(String(sellerId))) {
            return res.status(400).json({ message: "sellerId must be a valid ObjectId." });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "At least one delivery item is required." });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const sellerObjectId = new mongoose.Types.ObjectId(String(sellerId));

        const sellerExists = await SellerModel.exists({ _id: sellerObjectId, userId: userObjectId });
        if (!sellerExists) {
            return res.status(404).json({ message: "Seller not found for this user." });
        }

        const savedResults = [];
        let createdProducts = 0;

        for (const entry of items) {
            const trimmedName = String(entry?.name || "").trim();
            const trimmedUnit = String(entry?.unit || "").trim();
            const trimmedQuantity = String(entry?.quantity || "").trim();
            const trimmedPrice = String(entry?.price || "").trim();
            const normalizedName = normalizeProductName(String(entry?.normalizedName || trimmedName));

            if (!trimmedName || !trimmedUnit || !trimmedQuantity || !trimmedPrice) {
                return res.status(400).json({ message: "Each item must include name, unit, quantity and price." });
            }

            const numericPrice = parseCurrencyValue(trimmedPrice);
            if (!Number.isFinite(numericPrice) || numericPrice < 0) {
                return res.status(400).json({ message: `Invalid price provided for ${trimmedName}.` });
            }

            const parsedDate = entry?.date ? new Date(String(entry.date)) : new Date();
            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: `Invalid date provided for ${trimmedName}.` });
            }

            const existingProduct = await ProductModel.findOne({
                userId: userObjectId,
                sellerId: sellerObjectId,
                normalizedName
            }).select({ _id: 1, unit: 1, name: 1, normalizedName: 1 }).lean() as DeliveryProductSnapshot | null;

            let product: DeliveryProductSnapshot;

            if (!existingProduct) {
                const createdProduct = await new ProductModel({
                    sellerId: sellerObjectId,
                    userId: userObjectId,
                    name: trimmedName,
                    unit: trimmedUnit,
                    normalizedName,
                    allies: []
                }).save();

                createdProducts += 1;
                product = {
                    _id: createdProduct._id,
                    unit: createdProduct.unit,
                    name: createdProduct.name,
                    normalizedName: createdProduct.normalizedName
                };
            } else {
                product = existingProduct;
            }

            const savedDelivery = await new ProductSellerModel({
                userId: userObjectId,
                sellerId: sellerObjectId,
                productId: product._id,
                unit: product.unit,
                quantity: trimmedQuantity,
                price: trimmedPrice,
                date: parsedDate,
                source: "AI"
            }).save();

            savedResults.push({
                deliveryId: savedDelivery._id,
                productId: product._id,
                productName: product.name,
                quantity: savedDelivery.quantity,
                price: savedDelivery.price,
                date: savedDelivery.date
            });
        }

        return res.status(201).json({
            message: "AI prompt deliveries saved successfully.",
            data: {
                deliveries: savedResults,
                createdProducts,
                savedDeliveries: savedResults.length
            }
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e?.message || "Unknown error"
        });
    }
};

export const transformPhotoToDeliveryDraftController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { sellerId, imageBase64, fallbackDate } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User ID is missing. Please log in again." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Authenticated userId is invalid." });
        }

        if (!sellerId || !mongoose.Types.ObjectId.isValid(String(sellerId))) {
            return res.status(400).json({ message: "sellerId must be a valid ObjectId." });
        }

        if (!imageBase64 || !String(imageBase64).trim()) {
            return res.status(400).json({ message: "imageBase64 is required." });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const sellerObjectId = new mongoose.Types.ObjectId(String(sellerId));

        const seller = await SellerModel.findOne({ _id: sellerObjectId, userId: userObjectId })
            .select({ _id: 1, name: 1 })
            .lean();

        if (!seller) {
            return res.status(404).json({ message: "Seller not found for this user." });
        }

        const imageBuffer = decodeImageBase64(String(imageBase64));

        let rawOcrText = "";
        try {
            rawOcrText = await tesseract.recognize(imageBuffer, {
                lang: "eng",
                oem: 1,
                psm: 6,
                preserve_interword_spaces: "1"
            });
        } catch (ocrError: any) {
            return res.status(500).json({
                message: "OCR failed. Please verify Tesseract OCR is installed and accessible on the server.",
                error: ocrError?.message || "Unknown OCR error"
            });
        }

        const cleanedOcrText = cleanOcrText(rawOcrText);
        if (!cleanedOcrText) {
            return res.status(400).json({
                message: "Could not extract readable text from image.",
                data: {
                    ocr: {
                        rawText: rawOcrText,
                        cleanedText: ""
                    }
                }
            });
        }

        const defaultDate = formatDateInput(String(fallbackDate || ""));
        const parsedItems = transformPromptToDeliveryItems(cleanedOcrText, defaultDate);

        if (!parsedItems.length) {
            return res.status(400).json({
                message: "OCR text was extracted but no valid delivery items could be parsed. Please edit text and retry.",
                data: {
                    ocr: {
                        rawText: rawOcrText,
                        cleanedText: cleanedOcrText
                    }
                }
            });
        }

        const existingProducts = await ProductModel.find({ sellerId: sellerObjectId, userId: userObjectId })
            .select({ _id: 1, name: 1, unit: 1, normalizedName: 1, allies: 1 })
            .lean() as DeliveryProductSnapshot[];

        const productLookup = buildProductLookupMap(existingProducts);

        const items = parsedItems.map((item, index) => {
            const normalizedName = normalizeProductName(item.normalizedName || item.name);
            const matchedProduct = productLookup.get(normalizedName);

            return {
                draftId: `${normalizedName}-${index}`,
                name: item.name,
                normalizedName,
                unit: item.unit,
                quantity: item.quantity,
                price: item.price,
                date: item.date,
                rawText: item.rawText,
                matchedProduct: matchedProduct
                    ? {
                        _id: matchedProduct._id,
                        name: matchedProduct.name,
                        unit: matchedProduct.unit
                    }
                    : null,
                isExistingProduct: Boolean(matchedProduct)
            };
        });

        return res.status(200).json({
            message: "Image transformed successfully.",
            data: {
                seller,
                ocr: {
                    rawText: rawOcrText,
                    cleanedText: cleanedOcrText
                },
                items
            }
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e?.message || "Unknown error"
        });
    }
};

export const savePhotoDeliveryController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { sellerId, items, invoiceImageUrl } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User ID is missing. Please log in again." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Authenticated userId is invalid." });
        }

        if (!sellerId || !mongoose.Types.ObjectId.isValid(String(sellerId))) {
            return res.status(400).json({ message: "sellerId must be a valid ObjectId." });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "At least one delivery item is required." });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const sellerObjectId = new mongoose.Types.ObjectId(String(sellerId));

        const sellerExists = await SellerModel.exists({ _id: sellerObjectId, userId: userObjectId });
        if (!sellerExists) {
            return res.status(404).json({ message: "Seller not found for this user." });
        }

        const existingProducts = await ProductModel.find({ sellerId: sellerObjectId, userId: userObjectId })
            .select({ _id: 1, name: 1, unit: 1, normalizedName: 1, allies: 1 })
            .lean() as DeliveryProductSnapshot[];

        const productLookup = buildProductLookupMap(existingProducts);
        const savedResults = [];
        let createdProducts = 0;

        for (const entry of items) {
            const trimmedName = String(entry?.name || "").trim();
            const trimmedUnit = String(entry?.unit || "").trim();
            const trimmedQuantity = String(entry?.quantity || "").trim();
            const trimmedPrice = String(entry?.price || "").trim();
            const normalizedName = normalizeProductName(String(entry?.normalizedName || trimmedName));

            if (!trimmedName || !trimmedUnit || !trimmedQuantity || !trimmedPrice) {
                return res.status(400).json({ message: "Each item must include name, unit, quantity and price." });
            }

            const numericPrice = parseCurrencyValue(trimmedPrice);
            if (!Number.isFinite(numericPrice) || numericPrice < 0) {
                return res.status(400).json({ message: `Invalid price provided for ${trimmedName}.` });
            }

            const parsedDate = entry?.date ? new Date(String(entry.date)) : new Date();
            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: `Invalid date provided for ${trimmedName}.` });
            }

            let product = productLookup.get(normalizedName);

            if (!product) {
                const createdProduct = await new ProductModel({
                    sellerId: sellerObjectId,
                    userId: userObjectId,
                    name: trimmedName,
                    unit: trimmedUnit,
                    normalizedName,
                    allies: []
                }).save();

                createdProducts += 1;
                product = {
                    _id: createdProduct._id,
                    unit: createdProduct.unit,
                    name: createdProduct.name,
                    normalizedName: createdProduct.normalizedName,
                    allies: []
                };

                productLookup.set(normalizeProductName(product.normalizedName), product);
            } else {
                await addAliasIfMissing(product, trimmedName, productLookup);
            }

            const savedDelivery = await new ProductSellerModel({
                userId: userObjectId,
                sellerId: sellerObjectId,
                productId: product._id,
                unit: product.unit,
                quantity: trimmedQuantity,
                price: trimmedPrice,
                date: parsedDate,
                source: "Image",
                invoiceImageUrl: invoiceImageUrl ? String(invoiceImageUrl) : undefined
            }).save();

            savedResults.push({
                deliveryId: savedDelivery._id,
                productId: product._id,
                productName: product.name,
                quantity: savedDelivery.quantity,
                price: savedDelivery.price,
                date: savedDelivery.date
            });
        }

        return res.status(201).json({
            message: "Image deliveries saved successfully.",
            data: {
                deliveries: savedResults,
                createdProducts,
                savedDeliveries: savedResults.length
            }
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e?.message || "Unknown error"
        });
    }
};