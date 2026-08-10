import { Router } from "express";
import {
  checkCustomer,
  createCustomer,
} from "../controllers/customerController.js";

export const customerRoutes = Router();
customerRoutes.route("/").post(createCustomer);
customerRoutes.route("/check").post(checkCustomer);
