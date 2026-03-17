import { Router } from "express";
import { getAnalyticsSummaryController } from "../Controller/Analytics.Controller";
import { authMiddleware } from "../middleware/authMiddleware";

const AnalyticsRouter = Router();

AnalyticsRouter.use(authMiddleware);
AnalyticsRouter.get("/summary", getAnalyticsSummaryController);

export default AnalyticsRouter;
