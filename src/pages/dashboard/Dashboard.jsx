import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import ReturnJobSearch from "../../components/returnJobSearch/ReturnJobSearch";
import EmptyState from "../../components/emptyState/EmptyState";
import Notifications from "../../components/notifications/Notifications";
import { getJobsByShop } from "../../services/api";
import useToast from "../../hooks/useToast";
import { Skeleton } from "../../components/skeleton/Skeleton";
import ErrorState from "../../components/errorState/ErrorState";
import useShop from "../../hooks/useShop";

const getStatusClass = (status) => {
  if (status === "Pending Confirmation") return styles.statusPending;
  if (status === "In Progress") return styles.statusProgress;
  if (status === "Ready for Pickup") return styles.statusReady;
  return "";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { shopId } = useShop();
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      await getJobsByShop(shopId, activeFilter, searchQuery)
        .then((data) => {
          setJobs(data);
        })
        .catch((err) => {
          console.error("Error:", err);
          setError("Failed to load jobs.");
          showToast("Could not fetch jobs from server.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    const delayDebounceFn = setTimeout(fetchJobs, 300); // Debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [activeFilter, searchQuery, showToast, shopId]);

  const filters = [
    "",
    "Pending Confirmation",
    "In Progress",
    "Ready for Pickup",
  ];

  const handleReturnSelect = (jobData) => {
    setIsReturnOpen(false);
    navigate("/app/intake", { state: { returnJobData: jobData } });
  };

  return (
    <div className={styles.workbench}>
      <div className={styles.header}>
        <div>
          <h1>Active Jobs</h1>
          <p>Workbench: {isLoading ? "..." : jobs.length} devices</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.iconBtn}
            onClick={() => setIsNotifOpen(true)}
            title="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 17H9M18 17C18.5523 17 19 16.5523 19 16V15.4142C19 15.149 18.8946 14.8946 18.7071 14.7071L18 14V11C18 8.23858 15.7614 6 13 6H11C8.23858 6 6 8.23858 6 11V14L5.29289 14.7071C5.10536 14.8946 5 15.149 5 15.4142V16C5 16.5523 5.44772 17 6 17H18Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => setIsReturnOpen(true)}
            title="Return Job"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 14L4 9L9 4M4 9H15C18.866 9 22 12.134 22 16C22 19.866 18.866 23 15 23H12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.iconBtnPrimary}
            onClick={() => navigate("/app/intake")}
            title="New Intake"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search name, device, or Job ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className={styles.filterTabs}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.tabBtn} ${activeFilter === filter ? styles.tabActive : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "Pending Confirmation"
              ? "Pending"
              : filter === "Ready for Pickup"
                ? "Ready"
                : filter === ""
                  ? "All"
                  : filter}
          </button>
        ))}
      </div>

      <div className={styles.jobList}>
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} width="100%" height="120px" radius="12px" />
          ))
        ) : error ? (
          <ErrorState message={error} />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="Workbench Empty"
            message="No active jobs match your search. Use the + button to log a new intake."
          />
        ) : (
          jobs.map((job) => (
            <Link
              key={job.id}
              className={styles.jobCard}
              to={`/app/job/${job.id}`}
            >
              <div className={styles.jobHeader}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <h2 className={styles.deviceName}>{job.deviceModel}</h2>
                  {job.isReturn && (
                    <span className={styles.returnBadge} title="Return Job">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 14L4 9L9 4M4 9H15C18.866 9 22 12.134 22 16C22 19.866 18.866 23 15 23H12"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <p className={styles.jobId}>#{job.id}</p>
              </div>
              <p className={styles.customerName}>
                Customer: {job.customer?.name}
              </p>
              <p className={styles.jobFault}>Fault: {job.faultDescription}</p>
              <div className={styles.jobDetails}>
                <span
                  className={`${styles.statusBadge} ${getStatusClass(job.status)}`}
                >
                  {job.status}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {isReturnOpen && (
        <ReturnJobSearch
          onSelectJob={handleReturnSelect}
          onClose={() => setIsReturnOpen(false)}
          title="Process Return Job"
        />
      )}
      {isNotifOpen && <Notifications onClose={() => setIsNotifOpen(false)} />}
    </div>
  );
};

export default Dashboard;
