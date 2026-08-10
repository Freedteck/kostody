import { Router } from "express";
import { createShop } from "../controllers/shopController.js";

export const shopRoutes = Router();
shopRoutes.route("/").post(createShop);
