import mongoose from 'mongoose';

export default async function intializeMongoDB() : Promise<void> {
    const mongodbUrl = (process.env.MONGODB_URI || "").trim();

    if (!mongodbUrl) {
        throw new Error("MONGODB_URI is missing. Add it to backend/.env with a mongodb:// or mongodb+srv:// value.");
    }

    if (!/^mongodb(\+srv)?:\/\//.test(mongodbUrl)) {
        throw new Error(`Invalid MONGODB_URI scheme. Expected mongodb:// or mongodb+srv://, got: ${mongodbUrl}`);
    }

    try{
        await mongoose.connect(mongodbUrl);
        console.log("MongoDB connected successfully🚀🚀");
    }
    catch(error){
        throw error;
    }
}