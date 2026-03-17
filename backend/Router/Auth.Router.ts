import { Router } from "express";
import { handleGoogleAuthentication, handleLogoutUser, LoginWithGoogle, getMe } from "../Controller/Auth.Controller";
import { authMiddleware } from "../middleware/authMiddleware";

const AuthRouter = Router();

AuthRouter.post("/loginWithGoogle", LoginWithGoogle);
AuthRouter.get("/google/callback", handleGoogleAuthentication);
AuthRouter.post("/logout", handleLogoutUser);
AuthRouter.get("/me", authMiddleware, getMe);

export default AuthRouter;