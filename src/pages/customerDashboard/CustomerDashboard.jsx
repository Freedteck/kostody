import { useNavigate } from "react-router-dom";
import styles from "./CustomerDashboard.module.css";
import EmptyState from "../../components/emptyState/EmptyState";

// Mocking one active repair to show the Spotlight
const mockActiveRepairs = [
  {
    id: "KSD-9F3A",
    shop: "TechFix Clinic",
    device: "iPhone 13 Pro",
    status: "In Progress",
    quotedPrice: 25000,
    totalPaid: 10000,
  },
];

const mockHistory = [
  {
    id: "KSD-1A2B",
    shop: "TechFix Clinic",
    device: "iPhone 11",
    date: "Oct 12, 2024",
  },
  {
    id: "KSD-3C4D",
    shop: "Alaba Tech Hub",
    device: "Samsung S21",
    date: "Sep 05, 2024",
  },
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const activeRepair = mockActiveRepairs[0]; // The spotlight

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div>
          <h1>My Devices</h1>
          <p>Track and manage your repairs</p>
        </div>
        <div className={styles.avatar}>CO</div>
      </div>

      {/* Active Repair Spotlight */}
      {activeRepair ? (
        <div
          className={styles.spotlightCard}
          onClick={() => navigate(`/c/${activeRepair.id}`)}
        >
          <div className={styles.spotlightHeader}>
            <div>
              <p className={styles.spotlightLabel}>Currently in the shop</p>
              <h2 className={styles.spotlightDevice}>{activeRepair.device}</h2>
              <p className={styles.spotlightShop}>{activeRepair.shop}</p>
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
                  activeRepair.quotedPrice - activeRepair.totalPaid
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

      {/* Device Cabinet (History) */}
      {mockHistory.length > 0 && (
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
            {mockHistory.slice(0, 2).map(
              (
                job, // Only show top 2 on dashboard
              ) => (
                <div
                  key={job.id}
                  className={styles.historyCard}
                  onClick={() => navigate(`/c/${job.id}`)}
                >
                  <div className={styles.historyIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
                    <h3 className={styles.historyDevice}>{job.device}</h3>
                    <p className={styles.historyMeta}>
                      {job.shop} · {job.date}
                    </p>
                  </div>
                  <span className={styles.historyStatus}>Completed</span>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
