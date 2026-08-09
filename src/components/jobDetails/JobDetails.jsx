import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./JobDetails.module.css";
import ConfirmTransfer from "../confirmTransfer/ConfirmTransfer";
import ProcessCollection from "../processCollection/ProcessCollection";
import RaiseQuote from "../raiseQuote/RaiseQuote";
import PinPad from "../pinPad/PinPad";
import SuccessSheet from "../successSheet/SuccessSheet";

const mockJobData = {
  id: "KSD-9F3A",
  device: "iPhone 13 Pro",
  customerName: "Chidi O.",
  customerPhone: "08012345678",
  fault:
    "Broken screen, customer says touch still works but glass is shattered. Needs screen replacement.",
  accessories: ["SIM Card", "Battery", "Phone Pouch"],
  quotedPrice: 25000,
  upfrontPayment: 10000,
  quoteValidity: "7 Days",
  customerConfirmed: true,
  photos: [null, null, null],
  transferStatus: "none", // Changed to none so you can test the Expired flow from (pending_acceptance, in_progress, ready_for_pickup, completed)
};

const initialTimeline = [
  { time: "Oct 24, 10:00 AM", event: "Job Created by Engineer" },
  { time: "Oct 24, 10:15 AM", event: "Customer Confirmed Agreement" },
  { time: "Oct 24, 10:16 AM", event: "Upfront Payment of ₦10,000 logged" },
  {
    time: "Oct 24, 12:00 PM",
    event: "Transfer Request received from Engr. Alaba",
  },
  { time: "Nov 02, 09:00 AM", event: "Quote Validity Expired" },
];

const JobDetails = () => {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(mockJobData);
  const [status, setStatus] = useState("Expired"); // Set to Expired to test
  const [payments, setPayments] = useState([mockJobData.upfrontPayment]);
  const [timeline, setTimeline] = useState(initialTimeline);
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
    if (status === "Pending Confirmation")
      return "Start Repair (Move to In Progress)";
    if (status === "In Progress") return "Mark as Ready for Pickup";
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
    }
  };

  const handleCollectionSuccess = (pin, finalPayment) => {
    if (finalPayment > 0) {
      setPayments((prev) => [...prev, finalPayment]);
    }
    setIsCollectionOpen(false);
    setStatus("Completed");
    setTimeline((prev) => [
      ...prev,
      {
        time: "Just now",
        event: `Job Closed. Device collected. Customer PIN verified.`,
      },
    ]);
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
      quoteValidity: `${newQuoteData.validity} Days`,
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

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
  };

  return (
    <div className={styles.detailsContainer}>
      {/* Header */}
      <div className={styles.detailsHeader}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ←
        </button>
        <div className={styles.headerInfo}>
          <h1>{jobData.device}</h1>
          <p>
            #{jobData.id} · {status}
          </p>
        </div>
      </div>

      {/* Customer Confirmation Status */}
      <div className={styles.toggleRow}>
        <span className={styles.toggleLabel}>Customer Confirmation</span>
        <div
          className={`${styles.toggleSwitch} ${jobData.customerConfirmed ? styles.on : ""}`}
        >
          <div className={styles.toggleHandle}></div>
        </div>
      </div>

      {/* Customer & Financials */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Agreement Details</h2>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Customer</span>
          <span className={styles.detailValue}>{jobData.customerName}</span>
        </div>
        <div className={styles.contactRow} style={{ marginBottom: "15px" }}>
          <a
            href={`tel:${jobData.customerPhone}`}
            className={styles.contactBtn}
          >
            📞 Call
          </a>
          <a
            href={`https://wa.me/234${jobData.customerPhone.slice(1)}`}
            target="_blank"
            rel="noreferrer"
            className={styles.contactBtn}
          >
            💬 WhatsApp
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

        {/* Quote Validity with Tooltip */}
        <div className={styles.detailRow}>
          <span
            className={`${styles.detailLabel} ${isExpired ? styles.expiredText : ""}`}
          >
            Quote Validity
            <span className={styles.infoIcon}>
              ⓘ
              <span className={styles.tooltip}>
                {isExpired
                  ? "This quote has expired. Please raise a new quote for customer approval."
                  : "The quoted price is valid for this period."}
              </span>
            </span>
          </span>
          <span
            className={`${styles.detailValue} ${isExpired ? styles.expiredText : ""}`}
          >
            {jobData.quoteValidity}
          </span>
        </div>

        {/* Log New Payment UI */}
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

      {/* Diagnosis & Parts */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Diagnosis & Parts</h2>
        <div className={styles.detailRow} style={{ alignItems: "flex-start" }}>
          <span className={styles.detailLabel}>Accessories</span>
          <div className={styles.pillContainer}>
            {jobData.accessories.map((item, index) => (
              <span key={index} className={styles.pill}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <p className={styles.faultText}>{jobData.fault}</p>
      </div>

      {/* Condition Photos */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Condition Photos</h2>
        <div className={styles.photoGrid}>
          {jobData.photos.map((_, index) => (
            <div key={index} className={styles.photoPlaceholder}>
              No Image
            </div>
          ))}
        </div>
      </div>

      {/* Job Timeline */}
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

      {/* Actions */}
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
          <button
            className={`${styles.statusBtn} ${status !== "Completed" ? styles.statusBtnPrimary : ""}`}
            onClick={handleAdvanceStatus}
            disabled={status === "Completed"}
          >
            {getButtonLabel()}
          </button>
        )}
      </div>

      {/* Existing Sheets */}
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

      {/* New Re-quote Sheets */}
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
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default JobDetails;
