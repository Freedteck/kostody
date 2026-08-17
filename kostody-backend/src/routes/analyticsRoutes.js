import { Router } from "express";
import { getShopStats } from "../controllers/analyticsController.js";

export const analyticsRoutes = Router();
analyticsRoutes.route("/:shopId").get(getShopStats);
