import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import ReturnJobSearch from "../../components/returnJobSearch/ReturnJobSearch";

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
    navigate("/intake", { state: { returnJobData: jobData } });
  };

  return (
    <div className={styles.workbench}>
      <div className={styles.header}>
        <div>
          <h1>Active Jobs</h1>
          <p>Workbench: {filteredJobs.length} devices</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.iconBtn}
            onClick={() => setIsReturnOpen(true)}
            title="Return Job"
          >
            ↩
          </button>
          <button
            className={styles.iconBtnPrimary}
            onClick={() => navigate("/app/intake")}
            title="New Intake"
          >
            +
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search name, device, or Job ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Filter Tabs */}
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

      {/* <div className={styles.actionRow}>
        <button className={styles.newIntakeBtn} onClick={handleNewIntake}>
          + New Intake
        </button>
        <button
          className={styles.returnJobBtn}
          onClick={() => setIsReturnOpen(true)}
        >
          ↩ Return Job
        </button>
      </div> */}

      <div className={styles.jobList}>
        {filteredJobs.length === 0 ? (
          <p className={styles.noJobs}>No jobs match your search.</p>
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
    </div>
  );
};

export default Dashboard;
