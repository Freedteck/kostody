import { Router } from "express";
import { loginShop, registerShop } from "../controllers/authController.js";

export const authRoutes = Router();
authRoutes.route("/register").post(registerShop);
authRoutes.route("/login").post(loginShop);
