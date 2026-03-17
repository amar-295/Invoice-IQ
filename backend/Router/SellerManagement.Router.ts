import { Router } from "express";
import { CreateSellerController, GetSellerController } from "../Controller/SellerManagement.Controller";

const sellerManagementRouter = Router();

sellerManagementRouter.post("/createSeller", CreateSellerController);
sellerManagementRouter.get("/getSeller", GetSellerController);

export default sellerManagementRouter;