import BottomSheet from "../bottomSheet/BottomSheet";
import styles from "./ConfirmCancel.module.css";

const ConfirmCancel = ({ onConfirm, onClose }) => {
  return (
    <BottomSheet onClose={onClose} title="Cancel Job?">
      <div>
        <p className={styles.sheetText}>
          Are you sure you want to cancel this job? This action cannot be
          undone.
        </p>
        <div className={styles.buttonRow}>
          <button className={styles.btnDecline} onClick={onClose}>
            Keep Job
          </button>
          <button className={styles.btnAccept} onClick={onConfirm}>
            Yes, Cancel
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default ConfirmCancel;
