import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./CustomerJob.module.css";
import PinPad from "../pinPad/PinPad";
import SuccessSheet from "../successSheet/SuccessSheet";
import { getJobsById, confirmJob } from "../../services/api";
import useToast from "../../hooks/useToast";
import { Skeleton } from "../skeleton/Skeleton";
import ErrorState from "../errorState/ErrorState";

const CustomerJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { showToast } = useToast();
  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      await getJobsById(jobId)
        .then((data) => {
          setJobData(data);
        })
        .catch(() => {
          setError("Failed to load job details.");
          showToast("Could not fetch job details.", "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchJob();
  }, [jobId, showToast]);

  const handlePinSuccess = async (pin) => {
    return await confirmJob(jobData.id, pin)
      .then(() => {
        setIsPinOpen(false);
        setIsSuccessOpen(true);
      })
      .catch((err) => {
        throw new Error(err.message || "Failed to confirm job");
      });
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    window.location.reload();
  };

  const renderStatusCard = (status) => {
    let text = "REPAIR AGREEMENT";
    let className = styles.statusDefault;

    if (status === "In Progress") {
      text = "REPAIR IN PROGRESS";
      className = styles.statusProgress;
    } else if (status === "Transferred") {
      text = "WITH SPECIALIST";
      className = styles.statusTransferred;
    } else if (status === "Ready for Pickup") {
      text = "READY FOR PICKUP";
      className = styles.statusReady;
    } else if (status === "Completed") {
      text = "JOB COMPLETED";
      className = styles.statusCompleted;
    } else if (status === "Cancelled") {
      text = "JOB CANCELLED";
      className = styles.statusCancelled;
    }

    return (
      <div className={`${styles.statusCard} ${className}`}>
        <p className={styles.statusText}>{text}</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.summaryContainer}>
        <div className={styles.summaryHeader}>
          <Skeleton width="24px" height="24px" radius="4px" />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height="1.4rem" radius="4px" />
            <div style={{ height: "4px" }}></div>
            <Skeleton width="40%" height="0.85rem" radius="4px" />
          </div>
        </div>
        <div style={{ height: "16px" }}></div>
        <Skeleton width="100%" height="150px" radius="12px" />
        <div style={{ height: "16px" }}></div>
        <Skeleton width="100%" height="200px" radius="12px" />
        <div style={{ height: "16px" }}></div>
        <Skeleton width="100%" height="100px" radius="12px" />
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className={styles.summaryContainer}>
        <ErrorState message={error} />
      </div>
    );
  }

  const showSummary =
    jobData.status === "Pending Confirmation" && !jobData.customerConfirmed;
  const totalPaid = (jobData.payments || []).reduce(
    (sum, p) => sum + p.amount,
    0,
  );
  const outstandingBalance = (jobData.quotedPrice || 0) - totalPaid;

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryHeader}>
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
          <h1>Repair Agreement</h1>
          <p className={styles.shopName}>{jobData.shop?.shopName}</p>
        </div>
      </div>

      {!showSummary && renderStatusCard(jobData.status)}

      <div className={styles.receiptPaper}>
        {showSummary ? (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Customer & Device</h2>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Customer</span>
                <span className={styles.detailValue}>
                  {jobData.customer?.name}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Device</span>
                <span className={styles.detailValue}>
                  {jobData.deviceModel}
                </span>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Diagnosis</h2>
              <p className={styles.faultText}>{jobData.faultDescription}</p>
              {jobData.accessoriesRetained &&
                jobData.accessoriesRetained.length > 0 && (
                  <div
                    className={styles.detailRow}
                    style={{ marginTop: "15px", alignItems: "flex-start" }}
                  >
                    <span className={styles.detailLabel}>Accessories</span>
                    <div className={styles.pillContainer}>
                      {jobData.accessoriesRetained.map((item, index) => (
                        <span key={index} className={styles.pill}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Condition Photos</h2>
              <div className={styles.photoGrid}>
                {jobData.photos && jobData.photos.length > 0 ? (
                  jobData.photos.map((photo, index) => (
                    <div key={index} className={styles.photoBox}>
                      <img
                        src={photo.url}
                        alt={`Condition ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className={styles.photoBox}>No Image</div>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Financial Agreement</h2>
              <div className={styles.priceRow}>
                <span>Quoted Price:</span>
                <span className={styles.mono}>
                  ₦{(jobData.quotedPrice || 0).toLocaleString()}
                </span>
              </div>
              <div className={styles.priceRow}>
                <span>Upfront Paid:</span>
                <span className={styles.mono}>
                  ₦{(totalPaid || 0).toLocaleString()}
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
                  {jobData.quoteValidityDays} Days
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Device & Diagnosis</h2>
              <p className={styles.deviceName}>{jobData.deviceModel}</p>
              <p className={styles.faultText}>{jobData.faultDescription}</p>
            </div>

            {jobData.status === "Transferred" && (
              <div className={`${styles.section} ${styles.highlightSection}`}>
                <h2 className={styles.sectionTitle}>Chain of Custody</h2>
                <p className={styles.deviceName}>Device is with a specialist</p>
                <p className={styles.faultText}>
                  Your device is safe and undergoing specialized repair.
                </p>
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Accessories Left in Shop</h2>
              <div className={styles.pillContainer}>
                {jobData.accessoriesRetained &&
                jobData.accessoriesRetained.length > 0 ? (
                  jobData.accessoriesRetained.map((item, index) => (
                    <span key={index} className={styles.pill}>
                      {item}
                    </span>
                  ))
                ) : (
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                    }}
                  >
                    None
                  </span>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Device Condition (Pre-Repair)
              </h2>
              <div className={styles.photoGrid}>
                {jobData.photos && jobData.photos.length > 0 ? (
                  jobData.photos.map((photo, index) => (
                    <div key={index} className={styles.photoBox}>
                      <img
                        src={photo.url}
                        alt={`Condition ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className={styles.photoBox}>No Image</div>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Financial Agreement</h2>
              <div className={styles.priceRow}>
                <span>Quoted Price:</span>
                <span className={styles.mono}>
                  ₦{(jobData.quotedPrice || 0).toLocaleString()}
                </span>
              </div>
              <div className={styles.priceRow}>
                <span>Total Paid:</span>
                <span className={styles.mono}>
                  ₦{(totalPaid || 0).toLocaleString()}
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
                {(jobData.events || []).map((item, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <p className={styles.timelineTime}>
                      {new Date(item.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className={styles.timelineEvent}>{item.eventText}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

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

      {isPinOpen && (
        <PinPad
          onSuccess={handlePinSuccess}
          onClose={() => setIsPinOpen(false)}
          title="Authorize Agreement"
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
