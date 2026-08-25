import styles from "./FabDock.module.css";

const FabDock = ({ children, className = "" }) => (
  <div className={`${styles.dock} ${className}`}>{children}</div>
);

export default FabDock;
