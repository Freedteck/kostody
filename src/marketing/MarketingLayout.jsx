import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./MarketingLayout.module.css";

const MarketingLayout = () => {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
