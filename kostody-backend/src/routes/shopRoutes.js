import { Router } from "express";
import {
  createShop,
  getShopProfile,
  updateShopProfile,
} from "../controllers/shopController.js";

export const shopRoutes = Router();
shopRoutes.route("/").post(createShop);
shopRoutes.route("/:shopId").get(getShopProfile).put(updateShopProfile);
