import Icon from "./Icon";
import Button from "./Button";
import styles from "./ErrorState.module.css";

const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load this right now. Please try again.",
  onRetry,
  retryLabel = "Try again",
}) => (
  <div className={styles.error}>
    <div className={styles.badge}>
      <Icon name="error" size={32} />
    </div>
    <h3 className={`${styles.title} md-typescale-title-medium`}>{title}</h3>
    <p className={`${styles.message} md-typescale-body-medium`}>{message}</p>
    {onRetry && (
      <div className={styles.action}>
        <Button variant="tonal" icon="refresh" onClick={onRetry}>
          {retryLabel}
        </Button>
      </div>
    )}
  </div>
);

export default ErrorState;
