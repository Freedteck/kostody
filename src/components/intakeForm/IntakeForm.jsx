import { useState } from "react";
import styles from "./IntakeForm.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { checkReferralJob } from "../../services/api";
import useToast from "../../hooks/useToast";

const IntakeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const returnJobData = location.state?.returnJobData;
  const editJobData = location.state?.editJobData;

  const [hasReferralId, setHasReferralId] = useState(false);
  const [referralId, setReferralId] = useState("");
  const [referralError, setReferralError] = useState(null);
  const [isCheckingReferral, setIsCheckingReferral] = useState(false);
  const [returnReason, setReturnReason] = useState("imperfection");
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customerName:
      editJobData?.customer.name || returnJobData?.customerName || "",
    customerPhone:
      editJobData?.customer.phone || returnJobData?.customerPhone || "",
    deviceModel: editJobData?.deviceModel || returnJobData?.deviceModel || "",
    faultDescription: editJobData?.faultDescription || "",
    quotedPrice: editJobData?.quotedPrice || "",
    upfrontPayment: editJobData?.upfrontPayment || "",
    quoteValidity: editJobData?.quoteValidityDays || "7",
    accessoriesRetained: editJobData?.accessoriesRetained?.join(", ") || "",
    id: editJobData?.id || null,
  });

  const isReturnJob = !!returnJobData;
  const isEditJob = !!editJobData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReferralIdBlur = (e) => {
    const id = e.target.value.trim();
    if (!id) return;

    setIsCheckingReferral(true);
    setReferralError(null);

    checkReferralJob(id)
      .then((result) => {
        if (!result) throw new Error("Job ID not found in system.");
        setFormData((prev) => ({
          ...prev,
          customerName: result.customerName || "",
          customerPhone: result.customerPhone || "",
          deviceModel: result.deviceModel || "",
        }));
        showToast("Referral Job ID verified.", "success");
      })
      .catch((error) => {
        setReferralError(error.message || "Job ID not found in system.");
        showToast("Job ID not found in system.", "error");
      })
      .finally(() => {
        setIsCheckingReferral(false);
      });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData, photos };

    if (hasReferralId && referralId && !referralError) {
      finalData.referralId = referralId;
    }

    if (isReturnJob && returnJobData?.id) {
      if (returnReason === "imperfection") {
        finalData.parentJobId = returnJobData.id;
        finalData.isReturnJob = true;
      } else {
        finalData.parentJobId = null;
        finalData.isReturnJob = false;
      }
    }

    navigate("/app/summary", { state: { formData: finalData } });
  };

  const isLocked =
    (hasReferralId && referralId && !referralError) ||
    (isReturnJob && returnReason === "imperfection");

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
            {referralError && (
              <p className={styles.referralError}>{referralError}</p>
            )}
            {isCheckingReferral && (
              <p
                className={styles.referralError}
                style={{ color: "var(--text-secondary)" }}
              >
                Checking...
              </p>
            )}
          </div>
        )}

        {isReturnJob && (
          <div className={styles.referralToggleContainer}>
            <label className={styles.label}>Return Reason</label>
            <div className={styles.returnReasonRow}>
              <button
                type="button"
                className={`${styles.reasonBtn} ${returnReason === "imperfection" ? styles.reasonActive : ""}`}
                onClick={() => setReturnReason("imperfection")}
              >
                Imperfection
              </button>
              <button
                type="button"
                className={`${styles.reasonBtn} ${returnReason === "new" ? styles.reasonActive : ""}`}
                onClick={() => setReturnReason("new")}
              >
                New Issue
              </button>
            </div>
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
          {photoPreviews.length > 0 && (
            <div className={styles.previewGrid}>
              {photoPreviews.map((preview, index) => (
                <div key={index} className={styles.previewItem}>
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removePhotoBtn}
                    onClick={() => handleRemovePhoto(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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
            onChange={handlePhotoChange}
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
