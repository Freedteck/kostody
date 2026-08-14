import { Router } from "express";
import { getShopAnalytics } from "../controllers/analyticsController.js";

export const analyticsRoutes = Router();
analyticsRoutes.route("/:shopId").get(getShopAnalytics);
