import jwt from "jsonwebtoken";
import type { Response } from "express";
import mongoose from "mongoose";


export interface token{
    userId : mongoose.Types.ObjectId;
    username : string;
    email : string;
    type : "access" | "refresh";
}

const getJwtSecrets = (): { accessTokenSecret: string; refreshTokenSecret: string } => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
        throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be configured.");
    }

    return { accessTokenSecret, refreshTokenSecret };
};

export const generateAccessToken = (userId: string, userName: string, email: string): { accessToken: string } => {
    const { accessTokenSecret } = getJwtSecrets();
    const accessToken = jwt.sign(
        { 
            userId, 
            username: userName, 
            email, 
            type: "access" 
        }, 
        accessTokenSecret, 
        { expiresIn: "15m" }
    );
    
    return { accessToken };
}

export const generateRefreshToken = (userId: string, userName: string, email: string): { refreshToken: string } => {
    const { refreshTokenSecret } = getJwtSecrets();
    const refreshToken = jwt.sign(
        { 
            userId, 
            username: userName, 
            email, 
            type: "refresh" 
        }, 
        refreshTokenSecret, 
        { expiresIn: "40d" }
    );
    
    return { refreshToken };
}

