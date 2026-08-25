import Icon from "./Icon";
import styles from "./StatBanner.module.css";

const StatBanner = ({ stats = [], className = "" }) => (
  <div className={`${styles.grid} ${className}`}>
    {stats.map((s, i) => (
      <div key={i} className={`${styles.tile} ${styles[s.tone || "neutral"]}`}>
        {s.icon && <Icon name={s.icon} size={22} className={styles.icon} />}
        <span className={`${styles.value} md-typescale-headline-small`}>
          {s.value}
        </span>
        <span className={`${styles.label} md-typescale-label-medium`}>
          {s.label}
        </span>
      </div>
    ))}
  </div>
);

export default StatBanner;
