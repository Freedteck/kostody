import Icon from "./Icon";
import styles from "./EmptyState.module.css";

const EmptyState = ({ icon = "inbox", title, message, action }) => (
  <div className={styles.empty}>
    <div className={styles.badge}>
      <Icon name={icon} size={32} />
    </div>
    {title && <h3 className={`${styles.title} md-typescale-title-medium`}>{title}</h3>}
    {message && (
      <p className={`${styles.message} md-typescale-body-medium`}>{message}</p>
    )}
    {action && <div className={styles.action}>{action}</div>}
  </div>
);

export default EmptyState;
