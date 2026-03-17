import mongoose, { Document } from "mongoose";

export interface ProductSeller extends Document {
    quantity: string;
    price: string;
    date: Date;
    source: "Manual" | "Image" | "AI";
    invoiceImageUrl?: string;
}

const productSellerSchema = new mongoose.Schema<ProductSeller>({
    quantity: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    source: { type: String, enum: ["Manual", "Image", "AI"], required: true },
    invoiceImageUrl: { type: String, required: false }
});

export const ProductSellerModel = mongoose.model<ProductSeller>("ProductSeller", productSellerSchema);