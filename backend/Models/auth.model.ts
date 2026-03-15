
import mongoose, { Document } from "mongoose";

export interface User extends Document{
    userName : string;
    email : string;
    avatar : string;
    loginMode : "Google" | "Github";
    refreshToken: string | null;
    createdAt : Date;
    updatedAt : Date;
}


const userSchema = new mongoose.Schema<User>({
    userName : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    avatar : {type : String, required : true},
    loginMode : {type : String, enum: ["Google", "Github"], required : true},
    refreshToken: {type : String || null, required : true},
    createdAt : {type : Date, default : Date.now},
    updatedAt : {type : Date, default : Date.now}
});

export const UserModel = mongoose.model<User>("User", userSchema);