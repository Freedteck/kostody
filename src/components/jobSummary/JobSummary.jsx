import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  TopAppBar,
  IconButton,
  Card,
  Switch,
  Button,
  Icon,
  Divider,
  PhotoGrid,
  PhotoViewer,
} from "../../ui";
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
import styles from "./JobSummary.module.css";

const naira = (value) => `₦${parseInt(value || 0, 10).toLocaleString()}`;

const Row = ({ label, value, mono }) => (
  <div className={styles.detailRow}>
    <span className={`${styles.detailLabel} md-typescale-body-medium`}>
      {label}
    </span>
    <span
      className={`${styles.detailValue} md-typescale-body-medium ${
        mono ? styles.mono : ""
      }`}
    >
      {value}
    </span>
  </div>
);

const JobSummary = () => {
  const [shareWithCustomer, setShareWithCustomer] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false);
  const [exists, setExists] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const { shopId } = useShop();
  const { showToast } = useToast();

  const formData = location.state?.formData;
  const photos = useMemo(() => formData?.photos || [], [formData]);

  const photoSrcs = useMemo(
    () =>
      photos.map((p) => (typeof p === "string" ? p : URL.createObjectURL(p))),
    [photos],
  );

  useEffect(
    () => () => {
      photoSrcs.forEach((src, i) => {
        if (photos[i] && typeof photos[i] !== "string")
          URL.revokeObjectURL(src);
      });
    },
    [photoSrcs, photos],
  );

  if (!formData) {
    return <Navigate to="/app/intake" replace />;
  }

  const isEditJob = !!formData.id;

  const accessories = formData.accessoriesRetained
    ? formData.accessoriesRetained
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const outstandingBalance =
    (formData.quotedPrice || 0) - (formData.upfrontPayment || 0);

  const handleShare = () => {
    setIsLoading(true);
    createPendingJob(formData, shopId)
      .then((data) => {
        if (photos.length > 0) {
          return uploadPhotos(data.id, photos).then(() => data);
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

  const handleAgreementLock = (pin) =>
    lockJob(formData, shopId, customerData?.customerId, pin)
      .then((data) => {
        if (photos.length > 0) {
          return uploadPhotos(data.id, photos).then(() => data);
        }
        return data;
      })
      .then(() => {
        setIsPinOpen(false);
        setIsSuccessOpen(true);
      })
      .catch((error) => {
        throw new Error(error.message || "Failed to lock job");
      });

  const handleEditSave = () => {
    setIsLoading(true);
    updateJob(formData.id, formData)
      .then((updatedJob) => {
        if (photos.length > 0) {
          return uploadPhotos(updatedJob.id, photos).then(() => updatedJob);
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

  const showShare = !isEditJob && shareWithCustomer;

  return (
    <div className={styles.page}>
      <TopAppBar
        title={isEditJob ? "Review Changes" : "Job Summary"}
        subtitle={isEditJob ? "Confirm your edits" : "Confirm the agreement"}
        leading={
          <IconButton
            variant="standard"
            icon="arrow_back"
            label="Go back"
            onClick={() => navigate(-1)}
          />
        }
      />

      <div className={styles.content}>
        {formData.isReturnJob && (
          <div className={styles.warranty}>
            <Icon name="verified_user" size={22} />
            <div>
              <p className={`${styles.warrantyTitle} md-typescale-title-small`}>
                Warranty return
              </p>
              <p className="md-typescale-body-small">
                Linked to a previous job - no new charge unless a new fault is
                logged.
              </p>
            </div>
          </div>
        )}

        <Card variant="outlined" padded={false} className={styles.receipt}>
          <section className={styles.section}>
            <p className={`${styles.sectionTitle} md-typescale-label-large`}>
              Customer & device
            </p>
            <Row label="Customer" value={formData.customerName} />
            <Row label="Phone" value={formData.customerPhone} mono />
            <Row label="Device" value={formData.deviceModel} />
          </section>

          <Divider />

          <section className={styles.section}>
            <p className={`${styles.sectionTitle} md-typescale-label-large`}>
              Diagnosis
            </p>
            <p className={`${styles.fault} md-typescale-body-medium`}>
              {formData.faultDescription}
            </p>
            {accessories.length > 0 && (
              <div className={styles.accessories}>
                {accessories.map((item, i) => (
                  <span
                    key={i}
                    className={`${styles.chip} md-typescale-label-large`}
                  >
                    <Icon name="cable" size={14} />
                    {item}
                  </span>
                ))}
              </div>
            )}
          </section>

          {photoSrcs.length > 0 && (
            <>
              <Divider />
              <section className={styles.section}>
                <p
                  className={`${styles.sectionTitle} md-typescale-label-large`}
                >
                  Condition photos
                </p>
                <PhotoGrid
                  photos={photoSrcs}
                  onOpen={(i) => setViewerIndex(i)}
                />
              </section>
            </>
          )}

          <Divider />

          <section className={styles.section}>
            <p className={`${styles.sectionTitle} md-typescale-label-large`}>
              Financial agreement
            </p>
            <div className={styles.priceRow}>
              <span className="md-typescale-body-medium">Quoted price</span>
              <span className={`${styles.amount} md-typescale-body-large`}>
                {naira(formData.quotedPrice)}
              </span>
            </div>
            <div className={styles.priceRow}>
              <span className="md-typescale-body-medium">Upfront paid</span>
              <span className={`${styles.amount} md-typescale-body-large`}>
                {naira(formData.upfrontPayment)}
              </span>
            </div>
            <div className={styles.outstanding}>
              <span className="md-typescale-title-small">
                Outstanding balance
              </span>
              <span
                className={`${styles.outstandingAmount} md-typescale-title-medium`}
              >
                ₦{outstandingBalance.toLocaleString()}
              </span>
            </div>
            <div className={styles.validity}>
              <Icon name="event_available" size={16} />
              <span className="md-typescale-body-small">
                Quote valid for {formData.quoteValidity} days
              </span>
            </div>
          </section>
        </Card>

        <div className={styles.actions}>
          {!isEditJob && (
            <Card variant="filled" className={styles.toggleCard}>
              <div className={styles.toggleText}>
                <p className="md-typescale-body-large">Share with customer</p>
                <p className={`${styles.toggleHint} md-typescale-body-small`}>
                  Turn on if the customer isn't here to enter their PIN.
                </p>
              </div>
              <Switch
                selected={shareWithCustomer}
                onChange={(e) => setShareWithCustomer(e.target.selected)}
                aria-label="Share with customer"
              />
            </Card>
          )}

          {showShare ? (
            <Button
              variant="filled"
              full
              icon="ios_share"
              onClick={handleShare}
              disabled={isLoading}
            >
              {isLoading ? "Preparing link…" : "Share via WhatsApp"}
            </Button>
          ) : (
            <Button
              variant="filled"
              full
              icon={isEditJob ? "save" : "lock"}
              onClick={handlePrimaryAction}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing…"
                : isEditJob
                  ? "Save Changes"
                  : "Lock Agreement"}
            </Button>
          )}
        </div>
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

      <PhotoViewer
        open={viewerIndex >= 0}
        photos={photoSrcs}
        startIndex={viewerIndex < 0 ? 0 : viewerIndex}
        onClose={() => setViewerIndex(-1)}
      />
    </div>
  );
};

export default JobSummary;
