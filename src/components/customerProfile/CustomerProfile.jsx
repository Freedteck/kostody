import { Link } from "react-router-dom";
import styles from "./CustomerProfile.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const CustomerProfile = ({ onClose, customer }) => {
  if (!customer) return null;

  return (
    <BottomSheet onClose={onClose} title="Customer Profile">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.avatar}>{customer.name.charAt(0)}</div>
          <div>
            <h2 className={styles.name}>{customer.name}</h2>
            <p className={styles.phone}>{customer.phone}</p>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{customer.jobs.length}</span>
            <span className={styles.statLabel}>Total Repairs</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue}>
              ₦{customer.totalSpent.toLocaleString()}
            </span>
            <span className={styles.statLabel}>Lifetime Value</span>
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Repair History</h3>
        <div className={styles.jobList}>
          {customer.jobs.map((job) => (
            <Link
              key={job.id}
              to={`/app/job/${job.id}`}
              className={styles.jobCard}
              onClick={onClose}
            >
              <div className={styles.jobHeader}>
                <span className={styles.device}>{job.device}</span>
                <span className={styles.date}>{job.date}</span>
              </div>
              <p className={styles.fault}>{job.fault}</p>
              <div className={styles.jobFooter}>
                <span className={styles.price}>
                  ₦{job.price.toLocaleString()}
                </span>
                <span className={styles.status}>Completed</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomerProfile;
