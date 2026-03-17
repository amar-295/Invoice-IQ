import mongoose, {Document} from "mongoose"
export interface allies{
    name : string;
}


export interface Product extends Document{
    sellerId : mongoose.Types.ObjectId;
    userId : mongoose.Types.ObjectId;
    name : string;
    unit : string;
    normalizedName : string;
    allies : allies[];
}

const alliesSchema = new mongoose.Schema<allies>(
    {
        name : { type : String, required : true }
    },
    { _id : false }
);

const productSchema = new mongoose.Schema<Product>({
    sellerId : { type : mongoose.Schema.Types.ObjectId, ref : "Seller", required : true },
    userId : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
    name : { type : String, required : true, trim : true },
    unit : { type : String, required : true, trim : true },
    normalizedName : { type : String, required : true, trim : true, lowercase : true },
    allies : { type : [alliesSchema], default : [] }
});

export const ProductModel = mongoose.model<Product>("Product", productSchema);