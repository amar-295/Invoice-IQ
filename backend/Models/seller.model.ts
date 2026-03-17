import mongoose, {Document} from "mongoose";


export interface seller extends Document{
    name : string;
    mobile : string;
    address : string;
    notes ?: string;
    isFavorite : boolean;
    nickname ?: string;
}

const sellerSchema = new mongoose.Schema<seller>({
    name : {type : String, required : true},
    mobile : {type: String, required : true},
    address : {type :String, required : true},
    notes : {type : String, required : false},
    isFavorite : {type : Boolean, required : true, default : false},
    nickname : {type : String, required : false}
});

export const SellerModel = mongoose.model<seller>("Seller", sellerSchema);