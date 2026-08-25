import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "../../ui";
import mark from "../../assets/mark.png";
import styles from "./Splash.module.css";

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
    <div className={styles.container}>
      <div className={styles.brand}>
        <img src={mark} alt="Kostody" className={styles.logo} />
        <p className={`${styles.tagline} md-typescale-title-medium`}>
          Device Repair Chain of Custody
        </p>
      </div>
      <CircularProgress indeterminate className={styles.spinner} />
    </div>
  );
};

export default Splash;
