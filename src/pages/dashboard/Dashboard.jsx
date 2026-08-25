import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TopAppBar,
  IconButton,
  TextField,
  FilterChips,
  Card,
  StatusChip,
  Skeleton,
  EmptyState,
  ErrorState,
  Fab,
  FabDock,
  Icon,
} from "../../ui";
import ReturnJobSearch from "../../components/returnJobSearch/ReturnJobSearch";
import { getJobsByShop } from "../../services/api";
import useToast from "../../hooks/useToast";
import useShop from "../../hooks/useShop";
import useNotifications from "../../hooks/useNotifications";
import mark from "../../assets/mark.png";
import styles from "./Dashboard.module.css";

const FILTERS = [
  { value: "", label: "All" },
  { value: "Pending Confirmation", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Ready for Pickup", label: "Ready" },
];

const daysOn = (createdAt) =>
  Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000),
  );

const JobCard = ({ job }) => (
  <Card
    as={Link}
    to={`/app/job/${job.id}`}
    viewTransition
    variant="elevated"
    interactive
    className={styles.card}
  >
    <div className={styles.cardTop}>
      <div className={styles.device}>
        <h3 className={`${styles.deviceName} md-typescale-title-medium`}>
          {job.deviceModel}
        </h3>
        {job.isReturn && (
          <span className={styles.returnTag}>
            <Icon name="assignment_return" size={14} />
            Return
          </span>
        )}
      </div>
      <span className={`${styles.jobId} md-typescale-label-medium`}>
        #{job.id}
      </span>
    </div>
    <p className={`${styles.customer} md-typescale-body-medium`}>
      <Icon name="person" size={16} />
      {job.customer?.name}
    </p>
    <p className={`${styles.fault} md-typescale-body-medium`}>
      {job.faultDescription}
    </p>
    <div className={styles.cardFoot}>
      <span className={`${styles.date} md-typescale-label-medium`}>
        {new Date(job.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </span>
      <StatusChip status={job.status} size="small" />
    </div>
  </Card>
);

const Spotlight = ({ job }) => (
  <Card
    as={Link}
    to={`/app/job/${job.id}`}
    viewTransition
    variant="elevated"
    interactive
    padded={false}
    className={styles.spotlight}
    style={{
      background: "var(--md-sys-color-primary-container)",
      color: "var(--md-sys-color-on-primary-container)",
    }}
  >
    <div className={styles.spotlightBody}>
      <div className={styles.spotlightHead}>
        <span className={`${styles.spotlightTag} md-typescale-label-large`}>
          <Icon name="priority_high" size={16} filled />
          Needs attention
        </span>
        <StatusChip status={job.status} size="small" />
      </div>
      <h2 className={`${styles.spotlightDevice} md-typescale-headline-small`}>
        {job.deviceModel}
      </h2>
      <p className={`${styles.spotlightCustomer} md-typescale-body-large`}>
        {job.customer?.name}
      </p>
      <p className={`${styles.spotlightFault} md-typescale-body-medium`}>
        {job.faultDescription}
      </p>
      <div className={styles.spotlightFoot}>
        <span className={`${styles.bench} md-typescale-label-large`}>
          <Icon name="hourglass_top" size={16} />
          {daysOn(job.createdAt)}d on the bench
        </span>
        <span className={`${styles.openLink} md-typescale-label-large`}>
          Open
          <Icon name="arrow_forward" size={18} />
        </span>
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { shopId } = useShop();

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const { unreadCount } = useNotifications("engineer", shopId);

  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = () => {
      setIsLoading(true);
      setError(null);
      getJobsByShop(shopId, activeFilter, searchQuery)
        .then((data) => setJobs(data))
        .catch(() => {
          setError("Failed to load jobs.");
          showToast("Could not fetch jobs from server.");
        })
        .finally(() => setIsLoading(false));
    };

    const delay = setTimeout(fetchJobs, 300);
    return () => clearTimeout(delay);
  }, [activeFilter, searchQuery, showToast, shopId, reloadKey]);

  const isDefaultView = !searchQuery && !activeFilter;
  const spotlight =
    isDefaultView && jobs.length > 1
      ? [...jobs].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        )[0]
      : null;
  const gridJobs = spotlight ? jobs.filter((j) => j.id !== spotlight.id) : jobs;

  const handleReturnSelect = (jobData) => {
    setIsReturnOpen(false);
    navigate("/app/intake", { state: { returnJobData: jobData } });
  };

  const bell = (
    <div className={styles.bell}>
      <IconButton
        variant="standard"
        icon="notifications"
        label="Notifications"
        onClick={() => navigate("/app/notifications")}
      />
      {unreadCount > 0 && (
        <span className={styles.bellBadge}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <TopAppBar
        title="Active Jobs"
        subtitle={`${isLoading ? "…" : jobs.length} on the bench`}
        leading={<img src={mark} alt="Kostody" className={styles.mark} />}
        actions={bell}
      />

      <div className={styles.controls}>
        <TextField
          className={styles.search}
          label="Search name, device, or job ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leadingIcon="search"
        >
          {searchQuery && (
            <IconButton
              slot="trailing-icon"
              type="button"
              icon="close"
              label="Clear search"
              onClick={() => setSearchQuery("")}
            />
          )}
        </TextField>

        <FilterChips
          className={styles.filters}
          options={FILTERS}
          value={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} width="100%" height="150px" radius="20px" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            message="We couldn't load your jobs. Check your connection and try again."
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="build_circle"
            title="Workbench empty"
            message="No active jobs match your view. Tap the button below to log a new intake."
          />
        ) : (
          <>
            {spotlight && <Spotlight job={spotlight} />}
            {gridJobs.length > 0 && (
              <>
                {spotlight && (
                  <h2 className={`${styles.sectionLabel} md-typescale-title-small`}>
                    On the bench
                  </h2>
                )}
                <div className={styles.grid}>
                  {gridJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {isAddOpen && (
        <div
          className={styles.fabScrim}
          onClick={() => setIsAddOpen(false)}
          aria-hidden="true"
        />
      )}

      <FabDock className={styles.dock}>
        <div className={`${styles.fabMenu} ${isAddOpen ? styles.fabMenuOpen : ""}`}>
          <button
            type="button"
            className={styles.fabAction}
            style={{ transitionDelay: isAddOpen ? "40ms" : "0ms" }}
            onClick={() => {
              setIsAddOpen(false);
              navigate("/app/intake");
            }}
          >
            <span className={`${styles.fabActionLabel} md-typescale-label-large`}>
              New intake
            </span>
            <span className={styles.fabActionIcon}>
              <Icon name="add_a_photo" size={22} />
            </span>
          </button>
          <button
            type="button"
            className={styles.fabAction}
            onClick={() => {
              setIsAddOpen(false);
              setIsReturnOpen(true);
            }}
          >
            <span className={`${styles.fabActionLabel} md-typescale-label-large`}>
              Return job
            </span>
            <span className={styles.fabActionIcon}>
              <Icon name="assignment_return" size={22} />
            </span>
          </button>
        </div>
        <Fab
          icon={isAddOpen ? "close" : "add"}
          variant="primary"
          aria-label={isAddOpen ? "Close menu" : "Add job"}
          aria-expanded={isAddOpen}
          onClick={() => setIsAddOpen((prev) => !prev)}
        />
      </FabDock>

      <ReturnJobSearch
        open={isReturnOpen}
        onSelectJob={handleReturnSelect}
        onClose={() => setIsReturnOpen(false)}
        title="Process return job"
      />
    </div>
  );
};

export default Dashboard;
