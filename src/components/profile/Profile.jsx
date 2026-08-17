import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import ErrorState from "../errorState/ErrorState";
import useShop from "../../hooks/useShop";
import { getShopProfile, getShopStats } from "../../services/api";
import { Skeleton } from "../skeleton/Skeleton";
import ChangePinSheet from "../changePin/ChangePin";

const Profile = () => {
  const navigate = useNavigate();
  const { shopId } = useShop();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    if (!shopId) return;

    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      await getShopProfile(shopId)
        .then((data) => {
          setProfileData(data);
        })
        .catch(() => {
          setError("Failed to load profile details.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchProfileData();
  }, [shopId]);

  useEffect(() => {
    if (!shopId) return;

    const fetchStats = async () => {
      await getShopStats(shopId, period)
        .then((data) => {
          setStats(data);
        })
        .catch(() => {
          console.error("Failed to fetch stats");
        });
    };

    fetchStats();
  }, [shopId, period]);

  const handleLogout = () => {
    localStorage.removeItem("kostody_token");
    localStorage.removeItem("kostody_shop");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const chevron = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (isLoading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <h1>Profile</h1>
        </div>
        <div className={styles.identityBlock}>
          <Skeleton width="60px" height="60px" radius="50%" />
          <div>
            <Skeleton width="120px" height="1.3rem" radius="4px" />
            <div style={{ height: "5px" }}></div>
            <Skeleton width="80px" height="0.9rem" radius="4px" />
          </div>
        </div>
        <div style={{ height: "20px" }}></div>
        <Skeleton width="100%" height="80px" radius="12px" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profileContainer}>
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1>Profile</h1>
      </div>

      <div className={styles.identityBlock}>
        <div className={styles.avatar}>{getInitials(profileData.shopName)}</div>
        <div>
          <h2 className={styles.shopName}>{profileData.shopName}</h2>
          <p className={styles.engineerName}>{profileData.engineerName}</p>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.periodFilter}>
          <button
            className={`${styles.periodBtn} ${period === "week" ? styles.periodActive : ""}`}
            onClick={() => setPeriod("week")}
          >
            Week
          </button>
          <button
            className={`${styles.periodBtn} ${period === "month" ? styles.periodActive : ""}`}
            onClick={() => setPeriod("month")}
          >
            Month
          </button>
          <button
            className={`${styles.periodBtn} ${period === "year" ? styles.periodActive : ""}`}
            onClick={() => setPeriod("year")}
          >
            Year
          </button>
        </div>

        <div className={styles.statsBanner}>
          {stats ? (
            <>
              <div className={styles.statBox}>
                <span className={styles.statValue}>{stats.active}</span>
                <span className={styles.statLabel}>Active</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statBox}>
                <span className={styles.statValue} style={{ color: "#2ecc71" }}>
                  {stats.completed}
                </span>
                <span className={styles.statLabel}>Completed</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statBox}>
                <span className={styles.statValue} style={{ color: "#ff4d4d" }}>
                  {stats.cancelled}
                </span>
                <span className={styles.statLabel}>Cancelled</span>
              </div>
            </>
          ) : (
            <Skeleton width="100%" height="40px" radius="8px" />
          )}
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <h3 className={styles.groupTitle}>Business Details</h3>
        <div className={styles.listContainer}>
          <div className={styles.listItem}>
            <div className={styles.itemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 10H16M8 14H13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>{profileData.phone}</span>
            </div>
          </div>
          <div className={styles.listDivider}></div>
          <div className={styles.listItem}>
            <div className={styles.itemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4H20V16H4V4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M4 8H20M8 20H16M12 16V20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>{profileData.email}</span>
            </div>
          </div>
          <div className={styles.listDivider}></div>
          <div className={styles.listItem}>
            <div className={styles.itemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22C16.9706 22 21 17.9706 21 13C21 7.5 16 4 12 2C8 4 3 7.5 3 13C3 17.9706 7.02944 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M12 22V16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span>{profileData.address}</span>
            </div>
          </div>
          <div className={styles.listDivider}></div>
          <div className={styles.listItem}>
            <div className={styles.itemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14.7 6.3L17.7 9.3M4 20V17L13.3 7.7C13.6909 7.30915 14.3091 7.30915 14.7 7.7L16.3 9.3C16.6909 9.69085 16.6909 10.3091 16.3 10.7L7 20H4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{profileData.specialty}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <h3 className={styles.groupTitle}>Settings</h3>
        <div className={styles.listContainer}>
          <div
            className={styles.listItem}
            onClick={() =>
              navigate("/app/profile/edit", {
                state: { currentData: profileData },
              })
            }
          >
            <div className={styles.itemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 4H4V20H20V13M18.5 2.5C19.163 2.5 19.7989 2.76339 20.2678 3.23223C20.7366 3.70107 21 4.33696 21 5C21 5.65685 18.5 8 18.5 8C18.5 8 16 5.65685 16 5C16 4.33696 16.2634 3.70107 16.7322 3.23223C17.2011 2.76339 17.837 2.5 18.5 2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Edit Business Profile</span>
            </div>
            {chevron}
          </div>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <h3 className={styles.groupTitle}>Security</h3>
        <div className={styles.listContainer}>
          <div className={styles.listItem} onClick={() => setIsPinOpen(true)}>
            <div className={styles.itemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Change Transfer PIN</span>
            </div>
            {chevron}
          </div>
        </div>
      </div>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Log Out
      </button>
      <p className={styles.versionText}>Kostody Engineer App v1.0.0</p>

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
