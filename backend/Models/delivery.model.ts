import mongoose, { Document } from "mongoose";

export interface ProductSeller extends Document {
    userId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    unit: string;
    quantity: string;
    price: string;
    date: Date;
    source: "Manual" | "Image" | "AI";
    invoiceImageUrl?: string;
}

const productSellerSchema = new mongoose.Schema<ProductSeller>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    unit: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    source: { type: String, enum: ["Manual", "Image", "AI"], required: true },
    invoiceImageUrl: { type: String, required: false }
});

export const ProductSellerModel = mongoose.model<ProductSeller>("ProductSeller", productSellerSchema);