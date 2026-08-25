import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TopAppBar,
  IconButton,
  TextField,
  TextArea,
  Select,
  Option,
  Switch,
  SegmentedButtons,
  PhotoGrid,
  Button,
  Card,
  Icon,
} from "../../ui";
import { checkReferralJob } from "../../services/api";
import useToast from "../../hooks/useToast";
import styles from "./IntakeForm.module.css";

const VALIDITY = [
  { value: "3", label: "3 Days" },
  { value: "7", label: "7 Days" },
  { value: "14", label: "14 Days" },
  { value: "30", label: "30 Days" },
];

const RETURN_REASONS = [
  { value: "imperfection", label: "Imperfection" },
  { value: "new", label: "New Issue" },
];

const IntakeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const returnJobData = location.state?.returnJobData;
  const editJobData = location.state?.editJobData;

  const [hasReferralId, setHasReferralId] = useState(false);
  const [referralId, setReferralId] = useState("");
  const [referralError, setReferralError] = useState(null);
  const [isCheckingReferral, setIsCheckingReferral] = useState(false);
  const [returnReason, setReturnReason] = useState("imperfection");
  const [photos, setPhotos] = useState([]);

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

  const title = isEditJob
    ? "Edit Job Details"
    : isReturnJob
      ? "Return Job Intake"
      : "New Intake";

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

  const submitLabel = isEditJob
    ? "Save Changes"
    : isReturnJob
      ? "Review Return Job"
      : "Review & Continue";

  return (
    <div className={styles.page}>
      <TopAppBar
        title={title}
        leading={
          <IconButton
            variant="standard"
            icon="arrow_back"
            label="Go back"
            onClick={() => navigate(-1)}
          />
        }
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        {!isReturnJob && !isEditJob && (
          <Card variant="filled" className={styles.toggleCard}>
            <div className={styles.toggleText}>
              <p className="md-typescale-body-large">
                Accepting from another engineer?
              </p>
              <p
                className={`${styles.toggleHint} md-typescale-body-small`}
              >
                Enter a referral job ID to auto-fill the customer.
              </p>
            </div>
            <Switch
              selected={hasReferralId}
              onChange={(e) => setHasReferralId(e.target.selected)}
              aria-label="Accepting a referral"
            />
          </Card>
        )}

        {hasReferralId && !isReturnJob && !isEditJob && (
          <TextField
            className={`${styles.field} ${styles.mono}`}
            label="Referral Job ID"
            value={referralId}
            onChange={(e) => setReferralId(e.target.value)}
            onBlur={handleReferralIdBlur}
            leadingIcon="qr_code_2"
            placeholder="e.g. KSD-9F3A"
            required={hasReferralId}
            error={!!referralError}
            errorText={referralError || ""}
            supportingText={isCheckingReferral ? "Checking…" : undefined}
          />
        )}

        {isReturnJob && (
          <div className={styles.reasonBlock}>
            <label className={`${styles.blockLabel} md-typescale-label-large`}>
              Return reason
            </label>
            <SegmentedButtons
              options={RETURN_REASONS}
              value={returnReason}
              onChange={setReturnReason}
            />
          </div>
        )}

        {isLocked && (
          <div className={styles.lockNote}>
            <Icon name="lock" size={16} />
            <span className="md-typescale-body-small">
              Customer and device are locked from the linked job.
            </span>
          </div>
        )}

        <div className={styles.pair}>
          <TextField
            className={styles.field}
            label="Customer name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            leadingIcon="person"
            required
            readOnly={isLocked}
          />
          <TextField
            className={styles.field}
            label="Customer phone (WhatsApp)"
            name="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={handleChange}
            leadingIcon="call"
            placeholder="e.g. 0801 234 5678"
            required
            readOnly={isLocked}
          />
        </div>

        <TextField
          className={styles.field}
          label="Device & model"
          name="deviceModel"
          value={formData.deviceModel}
          onChange={handleChange}
          leadingIcon="smartphone"
          placeholder="e.g. iPhone 13 Pro"
          required
          readOnly={isLocked}
        />

        <TextArea
          className={styles.field}
          label="Diagnosis / fault description"
          name="faultDescription"
          rows={3}
          value={formData.faultDescription}
          onChange={handleChange}
          placeholder={
            isReturnJob
              ? "Describe the NEW fault…"
              : "e.g. Broken screen, touch still works."
          }
          required
        />

        <TextField
          className={styles.field}
          label="Accessories / parts retained"
          name="accessoriesRetained"
          value={formData.accessoriesRetained}
          onChange={handleChange}
          leadingIcon="cable"
          placeholder="e.g. SIM card, Battery"
        />

        <div className={styles.photoBlock}>
          <label className={`${styles.blockLabel} md-typescale-label-large`}>
            Device condition photos
          </label>
          <p className={`${styles.blockHint} md-typescale-body-small`}>
            Capture cracks, dents, or existing damage before you start.
          </p>
          <PhotoGrid
            photos={photos}
            editable
            onAddFiles={(files) => setPhotos((prev) => [...prev, ...files])}
            onRemove={(i) =>
              setPhotos((prev) => prev.filter((_, idx) => idx !== i))
            }
          />
        </div>

        <div className={styles.pair}>
          <TextField
            className={styles.field}
            label="Quoted price"
            name="quotedPrice"
            type="number"
            inputmode="numeric"
            prefixText="₦ "
            value={formData.quotedPrice}
            onChange={handleChange}
            placeholder="25000"
            required
          />
          <TextField
            className={styles.field}
            label="Upfront paid"
            name="upfrontPayment"
            type="number"
            inputmode="numeric"
            prefixText="₦ "
            value={formData.upfrontPayment}
            onChange={handleChange}
            placeholder="10000"
          />
        </div>

        <Select
          className={styles.field}
          label="Quote validity window"
          name="quoteValidity"
          value={formData.quoteValidity}
          onChange={handleChange}
          leadingIcon="event"
          required
        >
          {VALIDITY.map((v) => (
            <Option key={v.value} value={v.value}>
              {v.label}
            </Option>
          ))}
        </Select>

        <div className={styles.actions}>
          <Button type="submit" variant="filled" full trailing="arrow_forward">
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default IntakeForm;
