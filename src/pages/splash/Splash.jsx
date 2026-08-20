import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Splash.module.css";
import mark from "../../assets/mark.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const shopData = localStorage.getItem("kostody_shop");
      const customerData = localStorage.getItem("kostody_customer");

      if (shopData) {
        navigate("/app/dashboard");
      } else if (customerData) {
        navigate("/c/dashboard");
      } else {
        navigate("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splashContainer}>
      <div className={styles.logoWrapper}>
        <img src={mark} alt="Kostody" className={styles.logoMark} />
      </div>
      <p className={styles.tagline}>Device Repair Chain of Custody</p>
    </div>
  );
};

export default Splash;
