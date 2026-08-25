import { Router } from "express";
import {
  getShopNotifications,
  markShopNotificationsRead,
  dismissShopNotification,
  clearShopNotifications,
  getCustomerNotifications,
  markCustomerNotificationsRead,
  dismissCustomerNotification,
  clearCustomerNotifications,
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
  .route("/customer/:customerId/read")
  .post(
    authenticate,
    requireRole("CUSTOMER"),
    requireCustomerParam,
    markCustomerNotificationsRead,
  );

notificationRoutes
  .route("/customer/:customerId/all")
  .delete(
    authenticate,
    requireRole("CUSTOMER"),
    requireCustomerParam,
    clearCustomerNotifications,
  );

notificationRoutes
  .route("/customer/:customerId/item/:eventId")
  .delete(
    authenticate,
    requireRole("CUSTOMER"),
    requireCustomerParam,
    dismissCustomerNotification,
  );

notificationRoutes
  .route("/:shopId")
  .get(
    authenticate,
    requireRole("ENGINEER"),
    requireShopParam,
    getShopNotifications,
  );

notificationRoutes
  .route("/:shopId/read")
  .post(
    authenticate,
    requireRole("ENGINEER"),
    requireShopParam,
    markShopNotificationsRead,
  );

notificationRoutes
  .route("/:shopId/all")
  .delete(
    authenticate,
    requireRole("ENGINEER"),
    requireShopParam,
    clearShopNotifications,
  );

notificationRoutes
  .route("/:shopId/item/:eventId")
  .delete(
    authenticate,
    requireRole("ENGINEER"),
    requireShopParam,
    dismissShopNotification,
  );
