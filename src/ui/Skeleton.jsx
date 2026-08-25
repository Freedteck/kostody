import styles from "./Skeleton.module.css";

const Skeleton = ({
  width = "100%",
  height = "16px",
  radius = "8px",
  className = "",
  style,
}) => (
  <span
    className={`${styles.skeleton} ${className}`}
    style={{ width, height, borderRadius: radius, ...style }}
    aria-hidden="true"
  />
);

export default Skeleton;
