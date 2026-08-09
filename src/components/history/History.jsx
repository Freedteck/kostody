import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./History.module.css";
import EmptyState from "../emptyState/EmptyState";
import CustomerProfile from "../customerProfile/CustomerProfile";

// Expanded mock data with multiple jobs per customer
const mockHistory = [
  {
    id: "KSD-1A2B",
    device: "iPhone 11",
    customer: "Chidi O.",
    phone: "0801 234 5678",
    fault: "Battery Swap",
    date: "Oct 12, 2024",
    price: 15000,
  },
  {
    id: "KSD-2B3C",
    device: "iPhone 13 Pro",
    customer: "Chidi O.",
    phone: "0801 234 5678",
    fault: "Screen Replacement",
    date: "Sep 05, 2024",
    price: 45000,
  },
  {
    id: "KSD-3C4D",
    device: "Samsung S21",
    customer: "Amina B.",
    phone: "0709 876 5432",
    fault: "Charging Port",
    date: "Oct 05, 2024",
    price: 20000,
  },
  {
    id: "KSD-4D5E",
    device: "Tecno Camon 20",
    customer: "Amina B.",
    phone: "0709 876 5432",
    fault: "Software Reset",
    date: "Aug 22, 2024",
    price: 5000,
  },
  {
    id: "KSD-5E6F",
    device: "Redmi Note 12",
    customer: "Emeka N.",
    phone: "0805 111 2222",
    fault: "Water Damage",
    date: "Oct 18, 2024",
    price: 30000,
  },
];

const History = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = useMemo(() => {
    const grouped = {};
    mockHistory.forEach((job) => {
      if (!grouped[job.phone]) {
        grouped[job.phone] = {
          name: job.customer,
          phone: job.phone,
          jobs: [],
          totalSpent: 0,
        };
      }
      grouped[job.phone].jobs.push(job);
      grouped[job.phone].totalSpent += job.price;
    });
    return Object.values(grouped);
  }, []);

  const filteredJobs = mockHistory.filter(
    (job) =>
      job.customer.toLowerCase().includes(search.toLowerCase()) ||
      job.device.toLowerCase().includes(search.toLowerCase()) ||
      job.id.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search),
  );

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h1>History</h1>
        <p>Archived Jobs & Customers</p>
      </div>

      {/* Native Segmented Toggle */}
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

      {activeTab === "jobs" ? (
        <div className={styles.listContainer}>
          {filteredJobs.length === 0 ? (
            <EmptyState
              title="No History Yet"
              message="Completed and archived jobs will appear here."
            />
          ) : (
            filteredJobs.map((job) => (
              <Link
                key={job.id}
                to={`/app/job/${job.id}`}
                className={styles.jobCard}
              >
                <div className={styles.jobHeader}>
                  <h2 className={styles.deviceName}>{job.device}</h2>
                  <span className={styles.jobIdPill}>#{job.id}</span>
                </div>
                <p className={styles.customerName}>{job.customer}</p>
                <p className={styles.jobFault}>{job.fault}</p>
                <p className={styles.dateText}>Completed: {job.date}</p>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className={styles.listContainer}>
          {filteredCustomers.length === 0 ? (
            <EmptyState
              title="No Customers Yet"
              message="Customers will appear here once they complete a job."
            />
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer.phone}
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
      )}

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
