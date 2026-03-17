import type {Request, Response} from "express";
import mongoose from "mongoose";
import { ProductSellerModel } from "../Models/delivery.model";
import { ProductModel } from "../Models/product.model";
import { SellerModel } from "../Models/seller.model";

const parseAmount = (value: unknown): number => {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (typeof value !== "string") {
        return 0;
    }

    const normalizedValue = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(normalizedValue) ? normalizedValue : 0;
};

export const CreateSellerController = async (req : Request, res : Response) : Promise<Response> =>{
    try{
        const { name, mobile, address, notes, nickname, isFavorite } = req.body;
        const userId = req.userId;

        if(!userId){
            return res.status(401).json({message : "User ID is missing. Please log in again."});
        }

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message : "Authenticated userId is invalid."});
        }

        if(!name || !mobile || !address){
            return res.status(400).json({message : "name, mobile and address are required."});
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const trimmedName = String(name).trim();
        const trimmedMobile = String(mobile).trim();
        const trimmedAddress = String(address).trim();

        const existingSeller = await SellerModel.findOne({
            userId : userObjectId,
            name : trimmedName,
            mobile : trimmedMobile,
            address : trimmedAddress
        });

        if(existingSeller){
            return res.status(409).json({message : "Seller already exists."});
        }

        const seller = new SellerModel({
            userId : userObjectId,
            name : trimmedName,
            mobile : trimmedMobile,
            address : trimmedAddress,
            notes : notes ? String(notes).trim() : undefined,
            nickname : nickname ? String(nickname).trim() : undefined,
            isFavorite : Boolean(isFavorite)
        });

        const savedSeller = await seller.save();
        return res.status(201).json({message : "Seller created successfully", data : savedSeller});
    }
    catch(e : any){
        return res.status(500).json({message : "Internal Server Error", error : e?.message || "Unknown error"});
    }
}

export const GetSellerController = async(req : Request, res : Response) : Promise<Response> =>{
    try{
        const userId = req.userId;

        if(!userId){
            return res.status(401).json({message : "User ID is missing. Please log in again."});
        }

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message : "Authenticated userId is invalid."});
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const seller = await SellerModel.find({ userId : userObjectId });
        
        return res.status(200).json({message : "Seller fetched successfully", data : seller});
    }
    catch(e : any){
        return res.status(500).json({message : "Internal Server Error", error : e?.message || "Unknown error"});
    }
}

export const GetSellerByIdController = async(req : Request, res : Response) : Promise<Response> =>{
    try{
        const userId = req.userId;
        const { id } = req.params;
        const sellerId = Array.isArray(id) ? id[0] : id;

        if(!userId){
            return res.status(401).json({message : "User ID is missing. Please log in again."});
        }

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message : "Authenticated userId is invalid."});
        }

        if(!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)){
            return res.status(400).json({message : "Seller id is invalid."});
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

        const [seller, products, deliveries] = await Promise.all([
            SellerModel.findOne({ _id : sellerObjectId, userId : userObjectId }).lean(),
            ProductModel.find({ sellerId : sellerObjectId, userId : userObjectId })
                .select({ _id : 1, name : 1, unit : 1, normalizedName : 1, allies : 1 })
                .sort({ name : 1 })
                .lean(),
            ProductSellerModel.find({ sellerId : sellerObjectId, userId : userObjectId })
                .select({ _id : 1, productId : 1, quantity : 1, price : 1, date : 1, source : 1, unit : 1 })
                .sort({ date : -1 })
                .lean()
        ]);

        if(!seller){
            return res.status(404).json({message : "Seller not found."});
        }

        const latestDeliveryByProductId = new Map<string, typeof deliveries[number]>();

        for (const delivery of deliveries) {
            const productKey = String(delivery.productId);

            if (!latestDeliveryByProductId.has(productKey)) {
                latestDeliveryByProductId.set(productKey, delivery);
            }
        }

        const sellerProducts = products.map((product) => {
            const latestDelivery = latestDeliveryByProductId.get(String(product._id));

            return {
                _id : product._id,
                name : product.name,
                unit : product.unit,
                normalizedName : product.normalizedName,
                allies : product.allies,
                lastDelivery : latestDelivery
                    ? {
                        _id : latestDelivery._id,
                        quantity : latestDelivery.quantity,
                        price : latestDelivery.price,
                        unit : latestDelivery.unit,
                        source : latestDelivery.source,
                        date : latestDelivery.date
                    }
                    : null
            };
        });

        const totalSpend = deliveries.reduce((sum, delivery) => sum + parseAmount(delivery.price), 0);

        return res.status(200).json({
            message : "Seller fetched successfully",
            data : {
                ...seller,
                summary : {
                    totalSpend,
                    totalDeliveries : deliveries.length,
                    totalProducts : products.length
                },
                products : sellerProducts
            }
        });
    }
    catch(e : any){
        return res.status(500).json({message : "Internal Server Error", error : e?.message || "Unknown error"});
    }
}
