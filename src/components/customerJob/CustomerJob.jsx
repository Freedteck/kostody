import { useState } from "react";
import styles from "./CustomerJob.module.css";
import PinPad from "../pinPad/PinPad";
import SuccessSheet from "../successSheet/SuccessSheet";

// Mock data - change 'status' to test different views
const mockJobData = {
  id: "KSD-9F3A",
  shopName: "TechFix Clinic",
  customerName: "Chidi O.",
  customerPhone: "08012345677", // Change to 08012345678 to test "Existing User"
  deviceModel: "iPhone 13 Pro",
  faultDescription: "Broken screen, touch still works but glass is shattered.",
  accessoriesRetained: "SIM Card, Phone Pouch",
  quotedPrice: 25000,
  upfrontPayment: 10000,
  quoteValidity: "7",
  photos: [null, null, null],
  status: "Pending Confirmation", // <--- CHANGE THIS: "In Progress", "Ready for Pickup", "Completed"
  specialistName: "Engr. Alaba (Board Level)",
  customerHistory: [
    {
      time: "Oct 24, 10:00 AM",
      event: "Device dropped off & agreement locked",
    },
    { time: "Oct 24, 11:30 AM", event: "Diagnosis confirmed. Repair started." },
    {
      time: "Oct 24, 03:00 PM",
      event: "Transferred to Specialist: Engr. Alaba",
    },
    {
      time: "Oct 25, 09:00 AM",
      event: "Device returned from specialist. Final testing.",
    },
  ],
};

const CustomerJob = () => {
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const isNewUser = mockJobData.customerPhone !== "08012345678";
  const outstandingBalance =
    mockJobData.quotedPrice - mockJobData.upfrontPayment;

  // Logic: Show summary only if pending and not just locked
  const showSummary =
    mockJobData.status === "Pending Confirmation" && !isLocked;

  const handlePinSuccess = (pin) => {
    console.log("Agreement locked with PIN:", pin);
    setIsPinOpen(false);
    setIsSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    setIsLocked(true); // Transitions page to tracking view
  };

  const renderStatusBanner = () => {
    switch (mockJobData.status) {
      case "In Progress":
        return (
          <div className={`${styles.statusBanner} ${styles.blue}`}>
            REPAIR IN PROGRESS
          </div>
        );
      case "Transferred":
        return (
          <div className={`${styles.statusBanner} ${styles.orange}`}>
            WITH SPECIALIST
          </div>
        );
      case "Ready for Pickup":
        return (
          <div className={`${styles.statusBanner} ${styles.green}`}>
            READY FOR PICKUP
          </div>
        );
      case "Completed":
        return (
          <div className={`${styles.statusBanner} ${styles.grey}`}>
            JOB COMPLETED
          </div>
        );
      default:
        return <div className={styles.statusBanner}>REPAIR AGREEMENT</div>;
    }
  };

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryHeader}>
        <h1>Repair Agreement</h1>
        <p className={styles.shopName}>{mockJobData.shopName}</p>
        {!showSummary && renderStatusBanner()}
      </div>

      <div className={styles.receiptPaper}>
        {showSummary ? (
          <>
            {/* --- SUMMARY VIEW (PENDING) --- */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Customer & Device</h2>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Customer</span>
                <span className={styles.detailValue}>
                  {mockJobData.customerName}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Device</span>
                <span className={styles.detailValue}>
                  {mockJobData.deviceModel}
                </span>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Diagnosis</h2>
              <p className={styles.faultText}>{mockJobData.faultDescription}</p>
              {mockJobData.accessoriesRetained && (
                <div
                  className={styles.detailRow}
                  style={{ marginTop: "15px", alignItems: "flex-start" }}
                >
                  <span className={styles.detailLabel}>Accessories</span>
                  <div className={styles.pillContainer}>
                    {mockJobData.accessoriesRetained
                      .split(",")
                      .map((item, index) => (
                        <span key={index} className={styles.pill}>
                          {item.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Condition Photos</h2>
              <div className={styles.photoGrid}>
                {mockJobData.photos.map((_, index) => (
                  <div key={index} className={styles.photoBox}>
                    No Image
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Financial Agreement</h2>
              <div className={styles.priceRow}>
                <span>Quoted Price:</span>
                <span className={styles.mono}>
                  ₦{mockJobData.quotedPrice.toLocaleString()}
                </span>
              </div>
              <div className={styles.priceRow}>
                <span>Upfront Paid:</span>
                <span className={styles.mono}>
                  ₦{mockJobData.upfrontPayment.toLocaleString()}
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
                  {mockJobData.quoteValidity} Days
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* --- TRACKING VIEW (IN PROGRESS / COMPLETED) --- */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Device & Diagnosis</h2>
              <p className={styles.deviceName}>{mockJobData.deviceModel}</p>
              <p className={styles.faultText}>{mockJobData.faultDescription}</p>
            </div>

            {mockJobData.status === "Transferred" && (
              <div className={`${styles.section} ${styles.highlightSection}`}>
                <h2 className={styles.sectionTitle}>Chain of Custody</h2>
                <p className={styles.deviceName}>
                  Currently with: {mockJobData.specialistName}
                </p>
                <p className={styles.faultText}>
                  Your device is safe and undergoing specialized repair.
                </p>
              </div>
            )}

            {mockJobData.status !== "Completed" && (
              <>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    Accessories Left in Shop
                  </h2>
                  <div className={styles.pillContainer}>
                    {mockJobData.accessoriesRetained
                      .split(",")
                      .map((item, index) => (
                        <span key={index} className={styles.pill}>
                          {item.trim()}
                        </span>
                      ))}
                  </div>
                </div>

                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    Device Condition (Pre-Repair)
                  </h2>
                  <div className={styles.photoGrid}>
                    {mockJobData.photos.map((_, index) => (
                      <div key={index} className={styles.photoBox}>
                        No Image
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Financial Agreement</h2>
              <div className={styles.priceRow}>
                <span>Quoted Price:</span>
                <span className={styles.mono}>
                  ₦{mockJobData.quotedPrice.toLocaleString()}
                </span>
              </div>
              <div className={styles.priceRow}>
                <span>Upfront Paid:</span>
                <span className={styles.mono}>
                  ₦{mockJobData.upfrontPayment.toLocaleString()}
                </span>
              </div>
              <div className={`${styles.priceRow} ${styles.outstanding}`}>
                <span>Outstanding Balance:</span>
                <span className={styles.mono}>
                  ₦{outstandingBalance.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Job Tracking History</h2>
              <div className={styles.timeline}>
                {mockJobData.customerHistory.map((item, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <p className={styles.timelineTime}>{item.time}</p>
                    <p className={styles.timelineEvent}>{item.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Area */}
      <div className={styles.actionArea}>
        {showSummary && (
          <>
            <p className={styles.disclaimer}>
              By authorizing this, you confirm the device condition, fault
              description, and quoted price above. This record cannot be
              altered.
            </p>
            <button
              className={styles.lockBtn}
              onClick={() => setIsPinOpen(true)}
            >
              Lock Agreement
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      {isPinOpen && (
        <PinPad
          onSuccess={handlePinSuccess}
          onClose={() => setIsPinOpen(false)}
          title="Authorize Agreement"
          isNewUser={isNewUser}
        />
      )}

      {isSuccessOpen && (
        <SuccessSheet
          title="Agreement Locked"
          message="Your repair agreement has been successfully locked."
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default CustomerJob;
