import type {Request, Response} from "express";
import mongoose from "mongoose";
import { SellerModel } from "../Models/seller.model";

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

        const seller = await SellerModel.findOne({ _id : sellerObjectId, userId : userObjectId });

        if(!seller){
            return res.status(404).json({message : "Seller not found."});
        }

        return res.status(200).json({message : "Seller fetched successfully", data : seller});
    }
    catch(e : any){
        return res.status(500).json({message : "Internal Server Error", error : e?.message || "Unknown error"});
    }
}
