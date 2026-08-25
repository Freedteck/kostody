import styles from "./TopAppBar.module.css";

const TopAppBar = ({
  variant = "small",
  title,
  subtitle,
  leading,
  actions,
  className = "",
}) => {
  const large = variant === "large";
  const center = variant === "center";

  return (
    <header className={`${styles.bar} ${styles[variant]} ${className}`}>
      <div className={styles.row}>
        {leading && <div className={styles.leading}>{leading}</div>}
        {!large && (
          <div
            className={`${styles.titles} ${center ? styles.centerTitles : ""}`}
          >
            <h1 className={`${styles.title} md-typescale-title-large`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`${styles.subtitle} md-typescale-label-medium`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {large && (
        <div className={styles.largeHead}>
          <h1 className={`${styles.largeTitle} md-typescale-headline-medium`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`${styles.subtitle} md-typescale-body-medium`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </header>
  );
};

export default TopAppBar;
