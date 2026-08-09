import { useState } from "react";
import { Link } from "react-router-dom"; // Add Link import
import styles from "./History.module.css";

const mockHistory = [
  {
    id: "KSD-1A2B",
    device: "iPhone 11",
    customer: "Chidi O.",
    fault: "Battery Swap",
    date: "Oct 12, 2024",
  },
  {
    id: "KSD-3C4D",
    device: "Samsung S21",
    customer: "Amina B.",
    fault: "Screen Replacement",
    date: "Oct 05, 2024",
  },
];

const History = () => {
  const [search, setSearch] = useState("");

  const filtered = mockHistory.filter(
    (job) =>
      job.customer.toLowerCase().includes(search.toLowerCase()) ||
      job.device.toLowerCase().includes(search.toLowerCase()) ||
      job.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h1>Job History</h1>
        <p>Archived & Completed Jobs</p>
      </div>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search history..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.jobList}>
        {filtered.map((job) => (
          <Link
            key={job.id}
            to={`/app/job/${job.id}`}
            className={styles.jobCardLink}
          >
            <div className={styles.jobCard}>
              <div className={styles.jobHeader}>
                <h2 className={styles.deviceName}>{job.device}</h2>
                <p className={styles.jobId}>#{job.id}</p>
              </div>
              <p className={styles.customerName}>Customer: {job.customer}</p>
              <p className={styles.jobFault}>Fault: {job.fault}</p>
              <p className={styles.dateText}>Completed: {job.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default History;
