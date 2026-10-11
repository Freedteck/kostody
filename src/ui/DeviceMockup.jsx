import styles from "./DeviceMockup.module.css";

/**
 * Authentic iPhone 12 Device Mockup Component
 * Features:
 * - Precision flat aluminum chassis with chamfered edge highlights
 * - Classic iPhone 12 Notch with TrueDepth camera and speaker earpiece
 * - Hardware side buttons (Ring/Silent switch, Volume Up/Down, Side button)
 * - Photorealistic contact floor shadow
 * - Subtle, distortion-free perspective options (no exaggerated/wogowogo angles)
 */
const DeviceMockup = ({
  src,
  alt = "App interface preview on iPhone 12",
  variant = "upright", // 'upright' | 'gentle-left' | 'gentle-right' | 'counter-dock' | 'rotate-3d'
  objectPosition = "top center",
  className = "",
  loading = "lazy",
}) => {
  return (
    <div
      className={`${styles.mockupWrapper} ${styles[variant] || styles.upright} ${className}`}
      aria-hidden="true"
    >
      {/* Physical iPhone 12 Hardware Body */}
      <div className={styles.chassis}>
        {/* Hardware Side Buttons */}
        <span className={`${styles.button} ${styles.btnMute}`} title="Silent switch" />
        <span className={`${styles.button} ${styles.btnVolUp}`} title="Volume up" />
        <span className={`${styles.button} ${styles.btnVolDown}`} title="Volume down" />
        <span className={`${styles.button} ${styles.btnPower}`} title="Power button" />

        {/* Top Speaker Earpiece Slit (Above the notch) */}
        <div className={styles.earpiece} />

        {/* Inner Screen Bezel */}
        <div className={styles.innerBezel}>
          {/* Classic iPhone 12 Notch */}
          <div className={styles.notch}>
            <span className={styles.cameraLens} />
            <span className={styles.sensor} />
          </div>

          {/* Screen Display Area */}
          <div className={styles.screen}>
            <img
              src={src}
              alt={alt}
              loading={loading}
              className={styles.screenshot}
              style={{ objectPosition }}
            />
            {/* Subtle Studio Glass Reflection */}
            <div className={styles.glassReflection} />
          </div>
        </div>
      </div>

      {/* Realistic Ground Contact Shadow */}
      <div className={styles.floorShadow} />
    </div>
  );
};

export default DeviceMockup;
