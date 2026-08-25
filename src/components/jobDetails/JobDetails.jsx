import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TopAppBar,
  IconButton,
  Card,
  StatusChip,
  Button,
  Icon,
  Timeline,
  PhotoGrid,
  PhotoViewer,
  TextField,
  Skeleton,
  ErrorState,
} from "../../ui";
import ConfirmTransfer from "../confirmTransfer/ConfirmTransfer";
import ConfirmCancel from "../confirmCancel/ConfirmCancel";
import ProcessCollection from "../processCollection/ProcessCollection";
import RaiseQuote from "../raiseQuote/RaiseQuote";
import PinPad from "../pinPad/PinPad";
import SuccessSheet from "../successSheet/SuccessSheet";
import ForgotPinSheet from "../forgotPinSheet/ForgotPinSheet";
import {
  getJobsById,
  updateJobStatus,
  addPayment,
  requoteJob,
  acceptTransfer,
  checkCustomer,
  cancelJob,
} from "../../services/api";
import useToast from "../../hooks/useToast";
import styles from "./JobDetails.module.css";

const naira = (value) => `₦${(Number(value) || 0).toLocaleString()}`;

const JobDetails = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { showToast } = useToast();

  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Pending Confirmation");
  const [payments, setPayments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [viewerIndex, setViewerIndex] = useState(-1);
  const [reloadKey, setReloadKey] = useState(0);
  const [prevJobId, setPrevJobId] = useState(jobId);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isRequoteOpen, setIsRequoteOpen] = useState(false);
  const [isRequotePinOpen, setIsRequotePinOpen] = useState(false);
  const [isAcceptPinOpen, setIsAcceptPinOpen] = useState(false);
  const [isCancelPinOpen, setIsCancelPinOpen] = useState(false);
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false);

  const [isExist, setIsExist] = useState(false);
  const [newQuoteData, setNewQuoteData] = useState({
    price: "",
    validity: "7",
  });

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [successSheet, setSuccessSheet] = useState({
    open: false,
    title: "",
    message: "",
  });

  if (jobId !== prevJobId) {
    setPrevJobId(jobId);
    setIsLoading(true);
    setError(null);
  }

  useEffect(() => {
    let active = true;
    getJobsById(jobId)
      .then((data) => {
        if (!active) return;
        setJobData(data);
        if (
          new Date(data.expiresAt) < new Date() &&
          data.status !== "Completed" &&
          data.status !== "Transferred" &&
          data.status !== "Cancelled"
        ) {
          setStatus("Expired");
        } else {
          setStatus(data.status);
        }
        setPayments(data.payments?.map((p) => p.amount) || []);
        const formattedTimeline = (data.events || []).map((e) => ({
          time: new Date(e.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: e.eventText,
        }));
        setTimeline(formattedTimeline);
      })
      .catch(() => {
        if (!active) return;
        setError("Failed to load job details.");
        showToast("Could not fetch job details.", "error");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [jobId, showToast, reloadKey]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <TopAppBar
          title="Loading…"
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
          <Skeleton width="60%" height="28px" radius="8px" />
          <Skeleton width="100%" height="220px" radius="24px" />
          <Skeleton width="100%" height="140px" radius="24px" />
          <Skeleton width="100%" height="180px" radius="24px" />
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className={styles.page}>
        <TopAppBar
          title="Job details"
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
          <ErrorState
            message={error || "This job could not be found."}
            onRetry={() => {
              setError(null);
              setIsLoading(true);
              setReloadKey((k) => k + 1);
            }}
          />
        </div>
      </div>
    );
  }

  const totalPaid = (payments || []).reduce(
    (sum, amount) => sum + (Number(amount) || 0),
    0,
  );
  const outstandingBalance = (Number(jobData?.quotedPrice) || 0) - totalPaid;
  const isExpired = status === "Expired";
  const isTransferred = status === "Transferred";
  const isCancelled = status === "Cancelled";

  const photoSrcs = (jobData.photos || []).map((p) =>
    typeof p === "string" ? p : p.url || p.src || "",
  );
  const accessories = jobData.accessoriesRetained || [];

  const handleAdvanceStatus = async () => {
    let newStatus = "";
    let eventText = "";
    let icon = "check_circle";

    if (status === "Pending Confirmation") {
      newStatus = "In Progress";
      eventText = "Status updated to In Progress";
      icon = "build";
    } else if (status === "In Progress") {
      newStatus = "Ready for Pickup";
      eventText = "Marked as Ready for Pickup";
      icon = "inventory_2";
    } else if (status === "Ready for Pickup") {
      setIsCollectionOpen(true);
      return;
    }

    setIsUpdatingStatus(true);
    await updateJobStatus(jobId, newStatus)
      .then(() => {
        setStatus(newStatus);
        setTimeline((prev) => [
          ...prev,
          { time: "Just now", text: eventText, icon },
        ]);
        setSuccessSheet({
          open: true,
          title: "Status Updated",
          message: `Job status successfully updated to ${newStatus}.`,
        });
      })
      .catch(() => {
        showToast("Failed to update status.", "error");
      })
      .finally(() => {
        setIsUpdatingStatus(false);
      });
  };

  const getButtonLabel = () => {
    if (status === "Pending Confirmation") return "Start Repair";
    if (status === "In Progress") return "Ready for Pickup";
    if (status === "Ready for Pickup") return "Process Collection";
    return "Job Completed";
  };

  const getButtonIcon = () => {
    if (status === "Pending Confirmation") return "play_arrow";
    if (status === "In Progress") return "inventory_2";
    if (status === "Ready for Pickup") return "point_of_sale";
    return "task_alt";
  };

  const handleLogPayment = async (e) => {
    e.preventDefault();
    const amount = parseFloat(newPaymentAmount);
    if (amount > 0) {
      setIsSavingPayment(true);
      await addPayment(jobId, amount)
        .then(() => {
          setPayments((prev) => [...prev, amount]);
          setTimeline((prev) => [
            ...prev,
            {
              time: "Just now",
              text: `Payment of ₦${amount.toLocaleString()} logged`,
              icon: "payments",
            },
          ]);
          setNewPaymentAmount("");
          setShowPaymentInput(false);
          setSuccessSheet({
            open: true,
            title: "Payment Logged",
            message: "The payment has been successfully recorded.",
          });
        })
        .catch(() => {
          showToast("Failed to log payment.", "error");
        })
        .finally(() => {
          setIsSavingPayment(false);
        });
    }
  };

  const handleAcceptPinSuccess = async (pin) => {
    return await acceptTransfer(jobData.id, pin)
      .then(() => {
        setIsAcceptPinOpen(false);
        setJobData((prev) => ({ ...prev, transferStatus: "None" }));
        setTimeline((prev) => [
          ...prev,
          {
            time: "Just now",
            text: "Transfer Accepted. Device is currently with the specialist.",
            icon: "swap_horiz",
          },
        ]);
        setSuccessSheet({
          open: true,
          title: "Transfer Accepted",
          message: "Device is currently with the specialist.",
        });
      })
      .catch((err) => {
        throw new Error(err.message || "Failed to accept transfer");
      });
  };

  const handleCollectionSuccess = (pin, finalPayment) => {
    if (finalPayment > 0) setPayments((prev) => [...prev, finalPayment]);
    setIsCollectionOpen(false);
    setStatus("Completed");
    setTimeline((prev) => [
      ...prev,
      {
        time: "Just now",
        text: "Job Closed. Device collected. Customer PIN verified.",
        icon: "task_alt",
      },
    ]);
    setSuccessSheet({
      open: true,
      title: "Job Completed",
      message: "Device collected and job closed successfully.",
    });
  };

  const handleAcceptTransfer = async () => {
    await checkCustomer(jobData.shop.phone)
      .then((res) => {
        setIsExist(res.exists);
        setIsSheetOpen(false);
        setIsAcceptPinOpen(true);
      })
      .catch((err) => {
        showToast(err.message || "Failed to check customer", "error");
      });
  };

  const handleDeclineTransfer = () => {
    setIsSheetOpen(false);
    setTimeline((prev) => [
      ...prev,
      {
        time: "Just now",
        text: "Transfer Declined. Negotiation required.",
        icon: "block",
      },
    ]);
    setSuccessSheet({
      open: true,
      title: "Transfer Declined",
      message: "The transfer request has been declined.",
    });
  };

  const handleRequoteSubmit = (price, validity) => {
    setNewQuoteData({ price, validity });
    setIsRequoteOpen(false);
    setIsRequotePinOpen(true);
  };

  const handleRequotePinSuccess = async (pin) => {
    return await requoteJob(
      jobData.id,
      pin,
      Number(newQuoteData.price),
      Number(newQuoteData.validity),
    )
      .then((updatedJob) => {
        setIsRequotePinOpen(false);
        setJobData(updatedJob);
        setStatus(updatedJob.status);
        setTimeline((prev) => [
          ...prev,
          {
            time: "Just now",
            text: `New quote raised (₦${Number(
              newQuoteData.price,
            ).toLocaleString()}) and authorized by customer.`,
            icon: "request_quote",
          },
        ]);
        setSuccessSheet({
          open: true,
          title: "Quote Updated",
          message: "Customer authorized the new price. Job is now active.",
        });
      })
      .catch((err) => {
        showToast(err.message || "Failed to requote job", "error");
        throw new Error(err.message || "Failed to requote job");
      });
  };

  const handleCancelClick = () => {
    setIsConfirmCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsConfirmCancelOpen(false);
    if (jobData.customerConfirmed) {
      setIsCancelPinOpen(true);
    } else {
      executeCancel(null);
    }
  };

  const executeCancel = async (pin) => {
    setIsCancelling(true);
    return await cancelJob(jobData.id, pin)
      .then(() => {
        setIsCancelPinOpen(false);
        setStatus("Cancelled");
        setTimeline((prev) => [
          ...prev,
          {
            time: "Just now",
            text: jobData.customerConfirmed
              ? "Job Cancelled. Customer PIN verified."
              : "Job Cancelled by Engineer (Pre-confirmation).",
            icon: "cancel",
          },
        ]);
        setSuccessSheet({
          open: true,
          title: "Job Cancelled",
          message:
            "The job has been successfully cancelled and moved to history.",
        });
      })
      .catch((err) => {
        showToast(err.message || "Failed to cancel job", "error");
        throw new Error(err.message || "Failed to cancel job");
      })
      .finally(() => {
        setIsCancelling(false);
      });
  };

  const errorButtonStyle = {
    "--md-text-button-label-text-color": "var(--md-sys-color-error)",
    "--md-text-button-icon-color": "var(--md-sys-color-error)",
  };

  const renderActions = () => {
    if (jobData.transferStatus === "pending_acceptance") {
      return (
        <Button
          variant="filled"
          full
          icon="how_to_reg"
          onClick={() => setIsSheetOpen(true)}
        >
          Accept Transfer
        </Button>
      );
    }
    if (isTransferred || jobData.childJob) {
      return (
        <Button
          variant="filled"
          full
          icon="engineering"
          onClick={() => navigate(`/app/job/${jobData.childJob?.id}`)}
        >
          View Specialist's Job
        </Button>
      );
    }
    if (isExpired) {
      return (
        <Button
          variant="filled"
          full
          icon="request_quote"
          onClick={() => setIsRequoteOpen(true)}
        >
          Raise New Quote
        </Button>
      );
    }
    if (isCancelled) {
      return (
        <Button variant="tonal" full icon="block" disabled>
          Job Cancelled
        </Button>
      );
    }
    return (
      <>
        <Button
          variant="filled"
          full
          icon={status === "Completed" ? undefined : getButtonIcon()}
          onClick={handleAdvanceStatus}
          disabled={status === "Completed" || isUpdatingStatus}
        >
          {isUpdatingStatus ? "Updating…" : getButtonLabel()}
        </Button>
        {status === "Pending Confirmation" && !jobData.customerConfirmed && (
          <Button
            variant="outlined"
            full
            icon="edit"
            onClick={() =>
              navigate("/app/intake", { state: { editJobData: jobData } })
            }
          >
            Edit Details
          </Button>
        )}
        {status !== "Completed" && (
          <Button
            variant="text"
            full
            icon="cancel"
            onClick={handleCancelClick}
            disabled={isCancelling}
            style={errorButtonStyle}
          >
            {isCancelling ? "Cancelling…" : "Cancel Job"}
          </Button>
        )}
      </>
    );
  };

  return (
    <div className={styles.page}>
      <TopAppBar
        title={jobData.deviceModel}
        subtitle={`#${jobData.id}`}
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
        <div className={styles.statusRow}>
          <StatusChip status={status} />
          <span
            className={`${styles.confirmChip} ${
              jobData.customerConfirmed ? styles.confirmed : ""
            } md-typescale-label-large`}
          >
            <Icon
              name={
                jobData.customerConfirmed ? "verified_user" : "hourglass_top"
              }
              size={16}
            />
            {jobData.customerConfirmed
              ? "Customer confirmed"
              : "Awaiting confirmation"}
          </span>
        </div>

        <Card variant="elevated" className={styles.section}>
          <p className={`${styles.sectionTitle} md-typescale-title-small`}>
            Agreement details
          </p>

          <div className={styles.detailRow}>
            <span className={`${styles.detailLabel} md-typescale-body-medium`}>
              Customer
            </span>
            <span className={`${styles.detailValue} md-typescale-body-medium`}>
              {jobData.customer?.name}
            </span>
          </div>

          <div className={styles.contactRow}>
            <a
              className={styles.contactBtn}
              href={`tel:${jobData.customer?.phone}`}
            >
              <Icon name="call" size={18} />
              Call
            </a>
            <a
              className={styles.contactBtn}
              href={`https://wa.me/234${jobData.customer?.phone?.slice(1)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="chat" size={18} />
              WhatsApp
            </a>
          </div>

          <div className={styles.detailRow}>
            <span className={`${styles.detailLabel} md-typescale-body-medium`}>
              Quoted price
            </span>
            <span
              className={`${styles.detailValue} ${styles.mono} md-typescale-body-medium`}
            >
              {naira(jobData.quotedPrice)}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={`${styles.detailLabel} md-typescale-body-medium`}>
              Total paid
            </span>
            <span
              className={`${styles.detailValue} ${styles.mono} md-typescale-body-medium`}
            >
              {naira(totalPaid)}
            </span>
          </div>

          <div className={styles.outstanding}>
            <span className="md-typescale-title-small">
              Outstanding balance
            </span>
            <span
              className={`${styles.outstandingAmount} md-typescale-title-medium`}
            >
              {naira(outstandingBalance)}
            </span>
          </div>

          <div
            className={`${styles.validity} ${isExpired ? styles.expired : ""}`}
          >
            <Icon
              name={isExpired ? "timer_off" : "event_available"}
              size={16}
            />
            <span className="md-typescale-body-small">
              {isExpired
                ? "This quote has expired — raise a new quote."
                : `Quote valid for ${jobData.quoteValidityDays} days.`}
            </span>
          </div>

          {!isTransferred &&
            !isCancelled &&
            outstandingBalance > 0 &&
            (showPaymentInput ? (
              <form className={styles.payForm} onSubmit={handleLogPayment}>
                <TextField
                  className={styles.payField}
                  label="Payment amount"
                  type="number"
                  inputmode="numeric"
                  prefixText="₦ "
                  value={newPaymentAmount}
                  onChange={(e) => setNewPaymentAmount(e.target.value)}
                  required
                  disabled={isSavingPayment}
                />
                <div className={styles.payActions}>
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => setShowPaymentInput(false)}
                    disabled={isSavingPayment}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="filled"
                    icon="add"
                    disabled={isSavingPayment}
                  >
                    {isSavingPayment ? "Saving…" : "Add"}
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="tonal"
                icon="add"
                onClick={() => setShowPaymentInput(true)}
                style={{ marginTop: "6px" }}
              >
                Log new payment
              </Button>
            ))}
        </Card>

        <Card variant="elevated" className={styles.section}>
          <p className={`${styles.sectionTitle} md-typescale-title-small`}>
            Diagnosis & parts
          </p>
          <p className={`${styles.subLabel} md-typescale-label-large`}>
            Reported fault
          </p>
          <p className={`${styles.fault} md-typescale-body-medium`}>
            {jobData.faultDescription}
          </p>
          {accessories.length > 0 && (
            <>
              <p
                className={`${styles.subLabel} ${styles.subLabelTop} md-typescale-label-large`}
              >
                Accessories retained
              </p>
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
            </>
          )}
        </Card>

        {photoSrcs.length > 0 && (
          <Card variant="elevated" className={styles.section}>
            <p className={`${styles.sectionTitle} md-typescale-title-small`}>
              Condition photos
            </p>
            <PhotoGrid photos={photoSrcs} onOpen={(i) => setViewerIndex(i)} />
          </Card>
        )}

        <Card variant="elevated" className={styles.section}>
          <p className={`${styles.sectionTitle} md-typescale-title-small`}>
            Job history
          </p>
          <Timeline events={timeline} />
        </Card>

        {jobData.isReturn && jobData.parentJobId && (
          <Card variant="elevated" className={styles.section}>
            <p className={`${styles.sectionTitle} md-typescale-title-small`}>
              Linked history
            </p>
            <Button
              variant="outlined"
              full
              icon="undo"
              onClick={() => navigate(`/app/job/${jobData.parentJobId}`)}
            >
              View Original Repair
            </Button>
          </Card>
        )}

        <div className={styles.actions}>{renderActions()}</div>
      </div>

      {isSheetOpen && (
        <ConfirmTransfer
          onAccept={handleAcceptTransfer}
          onDecline={handleDeclineTransfer}
          title="Accept Device Transfer?"
          fromName={jobData.shop?.engineerName || jobData.shop?.shopName}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
      {isConfirmCancelOpen && (
        <ConfirmCancel
          onConfirm={handleConfirmCancel}
          onClose={() => setIsConfirmCancelOpen(false)}
        />
      )}
      {isCollectionOpen && (
        <ProcessCollection
          onClose={() => setIsCollectionOpen(false)}
          onSuccess={handleCollectionSuccess}
          jobDetails={jobData}
          outstandingBalance={outstandingBalance}
        />
      )}
      {isRequoteOpen && (
        <RaiseQuote
          onClose={() => setIsRequoteOpen(false)}
          onSubmit={handleRequoteSubmit}
          currentPrice={jobData.quotedPrice}
        />
      )}

      {isRequotePinOpen && (
        <PinPad
          onProcess={handleRequotePinSuccess}
          onClose={() => setIsRequotePinOpen(false)}
          title="Authorize New Quote"
          onForgotPin={() => setIsForgotPinOpen(true)}
        />
      )}
      {isAcceptPinOpen && (
        <PinPad
          onClose={() => setIsAcceptPinOpen(false)}
          onProcess={handleAcceptPinSuccess}
          title="Authorize Transfer"
          isNewUser={!isExist}
          onForgotPin={() => setIsForgotPinOpen(true)}
        />
      )}
      {isCancelPinOpen && (
        <PinPad
          onClose={() => setIsCancelPinOpen(false)}
          onProcess={executeCancel}
          title="Authorize Cancellation"
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
          initialPhone={jobData.customer?.phone || jobData.shop?.phone}
        />
      )}

      {successSheet.open && (
        <SuccessSheet
          title={successSheet.title}
          message={successSheet.message}
          onClose={() =>
            setSuccessSheet({ open: false, title: "", message: "" })
          }
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

export default JobDetails;
