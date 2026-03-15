import { Router } from "express";
import { handleGoogleAuthentication, handleLogoutUser, LoginWithGoogle } from "../Controller/Auth.Controller";

const AuthRouter = Router();

AuthRouter.post("/loginWithGoogle", LoginWithGoogle);
AuthRouter.get("/google/callback", handleGoogleAuthentication);
AuthRouter.post("/logout", handleLogoutUser);

export default AuthRouter;