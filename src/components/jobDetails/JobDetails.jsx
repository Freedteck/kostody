import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./JobDetails.module.css";
import ConfirmTransfer from "../confirmTransfer/ConfirmTransfer";
import ConfirmCancel from "../confirmCancel/ConfirmCancel";
import ProcessCollection from "../processCollection/ProcessCollection";
import RaiseQuote from "../raiseQuote/RaiseQuote";
import PinPad from "../pinPad/PinPad";
import SuccessSheet from "../successSheet/SuccessSheet";
import ForgotPinSheet from "../forgotPinSheet/ForgotPinSheet"; // Import ForgotPinSheet
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
import { Skeleton } from "../skeleton/Skeleton";
import ErrorState from "../errorState/ErrorState";

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

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isRequoteOpen, setIsRequoteOpen] = useState(false);
  const [isRequotePinOpen, setIsRequotePinOpen] = useState(false);
  const [isAcceptPinOpen, setIsAcceptPinOpen] = useState(false);
  const [isCancelPinOpen, setIsCancelPinOpen] = useState(false);
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false); // Add state for Forgot PIN

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

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      setError(null);
      await getJobsById(jobId)
        .then((data) => {
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
            event: e.eventText,
          }));
          setTimeline(formattedTimeline);
        })
        .catch(() => {
          setError("Failed to load job details.");
          showToast("Could not fetch job details.", "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchJobDetails();
  }, [jobId, showToast]);

  if (isLoading) {
    return (
      <div className={styles.detailsContainer}>
        <div className={styles.detailsHeader}>
          <Skeleton width="24px" height="24px" radius="4px" />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height="1.4rem" radius="4px" />
            <div style={{ height: "4px" }}></div>
            <Skeleton width="40%" height="0.85rem" radius="4px" />
          </div>
        </div>
        <div style={{ height: "16px" }}></div>
        <Skeleton width="100%" height="50px" radius="12px" />
        <div style={{ height: "16px" }}></div>
        <Skeleton width="100%" height="200px" radius="12px" />
        <div style={{ height: "16px" }}></div>
        <Skeleton width="100%" height="150px" radius="12px" />
        <div style={{ height: "16px" }}></div>
        <Skeleton width="100%" height="100px" radius="12px" />
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className={styles.detailsContainer}>
        <ErrorState message={error} />
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

  const handleAdvanceStatus = async () => {
    let newStatus = "";
    let eventText = "";

    if (status === "Pending Confirmation") {
      newStatus = "In Progress";
      eventText = "Status updated to In Progress";
    } else if (status === "In Progress") {
      newStatus = "Ready for Pickup";
      eventText = "Marked as Ready for Pickup";
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
          { time: "Just now", event: eventText },
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
              event: `Payment of ₦${amount.toLocaleString()} logged`,
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
            event:
              "Transfer Accepted. Device is currently with the specialist.",
          },
        ]);
        setSuccessSheet({
          open: true,
          title: "Transfer Accepted",
          message: "Device is currently with the specialist.",
        });
      })
      .catch((error) => {
        throw new Error(error.message || "Failed to accept transfer");
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
        event: `Job Closed. Device collected. Customer PIN verified.`,
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
      { time: "Just now", event: "Transfer Declined. Negotiation required." },
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
            event: `New quote raised (₦${Number(newQuoteData.price).toLocaleString()}) and authorized by customer.`,
          },
        ]);
        setSuccessSheet({
          open: true,
          title: "Quote Updated",
          message: "Customer authorized the new price. Job is now active.",
        });
      })
      .catch((error) => {
        showToast(error.message || "Failed to requote job", "error");
        throw new Error(error.message || "Failed to requote job");
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
            event: jobData.customerConfirmed
              ? "Job Cancelled. Customer PIN verified."
              : "Job Cancelled by Engineer (Pre-confirmation).",
          },
        ]);
        setSuccessSheet({
          open: true,
          title: "Job Cancelled",
          message:
            "The job has been successfully cancelled and moved to history.",
        });
      })
      .catch((error) => {
        showToast(error.message || "Failed to cancel job", "error");
        throw new Error(error.message || "Failed to cancel job");
      })
      .finally(() => {
        setIsCancelling(false);
      });
  };

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsHeader}>
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
        <div className={styles.headerInfo}>
          <h1>{jobData.deviceModel}</h1>
          <p>
            #{jobData.id} · {status}
          </p>
        </div>
      </div>

      <div className={styles.toggleRow}>
        <span className={styles.toggleLabel}>Customer Confirmation</span>
        <div
          className={`${styles.toggleSwitch} ${jobData.customerConfirmed ? styles.on : ""}`}
        >
          <div className={styles.toggleHandle}></div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Agreement Details</h2>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Customer</span>
          <span className={styles.detailValue}>{jobData.customer?.name}</span>
        </div>

        <div className={styles.contactRow}>
          <a
            href={`tel:${jobData.customer?.phone}`}
            className={styles.contactBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.7 21 1 12.3 1 1.08C1 0.48 1.48 0 2.08 0H5.08C5.68 0 6.16 0.48 6.16 1.08C6.16 2.68 6.36 4.24 6.76 5.74C6.88 6.22 6.74 6.74 6.38 7.1L4.6 8.88C6.06 11.7 8.3 13.94 11.12 15.4L12.9 13.62C13.26 13.26 13.78 13.12 14.26 13.24C15.76 13.64 17.32 13.84 18.92 13.84C19.52 13.84 20 14.32 20 14.92V16.92Z"
                transform="translate(1 1)"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Call
          </a>
          <a
            href={`https://wa.me/234${jobData.customer?.phone?.slice(1)}`}
            target="_blank"
            rel="noreferrer"
            className={styles.contactBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 11.5C21 16.7467 16.7467 21 11.5 21C9.88149 21 8.35519 20.6039 7.01829 19.9041L3 21L4.0959 16.9817C3.39613 15.6448 3 14.1185 3 12.5C3 7.25329 7.25329 3 12.5 3C17.7467 3 22 7.25329 22 12.5L21 11.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            WhatsApp
          </a>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Quoted Price</span>
          <span className={`${styles.detailValue} ${styles.detailValueMono}`}>
            ₦{(jobData.quotedPrice || 0).toLocaleString()}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Total Paid</span>
          <span className={`${styles.detailValue} ${styles.detailValueMono}`}>
            ₦{(totalPaid || 0).toLocaleString()}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span
            className={styles.detailLabel}
            style={{ color: "var(--accent)" }}
          >
            Outstanding Balance
          </span>
          <span
            className={`${styles.detailValue} ${styles.detailValueMono}`}
            style={{ color: "var(--accent)" }}
          >
            ₦{(outstandingBalance || 0).toLocaleString()}
          </span>
        </div>

        <div className={styles.detailRow}>
          <span
            className={`${styles.detailLabel} ${isExpired ? styles.expiredText : ""}`}
          >
            Quote Validity
            <span className={styles.infoIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 8H12.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M11 12H12V16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={styles.tooltip}>
                {isExpired
                  ? "This quote has expired. Please raise a new quote."
                  : "The quoted price is valid for this period."}
              </span>
            </span>
          </span>
          <span
            className={`${styles.detailValue} ${isExpired ? styles.expiredText : ""}`}
          >
            {jobData.quoteValidityDays} Days
          </span>
        </div>

        {!showPaymentInput ? (
          !isTransferred &&
          !isCancelled &&
          outstandingBalance > 0 && (
            <button
              className={styles.logPaymentBtn}
              onClick={() => setShowPaymentInput(true)}
            >
              + Log New Payment
            </button>
          )
        ) : (
          <form className={styles.logPaymentInline} onSubmit={handleLogPayment}>
            <input
              type="number"
              className={styles.logPaymentInput}
              placeholder="Enter amount"
              value={newPaymentAmount}
              onChange={(e) => setNewPaymentAmount(e.target.value)}
              autoFocus
              required
              disabled={isSavingPayment}
            />
            <button
              type="submit"
              className={styles.logPaymentSubmit}
              disabled={isSavingPayment}
            >
              {isSavingPayment ? (
                <span className={styles.spinner}></span>
              ) : (
                "Add"
              )}
            </button>
            <button
              type="button"
              className={styles.cancelPaymentBtn}
              onClick={() => setShowPaymentInput(false)}
              disabled={isSavingPayment}
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Diagnosis & Parts</h2>
        <div className={styles.detailRow} style={{ alignItems: "flex-start" }}>
          <span className={styles.detailLabel}>Accessories</span>
          <div className={styles.pillContainer}>
            {jobData.accessoriesRetained?.map((item, index) => (
              <span key={index} className={styles.pill}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <p className={styles.faultText}>{jobData.faultDescription}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Condition Photos</h2>
        <div className={styles.photoGrid}>
          {jobData.photos?.length > 0 ? (
            jobData.photos.map((photo, index) => (
              <div key={index} className={styles.photoPlaceholder}>
                <img
                  src={photo.url}
                  alt={`Condition ${index}`}
                  className={styles.photoImage}
                />
              </div>
            ))
          ) : (
            <div className={styles.photoPlaceholder}>No Image</div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Job History</h2>
        <div className={styles.timeline}>
          {timeline.map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              <p className={styles.timelineTime}>{item.time}</p>
              <p className={styles.timelineEvent}>{item.event}</p>
            </div>
          ))}
        </div>
      </div>

      {jobData.isReturn && jobData.parentJobId && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Linked History</h2>
          <button
            className={styles.linkedJobBtn}
            onClick={() => navigate(`/app/job/${jobData.parentJobId}`)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 14L4 9L9 4M4 9H15C18.866 9 22 12.134 22 16C22 19.866 18.866 23 15 23H12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View Original Repair
          </button>
        </div>
      )}

      <div className={styles.actionsContainer}>
        {jobData.transferStatus === "pending_acceptance" ? (
          <button
            className={`${styles.statusBtn} ${styles.statusBtnPrimary}`}
            onClick={() => setIsSheetOpen(true)}
          >
            Accept Transfer
          </button>
        ) : isTransferred || jobData.childJob ? (
          <button
            className={`${styles.statusBtn} ${styles.statusBtnPrimary}`}
            onClick={() => navigate(`/app/job/${jobData.childJob.id}`)}
          >
            View Specialist's Job
          </button>
        ) : isExpired ? (
          <button
            className={`${styles.statusBtn} ${styles.statusBtnPrimary}`}
            onClick={() => setIsRequoteOpen(true)}
          >
            Raise New Quote
          </button>
        ) : isCancelled ? (
          <button className={`${styles.statusBtn}`} disabled>
            Job Cancelled
          </button>
        ) : (
          <>
            <button
              className={`${styles.statusBtn} ${status !== "Completed" ? styles.statusBtnPrimary : ""}`}
              onClick={handleAdvanceStatus}
              disabled={status === "Completed" || isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <>
                  <span className={styles.spinner}></span> Updating...
                </>
              ) : (
                getButtonLabel()
              )}
            </button>
            {status === "Pending Confirmation" &&
              !jobData.customerConfirmed && (
                <button
                  className={styles.handoffBtn}
                  onClick={() =>
                    navigate("/app/intake", { state: { editJobData: jobData } })
                  }
                >
                  Edit Details
                </button>
              )}
            {status !== "Completed" && (
              <button
                className={styles.cancelJobBtn}
                onClick={handleCancelClick}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Cancel Job"}
              </button>
            )}
          </>
        )}
      </div>

      {isSheetOpen && (
        <ConfirmTransfer
          onAccept={handleAcceptTransfer}
          onDecline={handleDeclineTransfer}
          title="Accept Device Transfer?"
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

      {/* Updated PinPads with onForgotPin */}
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

      {/* Forgot PIN Sheet */}
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
    </div>
  );
};

export default JobDetails;
