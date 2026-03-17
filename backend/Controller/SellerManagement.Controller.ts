import type {Request, Response} from "express";
import { SellerModel } from "../Models/seller.model";

export const CreateSellerController = async (req : Request, res : Response) : Promise<Response> =>{
    try{
        const { name, mobile, address, notes, nickname, isFavorite } = req.body;

        if(!name || !mobile || !address){
            return res.status(400).json({message : "name, mobile and address are required."});
        }

        const trimmedName = String(name).trim();
        const trimmedMobile = String(mobile).trim();
        const trimmedAddress = String(address).trim();

        const existingSeller = await SellerModel.findOne({
            name : trimmedName,
            mobile : trimmedMobile,
            address : trimmedAddress
        });

        if(existingSeller){
            return res.status(409).json({message : "Seller already exists."});
        }

        const seller = new SellerModel({
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
        const { userId } = req.query;

        if(!userId){
            return res.status(400).json({message : "userId is required and should be a string."});
        }

        const seller = await SellerModel.find({ userId : String(userId) });
        
        return res.status(200).json({message : "Seller fetched successfully", data : seller});
    }
    catch(e : any){
        return res.status(500).json({message : "Internal Server Error", error : e?.message || "Unknown error"});
    }
}
