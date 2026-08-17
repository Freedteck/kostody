import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./History.module.css";
import EmptyState from "../emptyState/EmptyState";
import CustomerProfile from "../customerProfile/CustomerProfile";
import { getJobHistory, getShopCustomers } from "../../services/api";
import useShop from "../../hooks/useShop";
import useToast from "../../hooks/useToast";
import { Skeleton } from "../skeleton/Skeleton";
import ErrorState from "../errorState/ErrorState";

const History = () => {
  const { shopId } = useShop();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobFilter, setJobFilter] = useState("Completed");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const response =
        activeTab === "jobs"
          ? getJobHistory(shopId, search, jobFilter)
          : getShopCustomers(shopId, search);

      await response
        .then((data) => {
          if (activeTab === "jobs") setJobs(data);
          else setCustomers(data);
        })
        .catch(() => {
          setError("Failed to load data.");
          showToast("Could not fetch data.", "error");
        })
        .finally(() => setIsLoading(false));
    };

    const delayDebounceFn = setTimeout(fetchData, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [activeTab, search, shopId, showToast, jobFilter]);

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h1>History</h1>
        <p>Archived Jobs & Customers</p>
      </div>

      <div className={styles.toggleContainer}>
        <button
          className={`${styles.toggleBtn} ${activeTab === "jobs" ? styles.toggleActive : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          Jobs
        </button>
        <button
          className={`${styles.toggleBtn} ${activeTab === "customers" ? styles.toggleActive : ""}`}
          onClick={() => setActiveTab("customers")}
        >
          Customers
        </button>
      </div>

      <input
        type="text"
        className={styles.searchInput}
        placeholder={
          activeTab === "jobs" ? "Search jobs..." : "Search customers..."
        }
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {activeTab === "jobs" && (
        <div className={styles.filterTabs}>
          <button
            className={`${styles.tabBtn} ${jobFilter === "Completed" ? styles.tabActive : ""}`}
            onClick={() => setJobFilter("Completed")}
          >
            Completed
          </button>
          <button
            className={`${styles.tabBtn} ${jobFilter === "Cancelled" ? styles.tabActive : ""}`}
            onClick={() => setJobFilter("Cancelled")}
          >
            Cancelled
          </button>
        </div>
      )}

      <div className={styles.listContainer}>
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} width="100%" height="100px" radius="12px" />
          ))
        ) : error ? (
          <ErrorState message={error} />
        ) : activeTab === "jobs" ? (
          jobs.length === 0 ? (
            <EmptyState
              title="No History Yet"
              message={`No ${jobFilter.toLowerCase()} jobs found.`}
            />
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                to={`/app/job/${job.id}`}
                className={styles.jobCard}
              >
                <div className={styles.jobHeader}>
                  <h2 className={styles.deviceName}>{job.deviceModel}</h2>
                  <span
                    className={`${styles.statusBadge} ${
                      job.status === "Completed"
                        ? styles.statusCompleted
                        : styles.statusCancelled
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className={styles.customerName}>{job.customer?.name}</p>
                <p className={styles.jobFault}>{job.faultDescription}</p>
                <p className={styles.dateText}>
                  {job.status === "Completed" ? "Completed" : "Cancelled"}:{" "}
                  {new Date(job.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            ))
          )
        ) : customers.length === 0 ? (
          <EmptyState
            title="No Customers Yet"
            message="Customers will appear here once they complete a job."
          />
        ) : (
          customers.map((customer) => (
            <div
              key={customer.id}
              className={styles.customerCard}
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className={styles.customerAvatar}>
                {customer.name.charAt(0)}
              </div>
              <div className={styles.customerInfo}>
                <h2 className={styles.customerName}>{customer.name}</h2>
                <p className={styles.customerPhone}>{customer.phone}</p>
              </div>
              <div className={styles.customerMeta}>
                <span className={styles.customerCount}>
                  {customer.jobs.length} Repairs
                </span>
                <span className={styles.customerSpent}>
                  ₦{customer.totalSpent.toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedCustomer && (
        <CustomerProfile
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default History;
