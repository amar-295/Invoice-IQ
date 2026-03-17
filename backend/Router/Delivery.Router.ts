import { Router } from "express";
import { addDeliveryByManualController, createManualDeliveryProductController, getManualDeliveryFormDataController, savePhotoDeliveryController, savePromptDeliveryController, transformPhotoToDeliveryDraftController, transformPromptToDeliveryDraftController } from "../Controller/Delivery.Controller";
import { authMiddleware } from "../middleware/authMiddleware";


const DeliveryRouter = Router();

DeliveryRouter.use(authMiddleware);

DeliveryRouter.get("/manual/form-data", getManualDeliveryFormDataController)
DeliveryRouter.post("/manual/add-product", createManualDeliveryProductController)
DeliveryRouter.post("/addDelivery/byManual", addDeliveryByManualController)
DeliveryRouter.post("/prompt/transform", transformPromptToDeliveryDraftController)
DeliveryRouter.post("/prompt/save", savePromptDeliveryController)
DeliveryRouter.post("/photo/transform", transformPhotoToDeliveryDraftController)
DeliveryRouter.post("/photo/save", savePhotoDeliveryController)


export default DeliveryRouter;