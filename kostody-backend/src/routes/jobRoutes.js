import { Router } from "express";
import {
  addPayment,
  createPendingJob,
  getJobById,
  getJobHistory,
  getJobsByShop,
  lockJob,
  processCollection,
  requoteJob,
  updateJob,
  updateJobStatus,
  acceptTransfer,
  checkReferralJob,
} from "../controllers/jobController.js";

export const router = Router();
router.route("/lock").post(lockJob);
router.route("/share").post(createPendingJob);
router.route("/shop/:shopId").get(getJobsByShop);
router.route("/history/:shopId").get(getJobHistory);

// Jobs
router.route("/check-referral").get(checkReferralJob);
router.route("/:jobId").get(getJobById);
router.route("/:jobId").put(updateJob);
router.route("/:jobId/status").put(updateJobStatus);
router.route("/:jobId/payments").post(addPayment);
router.route("/:jobId/collect").post(processCollection);
router.route("/:jobId/accept-transfer").post(acceptTransfer);
router.route("/:jobId/requote").post(requoteJob);
