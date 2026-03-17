import { Router } from "express";
import { addDeliveryByManualController, createManualDeliveryProductController, getManualDeliveryFormDataController } from "../Controller/Delivery.Controller";
import { authMiddleware } from "../middleware/authMiddleware";


const DeliveryRouter = Router();

DeliveryRouter.use(authMiddleware);

DeliveryRouter.get("/manual/form-data", getManualDeliveryFormDataController)
DeliveryRouter.post("/manual/add-product", createManualDeliveryProductController)
DeliveryRouter.post("/addDelivery/byManual", addDeliveryByManualController)

export default DeliveryRouter;