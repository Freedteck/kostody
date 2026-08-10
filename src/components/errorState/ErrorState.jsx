import styles from "./ErrorState.module.css";

const ErrorState = ({ message }) => {
  return (
    <div className={styles.container}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 8V12M12 16H12.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <h3 className={styles.title}>Something went wrong</h3>
      <p className={styles.message}>
        {message || "Failed to load data. Please try again."}
      </p>
    </div>
  );
};

export default ErrorState;
