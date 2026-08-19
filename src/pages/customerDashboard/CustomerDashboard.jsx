import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerDashboard.module.css";
import EmptyState from "../../components/emptyState/EmptyState";
import { getCustomerJobs } from "../../services/api";
import { Skeleton } from "../../components/skeleton/Skeleton";
import ErrorState from "../../components/errorState/ErrorState";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const customerData = JSON.parse(localStorage.getItem("kostody_customer"));
    if (!customerData) {
      navigate("/c/login");
      return;
    }

    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      await getCustomerJobs(customerData.id)
        .then((data) => {
          setJobs(data);
        })
        .catch(() => {
          setError("Failed to load repairs.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchJobs();
  }, [navigate]);

  const activeRepairs = jobs.filter(
    (j) => !["Completed", "Cancelled"].includes(j.status),
  );
  const history = jobs.filter((j) =>
    ["Completed", "Cancelled"].includes(j.status),
  );
  const activeRepair = activeRepairs[0];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div>
          <h1>My Devices</h1>
          <p>Track and manage your repairs</p>
        </div>
        <div className={styles.avatar}>CO</div>
      </div>

      {isLoading ? (
        <>
          <Skeleton width="100%" height="150px" radius="16px" />
          <div style={{ height: "30px" }}></div>
          <Skeleton width="100%" height="80px" radius="12px" />
          <div style={{ height: "12px" }}></div>
          <Skeleton width="100%" height="80px" radius="12px" />
        </>
      ) : error ? (
        <ErrorState message={error} />
      ) : activeRepair ? (
        <div
          className={styles.spotlightCard}
          onClick={() => navigate(`/c/${activeRepair.id}`)}
        >
          <div className={styles.spotlightHeader}>
            <div>
              <p className={styles.spotlightLabel}>Currently in the shop</p>
              <h2 className={styles.spotlightDevice}>
                {activeRepair.deviceModel}
              </h2>
              <p className={styles.spotlightShop}>
                {activeRepair.shop?.shopName}
              </p>
            </div>
            <span className={`${styles.statusPill} ${styles.statusActive}`}>
              {activeRepair.status}
            </span>
          </div>
          <div className={styles.spotlightFooter}>
            <div className={styles.balanceInfo}>
              <span className={styles.balanceLabel}>Outstanding Balance</span>
              <span className={styles.balanceAmount}>
                ₦
                {(
                  (activeRepair.quotedPrice || 0) -
                  (activeRepair.upfrontPayment || 0)
                ).toLocaleString()}
              </span>
            </div>
            <button className={styles.trackBtn}>View Progress →</button>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Active Repairs"
          message="When you drop a device at a Kostody-powered shop, it will appear here."
        />
      )}

      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Device Cabinet</h2>
            <button
              className={styles.seeAllBtn}
              onClick={() => navigate("/c/history")}
            >
              See All
            </button>
          </div>
          <div className={styles.historyList}>
            {history.slice(0, 6).map((job) => (
              <div
                key={job.id}
                className={styles.historyCard}
                onClick={() => navigate(`/c/${job.id}`)}
              >
                <div className={styles.historyIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 3H15C15.5523 3 16 3.44772 16 4V6H8V4C8 3.44772 8.44772 3 9 3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="4"
                      y="6"
                      width="16"
                      height="15"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9 12H15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className={styles.historyInfo}>
                  <h3 className={styles.historyDevice}>{job.deviceModel}</h3>
                  <p className={styles.historyMeta}>
                    {job.shop?.shopName} ·{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={styles.historyStatus}>{job.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
