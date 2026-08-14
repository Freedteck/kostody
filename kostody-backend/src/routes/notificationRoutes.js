import { Router } from "express";
import { getShopNotifications } from "../controllers/notificationController.js";

export const notificationRoutes = Router();
notificationRoutes.route("/:shopId").get(getShopNotifications);
