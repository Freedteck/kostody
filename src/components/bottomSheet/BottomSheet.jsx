import styles from "./BottomSheet.module.css";

const BottomSheet = ({ onClose, title, children }) => {
  return (
    <>
      <div
        className={`${styles.overlay}`}
        onClick={onClose}
      ></div>
      <div className={`${styles.sheet}`}>
        <div className={styles.handle}></div>
        {title && <h2 className={styles.sheetTitle}>{title}</h2>}
        {children}
      </div>
    </>
  );
};

export default BottomSheet;
