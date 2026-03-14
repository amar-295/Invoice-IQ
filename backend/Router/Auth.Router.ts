import { Router } from "express";
import { handleGoogleAuthentication, LoginWithGoogle } from "../Controller/Auth.Controller";

const AuthRouter = Router();

AuthRouter.post("/loginWithGoogle", LoginWithGoogle);
AuthRouter.get("/google/callback", handleGoogleAuthentication);

export default AuthRouter;