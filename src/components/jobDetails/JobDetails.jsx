import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./JobDetails.module.css";
import ConfirmTransfer from "../confirmTransfer/ConfirmTransfer";
import ProcessCollection from "../processCollection/ProcessCollection";
import RaiseQuote from "../raiseQuote/RaiseQuote";
import PinPad from "../pinPad/PinPad";
import SuccessSheet from "../successSheet/SuccessSheet";
import { getJobsById } from "../../services/api";
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
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isRequoteOpen, setIsRequoteOpen] = useState(false);
  const [isRequotePinOpen, setIsRequotePinOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [newQuoteData, setNewQuoteData] = useState({
    price: "",
    validity: "7",
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
            data.status !== "Completed"
          ) {
            setStatus("Expired");
          } else {
            setStatus(data.status);
          }

          setPayments(
            data.payments?.length > 0
              ? data.payments.map((p) => p.amount)
              : data.upfrontPayment > 0
                ? [data.upfrontPayment]
                : [],
          );

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
        .catch((err) => {
          console.error("Error:", err);
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
            <Skeleton width="40%" height="0.85rem" radius="4px" />
          </div>
        </div>
        <Skeleton
          width="100%"
          height="60px"
          radius="12px"
          style={{ marginBottom: "16px" }}
        />
        <Skeleton
          width="100%"
          height="200px"
          radius="12px"
          style={{ marginBottom: "16px" }}
        />
        <Skeleton width="100%" height="150px" radius="12px" />
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

  const totalPaid = payments.reduce((sum, amount) => sum + amount, 0);
  const outstandingBalance = jobData.quotedPrice - totalPaid;
  const isExpired = status === "Expired";

  const handleAdvanceStatus = () => {
    let newStatus = status;
    let newEvent = "";
    if (status === "Pending Confirmation") {
      newStatus = "In Progress";
      newEvent = "Status updated to In Progress";
    } else if (status === "In Progress") {
      newStatus = "Ready for Pickup";
      newEvent = "Marked as Ready for Pickup";
    } else if (status === "Ready for Pickup") {
      setIsCollectionOpen(true);
      return;
    }
    if (newEvent) {
      setStatus(newStatus);
      setTimeline((prev) => [...prev, { time: "Just now", event: newEvent }]);
    }
  };

  const getButtonLabel = () => {
    if (status === "Pending Confirmation") return "Start Repair";
    if (status === "In Progress") return "Ready for Pickup";
    if (status === "Ready for Pickup") return "Process Collection";
    return "Job Completed";
  };

  const handleLogPayment = (e) => {
    e.preventDefault();
    const amount = parseFloat(newPaymentAmount);
    if (amount > 0) {
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
      showToast("Payment logged successfully.", "success");
    }
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
    showToast("Job completed successfully!", "success");
  };

  const handleAcceptTransfer = () => {
    setIsSheetOpen(false);
    setStatus("In Progress");
    setTimeline((prev) => [
      ...prev,
      {
        time: "Just now",
        event: "Transfer Accepted. Device back in possession.",
      },
    ]);
  };

  const handleDeclineTransfer = () => {
    setIsSheetOpen(false);
    setTimeline((prev) => [
      ...prev,
      { time: "Just now", event: "Transfer Declined. Negotiation required." },
    ]);
  };

  const handleRequoteSubmit = (price, validity) => {
    setNewQuoteData({ price, validity });
    setIsRequoteOpen(false);
    setIsRequotePinOpen(true);
  };

  const handleRequotePinSuccess = () => {
    setIsRequotePinOpen(false);
    setJobData((prev) => ({
      ...prev,
      quotedPrice: Number(newQuoteData.price),
      quoteValidityDays: newQuoteData.validity,
    }));
    setStatus("Pending Confirmation");
    setTimeline((prev) => [
      ...prev,
      {
        time: "Just now",
        event: `New quote raised (₦${Number(newQuoteData.price).toLocaleString()}) and authorized by customer.`,
      },
    ]);
    setIsSuccessOpen(true);
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
            ₦{jobData.quotedPrice.toLocaleString()}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Total Paid</span>
          <span className={`${styles.detailValue} ${styles.detailValueMono}`}>
            ₦{totalPaid.toLocaleString()}
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
            ₦{outstandingBalance.toLocaleString()}
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
          <button
            className={styles.logPaymentBtn}
            onClick={() => setShowPaymentInput(true)}
          >
            + Log New Payment
          </button>
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
            />
            <button type="submit" className={styles.logPaymentSubmit}>
              Add
            </button>
            <button
              type="button"
              className={styles.cancelPaymentBtn}
              onClick={() => setShowPaymentInput(false)}
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

      <div className={styles.actionsContainer}>
        {jobData.transferStatus === "pending_acceptance" ? (
          <button
            className={`${styles.statusBtn} ${styles.statusBtnPrimary}`}
            onClick={() => setIsSheetOpen(true)}
          >
            Accept Transfer
          </button>
        ) : isExpired ? (
          <button
            className={`${styles.statusBtn} ${styles.statusBtnPrimary}`}
            onClick={() => setIsRequoteOpen(true)}
          >
            Raise New Quote
          </button>
        ) : (
          <>
            <button
              className={`${styles.statusBtn} ${status !== "Completed" ? styles.statusBtnPrimary : ""}`}
              onClick={handleAdvanceStatus}
              disabled={status === "Completed"}
            >
              {getButtonLabel()}
            </button>
            {status === "Pending Confirmation" && (
              <button
                className={styles.handoffBtn}
                onClick={() =>
                  navigate("/app/intake", { state: { editJobData: jobData } })
                }
              >
                Edit Details
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
          onSuccess={handleRequotePinSuccess}
          onClose={() => setIsRequotePinOpen(false)}
          title="Authorize New Quote"
        />
      )}
      {isSuccessOpen && (
        <SuccessSheet
          title="Quote Updated"
          message="Customer authorized the new price. Job is now active."
          onClose={() => setIsSuccessOpen(false)}
        />
      )}
    </div>
  );
};

export default JobDetails;
