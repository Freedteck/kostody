import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TopAppBar,
  TextField,
  IconButton,
  Card,
  StatusChip,
  Icon,
  Skeleton,
  EmptyState,
  ErrorState,
} from "../../ui";
import { getCustomerJobs } from "../../services/api";
import mark from "../../assets/mark.png";
import styles from "./CustomerHistory.module.css";

const HistoryCard = ({ job }) => (
  <Card
    as={Link}
    to={`/c/${job.id}`}
    viewTransition
    variant="outlined"
    interactive
    className={styles.card}
  >
    <span className={styles.cardIcon}>
      <Icon name="smartphone" size={22} />
    </span>
    <div className={styles.cardInfo}>
      <h3 className={`${styles.device} md-typescale-title-small`}>
        {job.deviceModel}
      </h3>
      <p className={`${styles.meta} md-typescale-body-medium`}>
        {job.shop?.shopName} · {new Date(job.createdAt).toLocaleDateString()}
      </p>
    </div>
    <StatusChip status={job.status} size="small" />
  </Card>
);

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
      return undefined;
    }
    let active = true;
    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(null);
      getCustomerJobs(customerData.id, search)
        .then((data) => {
          if (active)
            setJobs(
              data.filter((j) =>
                ["Completed", "Cancelled"].includes(j.status),
              ),
            );
        })
        .catch(() => {
          if (active) setError("Failed to load history.");
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, navigate]);

  const grouped = jobs.reduce((acc, job) => {
    const label = new Date(job.createdAt).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    (acc[label] = acc[label] || []).push(job);
    return acc;
  }, {});

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className={styles.list}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width="100%" height="76px" radius="16px" />
          ))}
        </div>
      );
    }
    if (error) {
      return <ErrorState message={error} />;
    }
    if (jobs.length === 0) {
      return (
        <EmptyState
          icon="history"
          title="No history found"
          message="No past repairs match your search."
        />
      );
    }
    return (
      <div className={styles.groups}>
        {Object.entries(grouped).map(([month, monthJobs]) => (
          <section key={month} className={styles.group}>
            <h2 className={`${styles.monthLabel} md-typescale-title-small`}>
              {month}
            </h2>
            <div className={styles.list}>
              {monthJobs.map((job) => (
                <HistoryCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <TopAppBar
        title="Device Cabinet"
        subtitle="Your repair history"
        leading={<img src={mark} alt="Kostody" className={styles.mark} />}
      />

      <div className={styles.controls}>
        <TextField
          className={styles.search}
          label="Search by device or shop"
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
      </div>

      <div className={styles.content}>{renderBody()}</div>
    </div>
  );
};

export default CustomerHistory;
