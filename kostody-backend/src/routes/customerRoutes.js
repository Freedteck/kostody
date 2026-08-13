import { Router } from "express";
import {
  checkCustomer,
  createCustomer,
  getShopCustomers,
} from "../controllers/customerController.js";

export const customerRoutes = Router();
customerRoutes.route("/").post(createCustomer);
customerRoutes.route("/check").post(checkCustomer);
customerRoutes.route("/:shopId").get(getShopCustomers);
