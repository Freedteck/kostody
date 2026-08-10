import { useState } from "react";
import styles from "./IntakeForm.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const IntakeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const returnJobData = location.state?.returnJobData;
  const editJobData = location.state?.editJobData;

  const [hasReferralId, setHasReferralId] = useState(false);
  const [referralId, setReferralId] = useState("");

  const [formData, setFormData] = useState({
    customerName: editJobData?.customerName || returnJobData?.customer || "",
    customerPhone: editJobData?.customerPhone || returnJobData?.phone || "",
    deviceModel: editJobData?.device || returnJobData?.device || "",
    faultDescription: editJobData?.fault || "",
    quotedPrice: editJobData?.quotedPrice || "",
    upfrontPayment: editJobData?.upfrontPayment || "",
    quoteValidity: "7",
    accessoriesRetained: editJobData?.accessories?.join(", ") || "",
  });

  const isReturnJob = !!returnJobData;
  const isEditJob = !!editJobData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReferralIdBlur = (e) => {
    const id = e.target.value.trim();
    if (id === "KSD-9F3A") {
      setFormData((prev) => ({
        ...prev,
        customerName: "Engr. Chidi (Via Transfer)",
        deviceModel: "iPhone 13 Pro",
      }));
    } else if (id !== "") {
      alert("Job ID not found in system.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/app/summary", { state: { formData } });
  };

  const isLocked = (hasReferralId && referralId === "KSD-9F3A") || isReturnJob;

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
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
        <h1>
          {isEditJob
            ? "Edit Job Details"
            : isReturnJob
              ? "Return Job Intake"
              : "New Intake"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {!isReturnJob && !isEditJob && (
          <div className={styles.referralToggleContainer}>
            <label className={styles.label}>
              Accepting from another Engineer?
            </label>
            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel}>Enter Referral Job ID</span>
              <button
                type="button"
                className={`${styles.toggleSwitch} ${hasReferralId ? styles.on : ""}`}
                onClick={() => setHasReferralId(!hasReferralId)}
              >
                <div className={styles.toggleHandle}></div>
              </button>
            </div>
          </div>
        )}

        {hasReferralId && !isReturnJob && !isEditJob && (
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="referralId">
              Referral Job ID
            </label>
            <input
              type="text"
              className={`${styles.input} ${styles.inputMono}`}
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
              onBlur={handleReferralIdBlur}
              id="referralId"
              placeholder="e.g. KSD-9F3A"
              required={hasReferralId}
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="customerName">
            Customer Name
          </label>
          <input
            type="text"
            name="customerName"
            className={`${styles.input} ${isLocked ? styles.inputLocked : ""}`}
            value={formData.customerName}
            onChange={handleChange}
            id="customerName"
            required
            readOnly={isLocked}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="customerPhone">
            Customer Phone (WhatsApp)
          </label>
          <input
            type="tel"
            name="customerPhone"
            className={`${styles.input} ${isLocked ? styles.inputLocked : ""}`}
            value={formData.customerPhone}
            onChange={handleChange}
            id="customerPhone"
            placeholder="e.g. 0801 234 5678"
            required
            readOnly={isLocked}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="deviceModel">
            Device & Model
          </label>
          <input
            type="text"
            name="deviceModel"
            className={`${styles.input} ${isLocked ? styles.inputLocked : ""}`}
            value={formData.deviceModel}
            onChange={handleChange}
            id="deviceModel"
            placeholder="e.g. iPhone 13 Pro"
            required
            readOnly={isLocked}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="faultDescription">
            Diagnosis / Fault Description
          </label>
          <textarea
            name="faultDescription"
            className={styles.textarea}
            value={formData.faultDescription}
            onChange={handleChange}
            id="faultDescription"
            placeholder={
              isReturnJob
                ? "Describe the NEW fault..."
                : "e.g. Broken screen, touch still works."
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="accessoriesRetained">
            Accessories / Parts Retained
          </label>
          <input
            type="text"
            name="accessoriesRetained"
            className={styles.input}
            value={formData.accessoriesRetained}
            onChange={handleChange}
            id="accessoriesRetained"
            placeholder="e.g. SIM card, Battery"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Device Condition Photos</label>
          <label htmlFor="photoUpload" className={styles.photoUploadArea}>
            <span className={styles.cameraBtn}>+ Snap Condition</span>
            <p className={styles.photoHint}>
              Take photos of cracks, dents, or existing damage.
            </p>
          </label>
          <input
            type="file"
            id="photoUpload"
            accept="image/*"
            capture="environment"
            multiple
            style={{ display: "none" }}
          />
        </div>

        <div className={styles.priceRow}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="quotedPrice">
              Quoted Price (₦)
            </label>
            <input
              type="number"
              name="quotedPrice"
              className={`${styles.input} ${styles.priceInput}`}
              value={formData.quotedPrice}
              onChange={handleChange}
              id="quotedPrice"
              placeholder="25000"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="upfrontPayment">
              Upfront Paid (₦)
            </label>
            <input
              type="number"
              name="upfrontPayment"
              className={`${styles.input} ${styles.priceInput}`}
              value={formData.upfrontPayment}
              onChange={handleChange}
              id="upfrontPayment"
              placeholder="10000"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="quoteValidity">
            Quote Validity Window
          </label>
          <select
            name="quoteValidity"
            className={styles.select}
            value={formData.quoteValidity}
            onChange={handleChange}
            id="quoteValidity"
            required
          >
            <option value="3">3 Days</option>
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn}>
          {isEditJob
            ? "Save Changes"
            : isReturnJob
              ? "Review Return Job"
              : "Review & Continue"}
        </button>
      </form>
    </div>
  );
};

export default IntakeForm;
