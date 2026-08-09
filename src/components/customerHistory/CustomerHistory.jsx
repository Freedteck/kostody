import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerHistory.module.css";
import EmptyState from "../emptyState/EmptyState";

const mockHistory = [
  {
    id: "KSD-1A2B",
    shop: "TechFix Clinic",
    device: "iPhone 11",
    date: "Oct 12, 2024",
    yearMonth: "October 2024",
  },
  {
    id: "KSD-3C4D",
    shop: "Alaba Tech Hub",
    device: "Samsung S21",
    date: "Oct 05, 2024",
    yearMonth: "October 2024",
  },
  {
    id: "KSD-5E6F",
    shop: "TechFix Clinic",
    device: "Redmi Note 12",
    date: "Sep 18, 2024",
    yearMonth: "September 2024",
  },
  {
    id: "KSD-7G8H",
    shop: "Ikeja Repairs",
    device: "iPhone 13 Pro",
    date: "Aug 22, 2024",
    yearMonth: "August 2024",
  },
];

const CustomerHistory = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockHistory.filter(
    (job) =>
      job.device.toLowerCase().includes(search.toLowerCase()) ||
      job.shop.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by Year/Month
  const groupedHistory = filtered.reduce((acc, job) => {
    (acc[job.yearMonth] = acc[job.yearMonth] || []).push(job);
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

      {filtered.length === 0 ? (
        <EmptyState
          title="No History Found"
          message="No past repairs match your search."
        />
      ) : (
        <div className={styles.timelineList}>
          {Object.entries(groupedHistory).map(([month, jobs]) => (
            <div key={month} className={styles.monthGroup}>
              <h2 className={styles.monthHeader}>{month}</h2>
              <div className={styles.jobList}>
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className={styles.jobCard}
                    onClick={() => navigate(`/c/${job.id}`)}
                  >
                    <div className={styles.cardHeader}>
                      <h3 className={styles.deviceName}>{job.device}</h3>
                      <span className={styles.statusBadge}>Completed</span>
                    </div>
                    <div className={styles.cardMeta}>
                      <span className={styles.shopName}>{job.shop}</span>
                      <span className={styles.dot}>•</span>
                      <span className={styles.dateText}>{job.date}</span>
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
