import { Router } from "express";
import { getProductDetailController } from "../Controller/Product.Controller";
import { authMiddleware } from "../middleware/authMiddleware";

const ProductRouter = Router();

ProductRouter.use(authMiddleware);
ProductRouter.get("/:sellerId/:productId", getProductDetailController);

export default ProductRouter;
