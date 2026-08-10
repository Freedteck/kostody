import { Router } from "express";
import {
  addPayment,
  getJobById,
  getJobsByShop,
  lockJob,
  updateJobStatus,
} from "../controllers/jobController.js";

export const router = Router();
router.route("/lock").post(lockJob);
router.route("/shop/:shopId").get(getJobsByShop);
router.route("/:jobId").get(getJobById);
router.route("/:jobId/status").put(updateJobStatus);
router.route("/:jobId/payments").post(addPayment);
