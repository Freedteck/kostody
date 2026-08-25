import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TopAppBar,
  IconButton,
  Card,
  StatusChip,
  Icon,
  Skeleton,
  EmptyState,
  ErrorState,
} from "../../ui";
import { getCustomerJobs } from "../../services/api";
import useNotifications from "../../hooks/useNotifications";
import mark from "../../assets/mark.png";
import styles from "./CustomerDashboard.module.css";

const naira = (value) => `₦${(Number(value) || 0).toLocaleString()}`;

const outstandingOf = (job) => {
  const totalPaid = (job.payments || []).reduce((sum, p) => sum + p.amount, 0);
  return (Number(job.quotedPrice) || 0) - totalPaid;
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerId] = useState(
    () => JSON.parse(localStorage.getItem("kostody_customer"))?.id || null,
  );

  const { unreadCount } = useNotifications("customer", customerId);

  useEffect(() => {
    const customerData = JSON.parse(localStorage.getItem("kostody_customer"));
    if (!customerData) {
      navigate("/c/login");
      return undefined;
    }
    let active = true;
    getCustomerJobs(customerData.id)
      .then((data) => {
        if (active) setJobs(data);
      })
      .catch(() => {
        if (active) setError("Failed to load repairs.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  const activeRepairs = jobs.filter(
    (j) => !["Completed", "Cancelled"].includes(j.status),
  );
  const history = jobs.filter((j) =>
    ["Completed", "Cancelled"].includes(j.status),
  );
  const activeRepair = activeRepairs[0];

  const bell = (
    <div className={styles.bell}>
      <IconButton
        variant="standard"
        icon="notifications"
        label="Notifications"
        onClick={() => navigate("/c/notifications")}
      />
      {unreadCount > 0 && (
        <span className={styles.bellBadge}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );

  const renderBody = () => {
    if (isLoading) {
      return (
        <>
          <Skeleton width="100%" height="188px" radius="24px" />
          <Skeleton width="100%" height="76px" radius="16px" />
          <Skeleton width="100%" height="76px" radius="16px" />
        </>
      );
    }
    if (error) {
      return <ErrorState message={error} />;
    }
    return (
      <>
        {activeRepair ? (
          <Card
            as={Link}
            to={`/c/${activeRepair.id}`}
            viewTransition
            variant="elevated"
            interactive
            padded={false}
            className={styles.spotlight}
          >
            <div className={styles.spotlightBody}>
              <div className={styles.spotlightHead}>
                <span
                  className={`${styles.spotlightTag} md-typescale-label-large`}
                >
                  <Icon name="handyman" size={16} filled />
                  Currently in the shop
                </span>
                <StatusChip status={activeRepair.status} size="small" />
              </div>
              <h2
                className={`${styles.spotlightDevice} md-typescale-headline-small`}
              >
                {activeRepair.deviceModel}
              </h2>
              <p className={`${styles.spotlightShop} md-typescale-body-large`}>
                {activeRepair.shop?.shopName}
              </p>
              <div className={styles.spotlightFoot}>
                <div className={styles.balance}>
                  <span className={`${styles.balanceLabel} md-typescale-label-medium`}>
                    Outstanding balance
                  </span>
                  <span
                    className={`${styles.balanceAmount} md-typescale-title-large`}
                  >
                    {naira(outstandingOf(activeRepair))}
                  </span>
                </div>
                <span className={`${styles.openLink} md-typescale-label-large`}>
                  View progress
                  <Icon name="arrow_forward" size={18} />
                </span>
              </div>
            </div>
          </Card>
        ) : (
          <EmptyState
            icon="devices"
            title="No active repairs"
            message="When you drop a device at a Kostody-powered shop, it will appear here."
          />
        )}

        {history.length > 0 && (
          <section className={styles.cabinet}>
            <div className={styles.cabinetHead}>
              <h2 className={`${styles.cabinetTitle} md-typescale-title-medium`}>
                Device Cabinet
              </h2>
              <Link to="/c/history" className={styles.seeAll}>
                See all
              </Link>
            </div>
            <div className={styles.cabinetList}>
              {history.slice(0, 6).map((job) => (
                <Card
                  key={job.id}
                  as={Link}
                  to={`/c/${job.id}`}
                  viewTransition
                  variant="outlined"
                  interactive
                  className={styles.cabinetCard}
                >
                  <span className={styles.cabinetIcon}>
                    <Icon name="smartphone" size={22} />
                  </span>
                  <div className={styles.cabinetInfo}>
                    <h3 className={`${styles.cabinetDevice} md-typescale-title-small`}>
                      {job.deviceModel}
                    </h3>
                    <p className={`${styles.cabinetMeta} md-typescale-body-medium`}>
                      {job.shop?.shopName} ·{" "}
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusChip status={job.status} size="small" />
                </Card>
              ))}
            </div>
          </section>
        )}
      </>
    );
  };

  return (
    <div className={styles.page}>
      <TopAppBar
        title="My Devices"
        subtitle="Track and manage your repairs"
        leading={<img src={mark} alt="Kostody" className={styles.mark} />}
        actions={bell}
      />
      <div className={styles.content}>{renderBody()}</div>
    </div>
  );
};

export default CustomerDashboard;
