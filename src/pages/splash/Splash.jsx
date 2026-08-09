import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Splash.module.css";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait 2 seconds, then go to login
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splashContainer}>
      <div className={styles.logoWrapper}>
        <h1 className={styles.logoText}>Kostody</h1>
        <div className={styles.underline}></div>
      </div>
      <p className={styles.tagline}>Device Repair Chain of Custody</p>
    </div>
  );
};

export default Splash;
