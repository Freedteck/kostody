import { Router } from "express";
import {
  getJobById,
  getJobsByShop,
  lockJob,
} from "../controllers/jobController.js";

export const router = Router();
router.route("/lock").post(lockJob);
router.route("/shop/:shopId").get(getJobsByShop);
router.route("/:jobId").get(getJobById);
