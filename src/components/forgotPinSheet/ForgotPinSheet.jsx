import styles from "./ForgotPinSheet.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const ForgotPinSheet = ({ onClose }) => {
  return (
    <BottomSheet onClose={onClose} title="Forgot PIN">
      <div className={styles.container}>
        <p className={styles.instruction}>
          PIN reset is temporarily unavailable. Please ask the shop that holds
          your device to reset your PIN for you. We&apos;re working on
          re-enabling self-service reset soon.
        </p>
        <button type="button" className={styles.submitBtn} onClick={onClose}>
          Got it
        </button>
      </div>
    </BottomSheet>
  );
};

export default ForgotPinSheet;
