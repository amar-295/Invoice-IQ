import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { generateAccessToken } from "../utils/Token.helper";

// Token payload interface
interface TokenPayload extends JwtPayload {
    userId: string;
    username: string;
    email: string;
    type: "access" | "refresh";
}

// Extend Express Request to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userName?: string;
            email?: string;
        }
    }
}

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    path: "/"
};

const getJwtSecrets = (): { accessTokenSecret: string; refreshTokenSecret: string } => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

    if (!accessTokenSecret || !refreshTokenSecret) {
        throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be configured.");
    }

    return { accessTokenSecret, refreshTokenSecret };
};


const isTokenPayload = (payload: JwtPayload | string, expectedType: TokenPayload["type"]): payload is TokenPayload => {
    if (typeof payload === "string") {
        return false;
    }

    return (
        typeof payload.userId === "string" &&
        typeof payload.username === "string" &&
        typeof payload.email === "string" &&
        payload.type === expectedType
    );
};

const attachAuthenticatedUser = (req: Request, payload: TokenPayload): void => {
    req.userId = String(payload.userId);
    req.userName = payload.username;
    req.email = payload.email;
};

const getTokenFromCookie = (token: unknown): string | null => {
    if (typeof token !== "string") {
        return null;
    }

    const normalizedToken = token.trim();
    return normalizedToken.length > 0 ? normalizedToken : null;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        const accessTokenValue = getTokenFromCookie(accessToken);
        const refreshTokenValue = getTokenFromCookie(refreshToken);
        const { accessTokenSecret, refreshTokenSecret } = getJwtSecrets();

        // 1) If access token exists and is valid, allow request immediately.
        if (accessTokenValue) {
            const decodedAccess = jwt.verify(accessTokenValue, accessTokenSecret);

            if (!isTokenPayload(decodedAccess, "access")) {
                console.log("Invalid access token payload:", decodedAccess);
                res.clearCookie("accessToken", cookieOptions);
                res.clearCookie("refreshToken", cookieOptions);
                return res.status(401).json({ message: "Invalid access token. Please log in again." });
            }

            attachAuthenticatedUser(req, decodedAccess);
            return next();
        }

        // 2) No access token. Check refresh token and rotate access token.
        if (!refreshTokenValue) {
            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
            return res.status(401).json({ message: "Authentication required. Please log in." });
        }

        const decodedRefresh = jwt.verify(refreshTokenValue, refreshTokenSecret);

        if (!isTokenPayload(decodedRefresh, "refresh")) {
            console.log("Invalid refresh token payload:", decodedRefresh);
            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
            return res.status(401).json({ message: "Invalid refresh token. Please log in again." });
        }

        res.cookie("accessToken", generateAccessToken(decodedRefresh.userId, decodedRefresh.username, decodedRefresh.email), {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });

        attachAuthenticatedUser(req, decodedRefresh);
        return next();
    } catch (error: any) {
        console.log("Authentication middleware error:", error);
        if (error?.name === "TokenExpiredError" || error?.name === "JsonWebTokenError" || error?.name === "NotBeforeError") {
            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
            return res.status(401).json({
                message: "Invalid or expired token. Please log in again."
            });
        }

        return res.status(500).json({
            message: "Authentication middleware error.",
            error: error?.message || "Unknown error"
        });
    }
};
