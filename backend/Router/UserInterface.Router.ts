import { Router } from "express";
import { dashboardDataController } from "../Controller/userInteface.Controller";
import { authMiddleware } from "../middleware/authMiddleware";

const userInterfaceRouter = Router();

// Apply auth middleware to all user interface routes
userInterfaceRouter.use(authMiddleware);

userInterfaceRouter.get("/dashboardData", dashboardDataController);

export default userInterfaceRouter;