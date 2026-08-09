import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import ReturnJobSearch from "../../components/returnJobSearch/ReturnJobSearch";
import EmptyState from "../../components/emptyState/EmptyState";
import Notifications from "../../components/notifications/Notifications";

const mockJobs = [
  {
    id: "KSD-9F3A",
    device: "iPhone 13 Pro",
    customer: "Chidi O.",
    fault: "Broken Screen",
    status: "Pending Confirmation",
  },
  {
    id: "KSD-8B2C",
    device: "Tecno Camon 20",
    customer: "Amina B.",
    fault: "Charging Port",
    status: "In Progress",
  },
  {
    id: "KSD-7D1E",
    device: "Samsung A14",
    customer: "Emeka N.",
    fault: "Software Reset",
    status: "Ready for Pickup",
  },
  {
    id: "KSD-6F5G",
    device: "iPhone 11",
    customer: "Chidi O.",
    fault: "Battery Swap",
    status: "In Progress",
  },
];

const getStatusClass = (status) => {
  if (status === "Pending Confirmation") return styles.statusPending;
  if (status === "In Progress") return styles.statusProgress;
  if (status === "Ready for Pickup") return styles.statusReady;
  return "";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Pending Confirmation",
    "In Progress",
    "Ready for Pickup",
  ];

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || job.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleReturnSelect = (jobData) => {
    setIsReturnOpen(false);
    navigate("/app/intake", { state: { returnJobData: jobData } });
  };

  return (
    <div className={styles.workbench}>
      <div className={styles.header}>
        <div>
          <h1>Active Jobs</h1>
          <p>Workbench: {filteredJobs.length} devices</p>
        </div>
        <div className={styles.headerActions}>
          {/* Native SVG Icons */}
          <button
            className={styles.iconBtn}
            onClick={() => setIsNotifOpen(true)}
            title="Notifications"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
                : filter}
          </button>
        ))}
      </div>

      <div className={styles.jobList}>
        {filteredJobs.length === 0 ? (
          <EmptyState
            title="Workbench Empty"
            message="No active jobs match your search. Use the + button to log a new intake."
          />
        ) : (
          filteredJobs.map((job) => (
            <Link
              key={job.id}
              className={styles.jobCard}
              to={`/app/job/${job.id}`}
            >
              <div className={styles.jobHeader}>
                <h2 className={styles.deviceName}>{job.device}</h2>
                <p className={styles.jobId}>#{job.id}</p>
              </div>
              <p className={styles.customerName}>Customer: {job.customer}</p>
              <p className={styles.jobFault}>Fault: {job.fault}</p>
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
