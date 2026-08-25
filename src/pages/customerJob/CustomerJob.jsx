import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TopAppBar,
  IconButton,
  Card,
  StatusChip,
  Icon,
  Button,
  Timeline,
  PhotoGrid,
  PhotoViewer,
  Skeleton,
  ErrorState,
} from "../../ui";
import PinPad from "../../components/pinPad/PinPad";
import SuccessSheet from "../../components/successSheet/SuccessSheet";
import { getJobsById, confirmJob } from "../../services/api";
import useToast from "../../hooks/useToast";
import styles from "./CustomerJob.module.css";

const naira = (value) => `₦${(Number(value) || 0).toLocaleString()}`;

const STATUS_COPY = {
  "In Progress": {
    icon: "build",
    title: "Repair in progress",
    text: "Your device is on the workbench being repaired.",
  },
  Transferred: {
    icon: "swap_horiz",
    title: "With a specialist",
    text: "Your device was transferred for specialized repair. It remains tracked.",
  },
  "Ready for Pickup": {
    icon: "check_circle",
    title: "Ready for pickup",
    text: "Your device is repaired and waiting for you at the shop.",
  },
  Completed: {
    icon: "task_alt",
    title: "Job completed",
    text: "This repair has been completed and collected.",
  },
  Cancelled: {
    icon: "cancel",
    title: "Job cancelled",
    text: "This repair job was cancelled.",
  },
};

const CustomerJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { showToast } = useToast();

  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(-1);
  const [prevJobId, setPrevJobId] = useState(jobId);

  if (jobId !== prevJobId) {
    setPrevJobId(jobId);
    setIsLoading(true);
    setError(null);
  }

  useEffect(() => {
    if (!jobId) return undefined;
    let active = true;
    getJobsById(jobId)
      .then((data) => {
        if (active) setJobData(data);
      })
      .catch(() => {
        if (active) {
          setError("Failed to load job details.");
          showToast("Could not fetch job details.", "error");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [jobId, showToast]);

  const handlePinSuccess = (pin) =>
    confirmJob(jobData.id, pin).then(() => {
      setIsPinOpen(false);
      setIsSuccessOpen(true);
    });

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <TopAppBar
          title="Repair"
          leading={
            <IconButton
              icon="arrow_back"
              label="Back"
              onClick={() => navigate(-1)}
            />
          }
        />
        <div className={styles.content}>
          <Skeleton width="100%" height="88px" radius="20px" />
          <Skeleton width="100%" height="160px" radius="20px" />
          <Skeleton width="100%" height="200px" radius="20px" />
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className={styles.page}>
        <TopAppBar
          title="Repair"
          leading={
            <IconButton
              icon="arrow_back"
              label="Back"
              onClick={() => navigate(-1)}
            />
          }
        />
        <div className={styles.content}>
          <ErrorState message={error || "Job not found."} />
        </div>
      </div>
    );
  }

  const showSummary =
    jobData.status === "Pending Confirmation" && !jobData.customerConfirmed;
  const totalPaid = (jobData.payments || []).reduce(
    (sum, p) => sum + p.amount,
    0,
  );
  const outstandingBalance = (Number(jobData.quotedPrice) || 0) - totalPaid;
  const accessories = jobData.accessoriesRetained || [];
  const photoSrcs = (jobData.photos || []).map((p) =>
    typeof p === "string" ? p : p.url || p.src || "",
  );
  const statusCopy = STATUS_COPY[jobData.status];
  const timelineEvents = (jobData.events || []).map((e) => ({
    id: e.id,
    text: e.eventText,
    time: new Date(e.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div className={styles.page}>
      <TopAppBar
        title={showSummary ? "Repair agreement" : jobData.deviceModel}
        subtitle={jobData.shop?.shopName}
        leading={
          <IconButton
            icon="arrow_back"
            label="Back"
            onClick={() => navigate(-1)}
          />
        }
      />

      <div className={styles.content}>
        {showSummary ? (
          <>
            <Card
              padded={false}
              className={styles.hero}
              style={{
                background: "var(--md-sys-color-primary-container)",
                color: "var(--md-sys-color-on-primary-container)",
              }}
            >
              <div className={styles.heroBody}>
                <Icon name="verified_user" size={28} filled />
                <div>
                  <h2 className="md-typescale-title-medium">
                    Review &amp; authorize
                  </h2>
                  <p className="md-typescale-body-medium">
                    Confirm the details below are correct, then lock the
                    agreement with your PIN.
                  </p>
                </div>
              </div>
            </Card>

            <Card className={styles.section}>
              <h3 className={`${styles.sectionTitle} md-typescale-title-small`}>
                Customer &amp; device
              </h3>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Customer</span>
                <span className={styles.detailValue}>
                  {jobData.customer?.name}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Device</span>
                <span className={styles.detailValue}>{jobData.deviceModel}</span>
              </div>
            </Card>

            <Card className={styles.section}>
              <h3 className={`${styles.sectionTitle} md-typescale-title-small`}>
                Diagnosis
              </h3>
              <p className={`${styles.fault} md-typescale-body-medium`}>
                {jobData.faultDescription}
              </p>
              {accessories.length > 0 && (
                <>
                  <p className={`${styles.subLabel} md-typescale-label-medium`}>
                    Accessories retained
                  </p>
                  <div className={styles.chips}>
                    {accessories.map((item, i) => (
                      <span key={i} className={styles.chip}>
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </Card>

            <Card className={styles.section}>
              <h3 className={`${styles.sectionTitle} md-typescale-title-small`}>
                Condition photos
              </h3>
              {photoSrcs.length > 0 ? (
                <PhotoGrid photos={photoSrcs} onOpen={setViewerIndex} />
              ) : (
                <p className={`${styles.muted} md-typescale-body-medium`}>
                  No photos on record.
                </p>
              )}
            </Card>

            <Card className={styles.section}>
              <h3 className={`${styles.sectionTitle} md-typescale-title-small`}>
                Financial agreement
              </h3>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Quoted price</span>
                <span className={`${styles.detailValue} ${styles.mono}`}>
                  {naira(jobData.quotedPrice)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Upfront paid</span>
                <span className={`${styles.detailValue} ${styles.mono}`}>
                  {naira(totalPaid)}
                </span>
              </div>
              <div className={styles.outstanding}>
                <span className="md-typescale-body-large">
                  Outstanding balance
                </span>
                <span
                  className={`${styles.outstandingAmount} md-typescale-title-medium`}
                >
                  {naira(outstandingBalance)}
                </span>
              </div>
              <div className={styles.validity}>
                <Icon name="event" size={18} />
                Quote valid for {jobData.quoteValidityDays} days
              </div>
            </Card>

            <p className={`${styles.disclaimer} md-typescale-body-small`}>
              By authorizing, you confirm the device condition, fault
              description, and quoted price above. This record cannot be
              altered afterwards.
            </p>
            <Button
              variant="filled"
              full
              icon="lock"
              onClick={() => setIsPinOpen(true)}
            >
              Lock agreement
            </Button>
          </>
        ) : (
          <>
            {statusCopy && (
              <Card padded={false} className={styles.statusCard}>
                <div className={styles.statusBody}>
                  <span className={styles.statusIcon}>
                    <Icon name={statusCopy.icon} size={26} filled />
                  </span>
                  <div className={styles.statusText}>
                    <div className={styles.statusHead}>
                      <h2 className="md-typescale-title-medium">
                        {statusCopy.title}
                      </h2>
                      <StatusChip status={jobData.status} size="small" />
                    </div>
                    <p
                      className={`${styles.muted} md-typescale-body-medium`}
                    >
                      {statusCopy.text}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <Card className={styles.section}>
              <h3 className={`${styles.sectionTitle} md-typescale-title-small`}>
                Device &amp; diagnosis
              </h3>
              <p className={`${styles.device} md-typescale-title-medium`}>
                {jobData.deviceModel}
              </p>
              <p className={`${styles.fault} md-typescale-body-medium`}>
                {jobData.faultDescription}
              </p>
            </Card>

            {jobData.status === "Transferred" && (
              <Card
                className={styles.section}
                style={{
                  background: "var(--md-sys-color-tertiary-container)",
                  color: "var(--md-sys-color-on-tertiary-container)",
                }}
              >
                <h3 className={`${styles.sectionTitle} md-typescale-title-small`}>
                  Chain of custody
                </h3>
                <p className="md-typescale-body-medium">
                  Your device is with a specialist and undergoing specialized
                  repair. It stays fully tracked under this agreement.
                </p>
              </Card>
            )}

            <Card className={styles.section}>
              <h3 className={`${styles.sectionTitle} md-typescale-title-small`}>
                Accessories in shop
              </h3>
              {accessories.length > 0 ? (
                <div className={styles.chips}>
                  {accessories.map((item, i) => (
                    <span key={i} className={styles.chip}>
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={`${styles.muted} md-typescale-body-medium`}>
                  None retained.
                </p>
              )}
            </Card>

            {photoSrcs.length > 0 && (
              <Card className={styles.section}>
                <h3
                  className={`${styles.sectionTitle} md-typescale-title-small`}
                >
                  Condition (pre-repair)
                </h3>
                <PhotoGrid photos={photoSrcs} onOpen={setViewerIndex} />
              </Card>
            )}

            <Card className={styles.section}>
              <h3 className={`${styles.sectionTitle} md-typescale-title-small`}>
                Financial summary
              </h3>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Quoted price</span>
                <span className={`${styles.detailValue} ${styles.mono}`}>
                  {naira(jobData.quotedPrice)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Total paid</span>
                <span className={`${styles.detailValue} ${styles.mono}`}>
                  {naira(totalPaid)}
                </span>
              </div>
              <div className={styles.outstanding}>
                <span className="md-typescale-body-large">
                  Outstanding balance
                </span>
                <span
                  className={`${styles.outstandingAmount} md-typescale-title-medium`}
                >
                  {naira(outstandingBalance)}
                </span>
              </div>
            </Card>

            {timelineEvents.length > 0 && (
              <Card className={styles.section}>
                <h3
                  className={`${styles.sectionTitle} md-typescale-title-small`}
                >
                  Tracking history
                </h3>
                <Timeline events={timelineEvents} />
              </Card>
            )}
          </>
        )}
      </div>

      {isPinOpen && (
        <PinPad
          onProcess={handlePinSuccess}
          onClose={() => setIsPinOpen(false)}
          title="Authorize agreement"
        />
      )}

      {isSuccessOpen && (
        <SuccessSheet
          title="Agreement locked"
          message="Your repair agreement has been securely locked."
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

export default CustomerJob;
