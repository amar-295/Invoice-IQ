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

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
    path: "/"
};

const getJwtSecrets = (): { accessTokenSecret: string; refreshTokenSecret: string } => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
        throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be configured.");
    }

    return { accessTokenSecret, refreshTokenSecret };
};

const getBearerToken = (authorizationHeader?: string): string | undefined => {
    if (!authorizationHeader) {
        return undefined;
    }

    const [scheme, token] = authorizationHeader.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
        return undefined;
    }

    return token.trim();
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

export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
        const { accessTokenSecret, refreshTokenSecret } = getJwtSecrets();
        const cookieAccessToken = req.cookies?.accessToken;
        const cookieRefreshToken = req.cookies?.refreshToken;
        const bearerToken = getBearerToken(req.headers.authorization);
        const accessToken = bearerToken || cookieAccessToken;

        // Prefer the access token when present. A valid access token is sufficient
        // to authenticate the request and populate req.userId.
        if (accessToken) {
            try {
                const decodedAccessPayload = jwt.verify(accessToken, accessTokenSecret);

                if (!isTokenPayload(decodedAccessPayload, "access")) {
                    return res.status(401).json({
                        message: "Access token payload is invalid. Please log in again."
                    });
                }

                attachAuthenticatedUser(req, decodedAccessPayload);
                return next();
            } catch (error: any) {
                if (error.name !== "TokenExpiredError") {
                    if (cookieAccessToken) {
                        res.clearCookie("accessToken", cookieOptions);
                    }

                    return res.status(401).json({
                        message: "Access token is invalid. Please log in again."
                    });
                }
            }
        }

        if (!cookieRefreshToken) {
            return res.status(401).json({
                message: "Authentication tokens are missing. Please log in again."
            });
        }

        let refreshPayload: TokenPayload;
        try {
            const decodedRefreshPayload = jwt.verify(cookieRefreshToken, refreshTokenSecret);

            if (!isTokenPayload(decodedRefreshPayload, "refresh")) {
                return res.status(401).json({
                    message: "Refresh token payload is invalid. Please log in again."
                });
            }

            refreshPayload = decodedRefreshPayload;
        } catch (error) {
            return res.status(401).json({
                message: "Refresh token is invalid or expired. Please log in again."
            });
        }

        try {
            const { accessToken: newAccessToken } = generateAccessToken(
                refreshPayload.userId,
                refreshPayload.username,
                refreshPayload.email
            );

            res.cookie("accessToken", newAccessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000
            });

            attachAuthenticatedUser(req, refreshPayload);
            return next();
        } catch (error: any) {
            return res.status(500).json({
                message: "Failed to generate new access token.",
                error: error?.message || "Unknown error"
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            message: "Authentication middleware error.",
            error: error?.message || "Unknown error"
        });
    }
};
