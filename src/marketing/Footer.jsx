import { Link } from "react-router-dom";
import { Icon } from "../ui";
import useTheme from "../hooks/useTheme";
import mark from "../assets/mark.png";
import styles from "./Footer.module.css";

const LINKS = [
  {
    title: "Product",
    items: [
      { label: "Overview", to: "/product" },
      { label: "For engineers", to: "/product" },
      { label: "For customers", to: "/product" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", to: "/about" },
      { label: "Help & Support", to: "/help" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer id="get-app" className={styles.footer}>
      <span className={styles.watermark} aria-hidden="true">
        Kostody
      </span>

      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.rail}>
            <img src={mark} alt="Kostody" className={styles.railMark} />
            <img
              src={mark}
              alt=""
              aria-hidden="true"
              className={styles.railMarkSmall}
            />
          </div>

          <div className={styles.main}>
            <div className={styles.lead}>
              <h2 className={styles.leadTitle}>
                Proof at every step, for every repair in Nigeria.
              </h2>
              <div className={styles.ctas}>
                <a
                  className={styles.ctaPrimary}
                  href="/login"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="handyman" size={20} />
                  Open the engineer app
                </a>
                <a
                  className={styles.ctaTonal}
                  href="/c/login"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="person" size={20} />
                  Open the customer app
                </a>
              </div>
            </div>

            <nav className={styles.nav} aria-label="Footer">
              {LINKS.map((col) => (
                <div key={col.title} className={styles.linkCol}>
                  <span
                    className={`${styles.linkTitle} md-typescale-label-large`}
                  >
                    {col.title}
                  </span>
                  {col.items.map((item, i) => (
                    <Link
                      key={`${item.label}-${i}`}
                      to={item.to}
                      className={`${styles.footLink} md-typescale-body-medium`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className={styles.legalRow}>
          <button
            type="button"
            className={`${styles.themeToggle} md-typescale-label-large`}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            <Icon name={isDark ? "light_mode" : "dark_mode"} size={18} />
            {isDark ? "Light" : "Dark"}
          </button>
          <p className={`${styles.legal} md-typescale-body-small`}>
            © {year} Kostody · Made in Nigeria
          </p>
        </div>
      </div>

      <button
        type="button"
        className={styles.toTop}
        onClick={toTop}
        aria-label="Back to top"
      >
        <Icon name="arrow_upward" size={22} />
      </button>
    </footer>
  );
};

export default Footer;
