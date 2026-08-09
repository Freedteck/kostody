import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear mock auth and go to login
    navigate("/login");
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1>Profile</h1>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatar}>TF</div>
        <h2 className={styles.shopName}>TechFix Clinic</h2>
        <p className={styles.engineerName}>Engr. Chidi O.</p>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Shop Phone</span>
          <span className={styles.detailValue}>0801 234 5678</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Email</span>
          <span className={styles.detailValue}>techfix@kostody.com</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Address</span>
          <span className={styles.detailValue}>Computer Village, Ikeja</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Specialty</span>
          <span className={styles.detailValue}>General Repairs</span>
        </div>
      </div>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Profile;
