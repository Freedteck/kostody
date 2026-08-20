import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerProfile.module.css";
import CustomerEditSheet from "../../components/customerEdit/CustomerEdit";
import ChangePinSheet from "../../components/changePin/ChangePin";
import SuccessSheet from "../../components/successSheet/SuccessSheet";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("kostody_customer")) || {
      name: "Guest",
      phone: "",
      id: null,
    },
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("kostody_token");
    localStorage.removeItem("kostody_customer");
    navigate("/c/login");
  };

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1>Profile</h1>
      </div>

      <div className={styles.identityBlock}>
        <div className={styles.avatar}>{getInitials(userData.name)}</div>
        <div>
          <h2 className={styles.customerName}>{userData.name}</h2>
          <p className={styles.customerPhone}>{userData.phone}</p>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <h3 className={styles.groupTitle}>Account</h3>
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
              <span>Edit Profile</span>
            </div>
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
          </div>
          <div className={styles.listDivider}></div>
          <div className={styles.listItem} onClick={() => setIsPinOpen(true)}>
            <div className={styles.itemLeft}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              <span>Change Universal PIN</span>
            </div>
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
          </div>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <h3 className={styles.groupTitle}>Support</h3>
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
                  d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Help & Support</span>
            </div>
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
          </div>
        </div>
      </div>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Log Out
      </button>
      <p className={styles.versionText}>Kostody Customer App v1.0.0</p>

      {isEditOpen && (
        <CustomerEditSheet
          onClose={() => setIsEditOpen(false)}
          onSave={(newData) => {
            setUserData(newData);
            localStorage.setItem(
              "kostody_customer",
              JSON.stringify({ ...userData, ...newData }),
            );
            setIsEditOpen(false);
          }}
          currentData={userData}
          customerId={userData.id}
        />
      )}

      {isPinOpen && (
        <ChangePinSheet
          onClose={() => setIsPinOpen(false)}
          onSuccess={() => {
            setIsPinOpen(false);
            setIsSuccessOpen(true);
          }}
          customerId={userData.id}
        />
      )}

      {isSuccessOpen && (
        <SuccessSheet
          title="PIN Changed"
          message="Your Universal PIN has been updated successfully."
          onClose={() => setIsSuccessOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerProfile;
