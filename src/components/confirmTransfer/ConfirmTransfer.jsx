import BottomSheet from "../bottomSheet/BottomSheet";
import styles from "./ConfirmTransfer.module.css";

const ConfirmTransfer = ({ onAccept, onDecline, title, onClose }) => {
  return (
    <BottomSheet onClose={onClose} title={title}>
      <div>
        <p className={styles.sheetText}>
          Engr. Alaba has logged a job and is waiting for you to confirm receipt
          of the device. By accepting, you confirm the device is physically in
          your possession.
        </p>
        <div className={styles.buttonRow}>
          <button className={styles.btnDecline} onClick={onDecline}>
            Decline
          </button>
          <button className={styles.btnAccept} onClick={onAccept}>
            Accept
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default ConfirmTransfer;
