import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TopAppBar,
  Avatar,
  Card,
  Icon,
  Divider,
  Switch,
  Button,
  SegmentedButtons,
  StatBanner,
  Skeleton,
  ErrorState,
} from "../../ui";
import ChangePinSheet from "../../components/changePin/ChangePin";
import useShop from "../../hooks/useShop";
import useTheme from "../../hooks/useTheme";
import { getShopProfile, getShopStats } from "../../services/api";
import mark from "../../assets/mark.png";
import styles from "./Profile.module.css";

const PERIODS = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

const InfoRow = ({ icon, label, value }) => (
  <div className={styles.infoRow}>
    <span className={styles.infoIcon}>
      <Icon name={icon} size={20} />
    </span>
    <div className={styles.infoText}>
      <span className={`${styles.infoLabel} md-typescale-label-medium`}>
        {label}
      </span>
      <span className={`${styles.infoValue} md-typescale-body-large`}>
        {value || "-"}
      </span>
    </div>
  </div>
);

const ActionRow = ({ icon, label, onClick }) => (
  <button type="button" className={styles.actionRow} onClick={onClick}>
    <span className={styles.rowLeft}>
      <span className={styles.infoIcon}>
        <Icon name={icon} size={20} />
      </span>
      <span className="md-typescale-body-large">{label}</span>
    </span>
    <Icon name="chevron_right" size={22} className={styles.chevron} />
  </button>
);

const Profile = () => {
  const navigate = useNavigate();
  const { shopId } = useShop();
  const { theme, setTheme } = useTheme();

  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    if (!shopId) return undefined;
    let active = true;
    getShopProfile(shopId)
      .then((data) => {
        if (active) {
          setProfileData(data);
          setError(null);
        }
      })
      .catch(() => {
        if (active) setError("Failed to load profile details.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [shopId]);

  useEffect(() => {
    if (!shopId) return undefined;
    let active = true;
    getShopStats(shopId, period)
      .then((data) => {
        if (active) setStats(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [shopId, period]);

  const handleLogout = () => {
    localStorage.removeItem("kostody_token");
    localStorage.removeItem("kostody_shop");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <TopAppBar
          title="Profile"
          leading={<img src={mark} alt="Kostody" className={styles.mark} />}
        />
        <div className={styles.content}>
          <div className={styles.identity}>
            <Skeleton width="72px" height="72px" radius="50%" />
            <div className={styles.identityText}>
              <Skeleton width="160px" height="24px" radius="6px" />
              <Skeleton width="110px" height="16px" radius="6px" />
            </div>
          </div>
          <Skeleton width="100%" height="120px" radius="20px" />
          <Skeleton width="100%" height="180px" radius="20px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <TopAppBar
          title="Profile"
          leading={<img src={mark} alt="Kostody" className={styles.mark} />}
        />
        <div className={styles.content}>
          <ErrorState message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <TopAppBar
        title="Profile"
        leading={<img src={mark} alt="Kostody" className={styles.mark} />}
      />

      <div className={styles.content}>
        <div className={styles.identity}>
          <Avatar name={profileData.shopName} size={72} />
          <div className={styles.identityText}>
            <h2 className={`${styles.shopName} md-typescale-headline-small`}>
              {profileData.shopName}
            </h2>
            <p className={`${styles.engineerName} md-typescale-body-medium`}>
              <Icon name="engineering" size={16} />
              {profileData.engineerName}
            </p>
          </div>
        </div>

        <section className={styles.group}>
          <div className={styles.statsHead}>
            <h3 className={`${styles.groupTitle} md-typescale-title-small`}>
              Performance
            </h3>
            <SegmentedButtons
              options={PERIODS}
              value={period}
              onChange={setPeriod}
            />
          </div>
          {stats ? (
            <StatBanner
              stats={[
                {
                  value: stats.active,
                  label: "Active",
                  icon: "pending_actions",
                  tone: "primary",
                },
                {
                  value: stats.completed,
                  label: "Completed",
                  icon: "task_alt",
                  tone: "tertiary",
                },
                {
                  value: stats.cancelled,
                  label: "Cancelled",
                  icon: "cancel",
                  tone: "error",
                },
              ]}
            />
          ) : (
            <Skeleton width="100%" height="104px" radius="20px" />
          )}
        </section>

        <section className={styles.group}>
          <h3 className={`${styles.groupTitle} md-typescale-title-small`}>
            Business details
          </h3>
          <Card variant="outlined" padded={false} className={styles.list}>
            <InfoRow icon="call" label="Phone" value={profileData.phone} />
            <Divider />
            <InfoRow icon="mail" label="Email" value={profileData.email} />
            <Divider />
            <InfoRow
              icon="location_on"
              label="Address"
              value={profileData.address}
            />
            <Divider />
            <InfoRow
              icon="handyman"
              label="Specialty"
              value={profileData.specialty}
            />
          </Card>
        </section>

        <section className={styles.group}>
          <h3 className={`${styles.groupTitle} md-typescale-title-small`}>
            Settings
          </h3>
          <Card variant="outlined" padded={false} className={styles.list}>
            <ActionRow
              icon="edit"
              label="Edit business profile"
              onClick={() =>
                navigate("/app/profile/edit", {
                  state: { currentData: profileData },
                })
              }
            />
            <Divider />
            <div className={styles.actionRow}>
              <span className={styles.rowLeft}>
                <span className={styles.infoIcon}>
                  <Icon name="dark_mode" size={20} />
                </span>
                <span className="md-typescale-body-large">Dark theme</span>
              </span>
              <Switch
                selected={theme === "dark"}
                onChange={(e) =>
                  setTheme(e.target.selected ? "dark" : "light")
                }
                aria-label="Toggle dark theme"
              />
            </div>
          </Card>
        </section>

        <section className={styles.group}>
          <h3 className={`${styles.groupTitle} md-typescale-title-small`}>
            Security
          </h3>
          <Card variant="outlined" padded={false} className={styles.list}>
            <ActionRow
              icon="password"
              label="Change transfer PIN"
              onClick={() => setIsPinOpen(true)}
            />
          </Card>
        </section>

        <Button
          variant="outlined"
          full
          icon="logout"
          onClick={handleLogout}
          style={{
            "--md-outlined-button-label-text-color":
              "var(--md-sys-color-error)",
            "--md-outlined-button-icon-color": "var(--md-sys-color-error)",
            "--md-outlined-button-outline-color":
              "var(--md-sys-color-outline-variant)",
          }}
        >
          Log out
        </Button>
        <p className={`${styles.version} md-typescale-label-medium`}>
          Kostody Engineer · v1.0.0
        </p>
      </div>

      {isPinOpen && (
        <ChangePinSheet
          onClose={() => setIsPinOpen(false)}
          customerId={profileData.customerId}
          onSuccess={() => setIsPinOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;
