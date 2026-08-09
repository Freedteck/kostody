import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import EditProfile from "../editProfile/EditProfile";

const initialProfileData = {
  shopName: "TechFix Clinic",
  engineerName: "Engr. Chidi O.",
  shopPhone: "0801 234 5678",
  email: "techfix@kostody.com",
  shopAddress: "Computer Village, Ikeja",
  specialty: "General Repairs",
};

const mockFinancials = {
  totalRevenue: 1250000,
  outstandingDebts: 45000,
  cashInHand: 150000,
};

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleLogout = () => navigate("/login");

  const handleSave = (newData) => {
    setProfileData(newData);
    setIsEditOpen(false);
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

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1>Profile</h1>
      </div>

      {/* Identity Block */}
      <div className={styles.identityBlock}>
        <div className={styles.avatar}>{getInitials(profileData.shopName)}</div>
        <div>
          <h2 className={styles.shopName}>{profileData.shopName}</h2>
          <p className={styles.engineerName}>{profileData.engineerName}</p>
        </div>
      </div>

      {/* Financial Snapshot (Horizontal Banner) */}
      <div className={styles.financialBanner}>
        <div className={styles.finStat}>
          <span className={styles.finValue}>
            ₦{mockFinancials.totalRevenue.toLocaleString()}
          </span>
          <span className={styles.finLabel}>Revenue</span>
        </div>
        <div className={styles.finDivider}></div>
        <div className={styles.finStat}>
          <span className={styles.finValue} style={{ color: "#ff4d4d" }}>
            ₦{mockFinancials.outstandingDebts.toLocaleString()}
          </span>
          <span className={styles.finLabel}>Debts</span>
        </div>
        <div className={styles.finDivider}></div>
        <div className={styles.finStat}>
          <span className={styles.finValue} style={{ color: "#2ecc71" }}>
            ₦{mockFinancials.cashInHand.toLocaleString()}
          </span>
          <span className={styles.finLabel}>Cash</span>
        </div>
      </div>

      {/* Business Details Group */}
      <div className={styles.settingsGroup}>
        <h3 className={styles.groupTitle}>Business Details</h3>
        <div className={styles.listContainer}>
          <div className={styles.listItem}>
            <div className={styles.itemLeft}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              <span>{profileData.shopPhone}</span>
            </div>
          </div>
          <div className={styles.listDivider}></div>
          <div className={styles.listItem}>
            <div className={styles.itemLeft}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C16.9706 22 21 17.9706 21 13C21 7.5 16 4 12 2C8 4 3 7.5 3 13C3 17.9706 7.02944 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M12 22V16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span>{profileData.shopAddress}</span>
            </div>
          </div>
          <div className={styles.listDivider}></div>
          <div className={styles.listItem}>
            <div className={styles.itemLeft}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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

      {/* Settings Group */}
      <div className={styles.settingsGroup}>
        <h3 className={styles.groupTitle}>Settings</h3>
        <div className={styles.listContainer}>
          <div className={styles.listItem} onClick={() => setIsEditOpen(true)}>
            <div className={styles.itemLeft}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Log Out
      </button>
      <p className={styles.versionText}>Kostody Engineer App v1.0.0</p>

      {isEditOpen && (
        <EditProfile
          onClose={() => setIsEditOpen(false)}
          onSave={handleSave}
          currentData={profileData}
        />
      )}
    </div>
  );
};

export default Profile;
