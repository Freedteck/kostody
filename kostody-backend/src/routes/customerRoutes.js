import { Router } from "express";
import {
  changePin,
  checkCustomer,
  createCustomer,
  getShopCustomers,
  requestOtp,
  resetPin,
} from "../controllers/customerController.js";

export const customerRoutes = Router();
customerRoutes.route("/").post(createCustomer);
customerRoutes.route("/check").post(checkCustomer);
customerRoutes.route("/:shopId").get(getShopCustomers);

customerRoutes.route("/:customerId/pin").put(changePin);
customerRoutes.route("/request-otp").post(requestOtp);
customerRoutes.route("/reset-pin").post(resetPin);
