import styles from "./Skeleton.module.css";

export const Skeleton = ({ width, height, radius }) => (
  <div
    className={styles.skeleton}
    style={{ width, height, borderRadius: radius }}
  ></div>
);
