import { Router } from "express";
import {
  getShopNotifications,
  getCustomerNotifications,
} from "../controllers/notificationController.js";
import {
  authenticate,
  requireRole,
  requireShopParam,
  requireCustomerParam,
} from "../middleware/auth.js";

export const notificationRoutes = Router();

notificationRoutes
  .route("/customer/:customerId")
  .get(
    authenticate,
    requireRole("CUSTOMER"),
    requireCustomerParam,
    getCustomerNotifications,
  );

notificationRoutes
  .route("/:shopId")
  .get(
    authenticate,
    requireRole("ENGINEER"),
    requireShopParam,
    getShopNotifications,
  );
