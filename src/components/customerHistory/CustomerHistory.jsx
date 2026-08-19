import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerHistory.module.css";
import EmptyState from "../emptyState/EmptyState";
import { getCustomerJobs } from "../../services/api";
import { Skeleton } from "../skeleton/Skeleton";
import ErrorState from "../errorState/ErrorState";

const CustomerHistory = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const customerData = JSON.parse(localStorage.getItem("kostody_customer"));
    if (!customerData) {
      navigate("/c/login");
      return;
    }

    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      await getCustomerJobs(customerData.id, search)
        .then((data) => {
          setJobs(
            data.filter((j) => ["Completed", "Cancelled"].includes(j.status)),
          );
        })
        .catch(() => {
          setError("Failed to load history.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    const delayDebounceFn = setTimeout(fetchJobs, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, navigate]);

  const groupedHistory = jobs.reduce((acc, job) => {
    const date = new Date(job.createdAt);
    const yearMonth = date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    (acc[yearMonth] = acc[yearMonth] || []).push(job);
    return acc;
  }, {});

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h1>Device Cabinet</h1>
        <p>Your full repair history</p>
      </div>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search by device or shop..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <>
          <Skeleton width="100%" height="100px" radius="12px" />
          <div style={{ height: "12px" }}></div>
          <Skeleton width="100%" height="100px" radius="12px" />
        </>
      ) : error ? (
        <ErrorState message={error} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No History Found"
          message="No past repairs match your search."
        />
      ) : (
        <div className={styles.timelineList}>
          {Object.entries(groupedHistory).map(([month, monthJobs]) => (
            <div key={month} className={styles.monthGroup}>
              <h2 className={styles.monthHeader}>{month}</h2>
              <div className={styles.jobList}>
                {monthJobs.map((job) => (
                  <div
                    key={job.id}
                    className={styles.jobCard}
                    onClick={() => navigate(`/c/${job.id}`)}
                  >
                    <div className={styles.cardHeader}>
                      <h3 className={styles.deviceName}>{job.deviceModel}</h3>
                      <span
                        className={`${styles.statusBadge} ${job.status === "Cancelled" ? styles.statusCancelled : styles.statusCompleted}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className={styles.cardMeta}>
                      <span className={styles.shopName}>
                        {job.shop?.shopName}
                      </span>
                      <span className={styles.dot}>•</span>
                      <span className={styles.dateText}>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerHistory;
