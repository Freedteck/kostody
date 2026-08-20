/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./JobSummary.module.css";
import PinPad from "../pinPad/PinPad";
import SuccessSheet from "../successSheet/SuccessSheet";
import ForgotPinSheet from "../forgotPinSheet/ForgotPinSheet";
import {
  checkCustomer,
  createPendingJob,
  lockJob,
  updateJob,
  uploadPhotos,
} from "../../services/api";
import useShop from "../../hooks/useShop";
import useToast from "../../hooks/useToast";

const JobSummary = () => {
  const [shareWithCustomer, setShareWithCustomer] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false);
  const [exists, setExists] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { shopId } = useShop();
  const { showToast } = useToast();

  const formData = location.state?.formData;
  const isEditJob = formData?.id ? true : false;

  if (!formData) {
    navigate("/app/intake");
    return null;
  }

  const outstandingBalance =
    (formData.quotedPrice || 0) - (formData.upfrontPayment || 0);

  const handleShare = () => {
    setIsLoading(true);
    createPendingJob(formData, shopId)
      .then((data) => {
        if (formData.photos && formData.photos.length > 0) {
          return uploadPhotos(data.id, formData.photos).then(() => data);
        }
        return data;
      })
      .then((data) => {
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `Track your repair here: ${window.location.origin}/c/${data.id}`,
        )}`;
        window.open(shareUrl, "_blank");
        setIsSuccessOpen(true);
      })
      .catch(() => {
        showToast("Failed to generate share link.", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    navigate("/app/dashboard");
  };

  const handleLock = () => {
    setIsLoading(true);
    checkCustomer(formData.customerPhone)
      .then((customer) => {
        setExists(customer.exists);
        setCustomerData(customer);
        setIsPinOpen(true);
      })
      .catch(() => {
        showToast("Failed to check customer. Please try again.", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAgreementLock = async (pin) => {
    return await lockJob(formData, shopId, customerData?.customerId, pin)
      .then((data) => {
        if (formData.photos && formData.photos.length > 0) {
          return uploadPhotos(data.id, formData.photos).then(() => data);
        }
        return data;
      })
      .then((data) => {
        setIsPinOpen(false);
        setIsSuccessOpen(true);
      })
      .catch((error) => {
        throw new Error(error.message || "Failed to lock job");
      });
  };

  const handleEditSave = () => {
    setIsLoading(true);
    updateJob(formData.id, formData)
      .then((updatedJob) => {
        if (formData.photos && formData.photos.length > 0) {
          return uploadPhotos(updatedJob.id, formData.photos).then(
            () => updatedJob,
          );
        }
        return updatedJob;
      })
      .then((updatedJob) => {
        showToast("Job updated successfully.", "success");
        navigate(`/app/job/${updatedJob.id}`);
      })
      .catch((error) => {
        showToast(error.message || "Failed to update job.", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePrimaryAction = () => {
    if (isEditJob) {
      handleEditSave();
    } else {
      handleLock();
    }
  };

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryHeader}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1>{isEditJob ? "Review Changes" : "Job Summary"}</h1>
      </div>

      {formData.isReturnJob && (
        <div className={styles.warrantyBanner}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <h4>Return Job</h4>
            <p>You are processing a return Job</p>
          </div>
        </div>
      )}

      <div className={styles.receiptPaper}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Customer & Device</h2>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Customer</span>
            <span className={styles.detailValue}>{formData.customerName}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Phone</span>
            <span className={styles.detailValue}>{formData.customerPhone}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Device</span>
            <span className={styles.detailValue}>{formData.deviceModel}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Diagnosis</h2>
          <p className={styles.faultText}>{formData.faultDescription}</p>
          {formData.accessoriesRetained && (
            <div
              className={styles.detailRow}
              style={{ marginTop: "15px", alignItems: "flex-start" }}
            >
              <span className={styles.detailLabel}>Accessories</span>
              <div className={styles.pillContainer}>
                {formData.accessoriesRetained?.split(",").map((item, index) => (
                  <span key={index} className={styles.pill}>
                    {item.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Condition Photos</h2>
          <div className={styles.photoGrid}>
            {formData.photos && formData.photos.length > 0 ? (
              formData.photos.map((photo, index) => (
                <div key={index} className={styles.photoBox}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              ))
            ) : (
              <div className={styles.photoBox}>No Image</div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Financial Agreement</h2>
          <div className={styles.priceRow}>
            <span>Quoted Price:</span>
            <span className={styles.mono}>
              ₦{parseInt(formData.quotedPrice || 0).toLocaleString()}
            </span>
          </div>
          <div className={styles.priceRow}>
            <span>Upfront Paid:</span>
            <span className={styles.mono}>
              ₦{parseInt(formData.upfrontPayment || 0).toLocaleString()}
            </span>
          </div>
          <div className={`${styles.priceRow} ${styles.outstanding}`}>
            <span>Outstanding Balance:</span>
            <span className={styles.mono}>
              ₦{outstandingBalance.toLocaleString()}
            </span>
          </div>
          <div className={styles.detailRow} style={{ marginTop: "15px" }}>
            <span className={styles.detailLabel}>Quote Validity:</span>
            <span className={styles.detailValue}>
              {formData.quoteValidity} Days
            </span>
          </div>
        </div>
      </div>

      <div className={styles.actionArea}>
        {!isEditJob && (
          <div className={styles.toggleRow}>
            <div>
              <span className={styles.toggleLabel}>Share with Customer</span>
              <p className={styles.toggleSubtext}>
                Toggle ON if customer is not present
              </p>
            </div>
            <button
              type="button"
              className={`${styles.toggleSwitch} ${shareWithCustomer ? styles.on : ""}`}
              onClick={() => setShareWithCustomer(!shareWithCustomer)}
            >
              <div className={styles.toggleHandle}></div>
            </button>
          </div>
        )}

        {!isEditJob && shareWithCustomer ? (
          <button className={styles.shareBtn} onClick={handleShare}>
            Share via WhatsApp
          </button>
        ) : (
          <button
            className={styles.lockBtn}
            onClick={handlePrimaryAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span> Processing...
              </>
            ) : isEditJob ? (
              "Save Changes"
            ) : (
              "Lock Agreement"
            )}
          </button>
        )}
      </div>

      {isPinOpen && (
        <PinPad
          onProcess={handleAgreementLock}
          onClose={() => setIsPinOpen(false)}
          title="Authorize Agreement"
          isNewUser={!exists}
          onForgotPin={() => setIsForgotPinOpen(true)}
        />
      )}

      {isForgotPinOpen && (
        <ForgotPinSheet
          onClose={() => setIsForgotPinOpen(false)}
          onSuccess={() => {
            setIsForgotPinOpen(false);
            showToast(
              "PIN reset successfully. Please enter your new PIN.",
              "success",
            );
          }}
          initialPhone={formData.customerPhone}
        />
      )}

      {isSuccessOpen && (
        <SuccessSheet
          title={shareWithCustomer ? "Link Sent" : "Agreement Locked"}
          message={
            shareWithCustomer
              ? "Job is awaiting customer confirmation via WhatsApp."
              : "Customer PIN verified. You may now begin work."
          }
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default JobSummary;
