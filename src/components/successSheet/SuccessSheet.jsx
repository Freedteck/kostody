import styles from "./SuccessSheet.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const SuccessSheet = ({ title, message, onClose }) => {
  return (
    <BottomSheet onClose={onClose} title={title}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          {/* Clean SVG Checkmark */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className={styles.message}>{message}</p>

        <button className={styles.doneBtn} onClick={onClose}>
          Done
        </button>
      </div>
    </BottomSheet>
  );
};

export default SuccessSheet;
