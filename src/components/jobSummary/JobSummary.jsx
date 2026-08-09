import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./JobSummary.module.css";
import PinPad from "../pinPad/PinPad";
import SuccessSheet from "../successSheet/SuccessSheet";

const JobSummary = () => {
  const [shareWithCustomer, setShareWithCustomer] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const formData = location.state?.formData;

  if (!formData) {
    navigate("/app/intake");
    return null;
  }

  const outstandingBalance =
    (formData.quotedPrice || 0) - (formData.upfrontPayment || 0);

  const handlePinSuccess = (pin) => {
    console.log("Agreement locked with PIN:", pin);
    setIsPinOpen(false);
    setIsSuccessOpen(true);
  };

  const handleShare = () => {
    console.log("Link sent to customer via WhatsApp");
    setIsSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    navigate("/app/dashboard");
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
        <h1>Job Summary</h1>
      </div>

      <div className={styles.receiptPaper}>
        {/* Customer & Device */}
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

        {/* Diagnosis */}
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
                {formData.accessoriesRetained.split(",").map((item, index) => (
                  <span key={index} className={styles.pill}>
                    {item.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Condition Photos */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Condition Photos</h2>
          <div className={styles.photoGrid}>
            <div className={styles.photoBox}>No Image</div>
            <div className={styles.photoBox}>No Image</div>
            <div className={styles.photoBox}>No Image</div>
          </div>
        </div>

        {/* Financials */}
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

      {/* Action Area */}
      <div className={styles.actionArea}>
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

        {!shareWithCustomer ? (
          <button className={styles.lockBtn} onClick={() => setIsPinOpen(true)}>
            Lock Agreement
          </button>
        ) : (
          <button className={styles.shareBtn} onClick={handleShare}>
            Share via WhatsApp
          </button>
        )}
      </div>

      {isPinOpen && (
        <PinPad
          onSuccess={handlePinSuccess}
          onClose={() => setIsPinOpen(false)}
          title="Authorize Agreement"
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
