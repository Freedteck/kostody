import { Router } from "express";
import { loginShop, registerShop } from "../controllers/authController.js";
import { loginCustomer } from "../controllers/customerController.js";

export const authRoutes = Router();
authRoutes.route("/register").post(registerShop);
authRoutes.route("/login").post(loginShop);

authRoutes.route("/customers/login").post(loginCustomer);
