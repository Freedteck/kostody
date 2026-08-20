import { Router } from "express";
import {
  getShopProfile,
  updateShopProfile,
} from "../controllers/shopController.js";
import {
  authenticate,
  requireRole,
  requireShopParam,
} from "../middleware/auth.js";

export const shopRoutes = Router();

shopRoutes
  .route("/:shopId")
  .get(authenticate, requireRole("ENGINEER"), requireShopParam, getShopProfile)
  .put(
    authenticate,
    requireRole("ENGINEER"),
    requireShopParam,
    updateShopProfile,
  );
