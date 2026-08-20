import { Router } from "express";
import {
  changePin,
  checkCustomer,
  createCustomer,
  getCustomerJobs,
  getShopCustomers,
  updateCustomerProfile,
} from "../controllers/customerController.js";
import {
  authenticate,
  requireRole,
  requireShopParam,
  requireCustomerParam,
  authorizeChangePin,
  serviceUnavailable,
} from "../middleware/auth.js";
import { pinLimiter } from "../middleware/rateLimit.js";

export const customerRoutes = Router();

customerRoutes.route("/").post(createCustomer);
customerRoutes.route("/check").post(checkCustomer);

customerRoutes
  .route("/request-otp")
  .post(serviceUnavailable("PIN reset is temporarily unavailable"));
customerRoutes
  .route("/reset-pin")
  .post(serviceUnavailable("PIN reset is temporarily unavailable"));

customerRoutes
  .route("/:shopId")
  .get(authenticate, requireRole("ENGINEER"), requireShopParam, getShopCustomers);

customerRoutes
  .route("/:customerId/pin")
  .put(
    authenticate,
    requireRole("ENGINEER", "CUSTOMER"),
    pinLimiter,
    authorizeChangePin,
    changePin,
  );

customerRoutes
  .route("/:customerId")
  .put(
    authenticate,
    requireRole("CUSTOMER"),
    requireCustomerParam,
    updateCustomerProfile,
  );

customerRoutes
  .route("/:customerId/jobs")
  .get(
    authenticate,
    requireRole("CUSTOMER"),
    requireCustomerParam,
    getCustomerJobs,
  );
