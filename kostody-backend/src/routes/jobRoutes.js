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
  cancelJob,
  confirmJob,
} from "../controllers/jobController.js";
import { upload, uploadJobPhotos } from "../controllers/photoController.js";
import {
  authenticate,
  requireRole,
  requireShopParam,
  overrideBodyShopId,
  authorizeJob,
} from "../middleware/auth.js";
import { pinLimiter } from "../middleware/rateLimit.js";

export const router = Router();

router
  .route("/lock")
  .post(authenticate, requireRole("ENGINEER"), overrideBodyShopId, lockJob);
router
  .route("/share")
  .post(
    authenticate,
    requireRole("ENGINEER"),
    overrideBodyShopId,
    createPendingJob,
  );

router
  .route("/shop/:shopId")
  .get(authenticate, requireRole("ENGINEER"), requireShopParam, getJobsByShop);
router
  .route("/history/:shopId")
  .get(authenticate, requireRole("ENGINEER"), requireShopParam, getJobHistory);

router
  .route("/check-referral")
  .get(authenticate, requireRole("ENGINEER"), checkReferralJob);

router
  .route("/:jobId")
  .get(
    authenticate,
    requireRole("ENGINEER", "CUSTOMER"),
    authorizeJob,
    getJobById,
  );
router
  .route("/:jobId")
  .put(authenticate, requireRole("ENGINEER"), authorizeJob, updateJob);
router
  .route("/:jobId/status")
  .put(authenticate, requireRole("ENGINEER"), authorizeJob, updateJobStatus);
router
  .route("/:jobId/payments")
  .post(authenticate, requireRole("ENGINEER"), authorizeJob, addPayment);
router
  .route("/:jobId/collect")
  .post(
    authenticate,
    requireRole("ENGINEER"),
    pinLimiter,
    authorizeJob,
    processCollection,
  );
router
  .route("/:jobId/accept-transfer")
  .post(
    authenticate,
    requireRole("ENGINEER"),
    pinLimiter,
    authorizeJob,
    acceptTransfer,
  );
router
  .route("/:jobId/requote")
  .post(
    authenticate,
    requireRole("ENGINEER"),
    pinLimiter,
    authorizeJob,
    requoteJob,
  );
router
  .route("/:jobId/cancel")
  .post(
    authenticate,
    requireRole("ENGINEER"),
    pinLimiter,
    authorizeJob,
    cancelJob,
  );
router
  .route("/:jobId/confirm")
  .post(
    authenticate,
    requireRole("CUSTOMER"),
    pinLimiter,
    authorizeJob,
    confirmJob,
  );
router
  .route("/:jobId/photos")
  .post(
    authenticate,
    requireRole("ENGINEER"),
    authorizeJob,
    upload.array("photos", 10),
    uploadJobPhotos,
  );
