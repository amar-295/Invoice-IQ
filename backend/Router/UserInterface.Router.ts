import { Router } from "express";
import { dashboardDataController, reportController } from "../Controller/userInteface.Controller";
import { authMiddleware } from "../middleware/authMiddleware";

const userInterfaceRouter = Router();

// Apply auth middleware to all user interface routes
userInterfaceRouter.use(authMiddleware);

userInterfaceRouter.get("/dashboardData", dashboardDataController);
userInterfaceRouter.get("/report", reportController);

export default userInterfaceRouter;