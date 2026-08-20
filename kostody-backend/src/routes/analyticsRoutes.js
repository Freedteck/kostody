import { Router } from "express";
import { getShopStats } from "../controllers/analyticsController.js";
import {
  authenticate,
  requireRole,
  requireShopParam,
} from "../middleware/auth.js";

export const analyticsRoutes = Router();
analyticsRoutes
  .route("/:shopId")
  .get(authenticate, requireRole("ENGINEER"), requireShopParam, getShopStats);
