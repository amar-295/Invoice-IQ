import { Router } from "express";
import { dashboardDataController } from "../Controller/userInteface.Controller";


const userInterfaceRouter = Router();

userInterfaceRouter.get("/dashboardData", dashboardDataController);

export default userInterfaceRouter;