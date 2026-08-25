import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  TopAppBar,
  TextField,
  IconButton,
  FilterChips,
  Card,
  StatusChip,
  Avatar,
  Skeleton,
  EmptyState,
  ErrorState,
  Tabs,
  PrimaryTab,
  Icon,
} from "../../ui";
import CustomerProfile from "../../components/customerProfile/CustomerProfile";
import { getJobHistory, getShopCustomers } from "../../services/api";
import useShop from "../../hooks/useShop";
import useToast from "../../hooks/useToast";
import mark from "../../assets/mark.png";
import styles from "./History.module.css";

const JOB_FILTERS = [
  { value: "Completed", label: "Completed", icon: "task_alt" },
  { value: "Cancelled", label: "Cancelled", icon: "cancel" },
];

const HistoryJobCard = ({ job }) => (
  <Card
    as={Link}
    to={`/app/job/${job.id}`}
    viewTransition
    variant="elevated"
    interactive
    className={styles.card}
  >
    <div className={styles.cardTop}>
      <h3 className={`${styles.deviceName} md-typescale-title-medium`}>
        {job.deviceModel}
      </h3>
      <StatusChip status={job.status} size="small" />
    </div>
    <p className={`${styles.customer} md-typescale-body-medium`}>
      <Icon name="person" size={16} />
      {job.customer?.name}
    </p>
    <p className={`${styles.fault} md-typescale-body-medium`}>
      {job.faultDescription}
    </p>
    <p className={`${styles.date} md-typescale-label-medium`}>
      {job.status === "Completed" ? "Completed" : "Cancelled"}{" "}
      {new Date(job.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </p>
  </Card>
);

const CustomerRow = ({ customer, onOpen }) => (
  <Card
    as="button"
    type="button"
    variant="elevated"
    interactive
    onClick={onOpen}
    className={styles.customerCard}
  >
    <Avatar name={customer.name} size={48} />
    <div className={styles.customerInfo}>
      <h3 className={`${styles.customerName} md-typescale-title-medium`}>
        {customer.name}
      </h3>
      <p className={`${styles.customerPhone} md-typescale-body-small`}>
        {customer.phone}
      </p>
    </div>
    <div className={styles.customerMeta}>
      <span className={`${styles.repairs} md-typescale-label-medium`}>
        {customer.jobs.length} repairs
      </span>
      <span className={`${styles.spent} md-typescale-title-small`}>
        ₦{customer.totalSpent.toLocaleString()}
      </span>
    </div>
  </Card>
);

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
    const fetchData = () => {
      setIsLoading(true);
      setError(null);
      const response =
        activeTab === "jobs"
          ? getJobHistory(shopId, search, jobFilter)
          : getShopCustomers(shopId, search);

      response
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

    const delay = setTimeout(fetchData, 300);
    return () => clearTimeout(delay);
  }, [activeTab, search, shopId, showToast, jobFilter]);

  const renderList = () => {
    if (isLoading) {
      return (
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width="100%" height="130px" radius="20px" />
          ))}
        </div>
      );
    }
    if (error) {
      return <ErrorState message={error} />;
    }
    if (activeTab === "jobs") {
      if (jobs.length === 0) {
        return (
          <EmptyState
            icon="history"
            title="No history yet"
            message={`No ${jobFilter.toLowerCase()} jobs found.`}
          />
        );
      }
      return (
        <div className={styles.grid}>
          {jobs.map((job) => (
            <HistoryJobCard key={job.id} job={job} />
          ))}
        </div>
      );
    }
    if (customers.length === 0) {
      return (
        <EmptyState
          icon="groups"
          title="No customers yet"
          message="Customers appear here once they complete a job."
        />
      );
    }
    return (
      <div className={styles.directory}>
        {customers.map((customer) => (
          <CustomerRow
            key={customer.id}
            customer={customer}
            onOpen={() => setSelectedCustomer(customer)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <TopAppBar
        title="History"
        subtitle="Archived jobs & customers"
        leading={<img src={mark} alt="Kostody" className={styles.mark} />}
      />

      <div className={styles.tabsWrap}>
        <Tabs
          activeTabIndex={activeTab === "jobs" ? 0 : 1}
          onChange={(e) =>
            setActiveTab(e.target.activeTabIndex === 0 ? "jobs" : "customers")
          }
        >
          <PrimaryTab>
            <Icon slot="icon" name="work_history" size={20} />
            Jobs
          </PrimaryTab>
          <PrimaryTab>
            <Icon slot="icon" name="groups" size={20} />
            Customers
          </PrimaryTab>
        </Tabs>
      </div>

      <div className={styles.controls}>
        <TextField
          className={styles.search}
          label={activeTab === "jobs" ? "Search jobs" : "Search customers"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leadingIcon="search"
        >
          {search && (
            <IconButton
              slot="trailing-icon"
              type="button"
              icon="close"
              label="Clear search"
              onClick={() => setSearch("")}
            />
          )}
        </TextField>

        {activeTab === "jobs" && (
          <FilterChips
            className={styles.filters}
            options={JOB_FILTERS}
            value={jobFilter}
            onChange={setJobFilter}
          />
        )}
      </div>

      <div className={styles.content}>
        <div key={activeTab} className={styles.panel}>
          {renderList()}
        </div>
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
