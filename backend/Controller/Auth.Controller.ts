import type { CookieOptions, Request, Response } from "express";
import { UserModel } from "../Models/auth.model";
import { generateAccessToken, generateRefreshToken } from "../utils/Token.helper";
import { hashString } from "../utils/Hash.helper";

const clientId = process.env.GOOGLE_CLIENT_ID!;
const redirectUri = process.env.GOOGLE_REDIRECT_URI!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
};


export const LoginWithGoogle = (req: Request, res: Response): Response => {
    try {
        const googleOAuthURL = "https://accounts.google.com/o/oauth2/v2/auth";
        const params = new URLSearchParams({
            client_id: clientId || "",
            redirect_uri: redirectUri || "",
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "consent"
        });
        const url = `${googleOAuthURL}?${params.toString()}`;


        return res.status(200).json({ message: "URL Generated Successfully", url });
    }
    catch (e: any) {
        return res.status(500).json({ message: "Internal server error", error: e?.message || "Unknown error", });
    }
};

export const handleGoogleAuthentication = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { code } = req.query;
        if (!code)
            return res.status(400).json({ message: "Authorization code is missing from query parameters." });

        //exchange code for tokens
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code: code.toString(),
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenRes.json();
        if (tokenData.error) {
            return res.status(400).json({ message: "Failed to exchange code for tokens", error: tokenData.error_description || "Unknown error" });
        }
        const { id_token } = tokenData;

        //fetch user info from google
        const base64Payload = id_token.split(".")[1];
        const payload = JSON.parse(Buffer.from(base64Payload, "base64").toString("utf-8"));
        const { email, name, picture } = payload;

        const user = await UserModel.findOne({ email });

        //if user is not in the databse then register them
        //this code start here for new user registration
        //when user doesn't exist
        if (!user) {
            //register user
            const newUser = new UserModel({
                userName: name,
                email,
                avatar: picture,
                loginMode: "Google"
            });

            const { refreshToken } = generateRefreshToken(newUser._id.toString(), newUser.userName, newUser.email);
            const { accessToken } = generateAccessToken(newUser._id.toString(), newUser.userName, newUser.email);
            const hashedRefreshToken = hashString(refreshToken);

            newUser.refreshToken = hashedRefreshToken;
            await newUser.save();

            res.cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            res.cookie("refreshToken", refreshToken, {
                ...cookieOptions,
                maxAge: 40 * 24 * 60 * 60 * 1000, // 40 days,  
            });
            return res.redirect(`${process.env.NEXT_PUBLIC_API_URL}/home`);
        }

        //user is already at our database so just log them in
        const { refreshToken } = generateRefreshToken(user._id.toString(), user.userName, user.email);
        const { accessToken } = generateAccessToken(user._id.toString(), user.userName, user.email);
        const hashedRefreshToken = hashString(refreshToken);

        user.refreshToken = hashedRefreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 40 * 24 * 60 * 60 * 1000, // 40 days,  
        });
        return res.redirect(`${process.env.NEXT_PUBLIC_API_URL}/home`);
    }
    catch (e: any) {
        console.error("Error during Google authentication:", e);
        return res.status(500).json({ message: "Internal server error", error: e?.message || "Unknown error", });
    }
}

export const getMe = (req: Request, res: Response): Response => {
    return res.status(200).json({
        userId: req.userId,
        username: req.userName,
        email: req.email,
    });
};

export const handleLogoutUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(400).json({ message: "User is already Logged Out!!" });
        }

        const hashedRefreshToken = hashString(refreshToken);
        const user = await UserModel.findOne({ refreshToken: hashedRefreshToken });
        if (!user) {
            res.clearCookie("refreshToken", cookieOptions);
            res.clearCookie("accessToken", cookieOptions);
            return res.status(400).json({ message: "User is already Logged Out!!" });
        }

        user.refreshToken = null;
        await user.save();

        res.clearCookie("refreshToken", cookieOptions);
        res.clearCookie("accessToken", cookieOptions);
        return res.status(200).json({ message: "User logged out successfully!" });
    }
    catch (e: any) {
        console.log("Error during logout:", e);
        return res.status(500).json({ message: "Internal server error", error: e?.message || "Unknown error", });
    }
}