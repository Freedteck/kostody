import { Link } from "react-router-dom";
import { Icon } from "../ui";
import styles from "./Footer.module.css";

const StoreCard = ({ role, desc, href }) => {
  return (
    <div className={styles.storeCard}>
      <div className={styles.storeText}>
        <span className={`${styles.storeRole} md-typescale-title-medium`}>
          {role}
        </span>
        <span className={`${styles.storeDesc} md-typescale-body-medium`}>
          {desc}
        </span>
      </div>
      <a
        className={styles.badge}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.badgeIcon}>
          <Icon name="play_arrow" filled size={22} />
        </span>
        <span className={styles.badgeText}>
          <small>OPEN ON</small>
          <strong>Google Play</strong>
        </span>
      </a>
    </div>
  );
};

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
      { label: "Contact", to: "/contact" },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="get-app" className={styles.footer}>
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.getAppHead}>
            <h2 className={`${styles.getAppTitle}`}>Two apps. One standard of proof.</h2>
            <p className={`${styles.getAppSub} md-typescale-body-large`}>
              Kostody is one identity across every shop. Pick your side to open
              the app.
            </p>
          </div>
          <div className={styles.stores}>
            <StoreCard
              role="For engineers"
              desc="Run your shop as a device clinic."
              href="/login"
            />
            <StoreCard
              role="For regular users"
              desc="Track and authorize every repair."
              href="/c/login"
            />
          </div>
        </div>

        <div className={styles.middle}>
          <Link to="/" className={styles.footBrand} aria-label="Kostody home">
            <span className={`${styles.footWord} md-typescale-title-large`}>
              Kostody
            </span>
            <span className={`${styles.footTag} md-typescale-body-small`}>
              Device repair, held in custody.
            </span>
          </Link>
          <nav className={styles.links} aria-label="Footer">
            {LINKS.map((col) => (
              <div key={col.title} className={styles.linkCol}>
                <span className={`${styles.linkTitle} md-typescale-label-large`}>
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

        <div className={`${styles.legal} md-typescale-body-small`}>
          <span>© {year} Kostody</span>
          <span className={styles.legalLinks}>
            <Link to="/about" className={styles.footLink}>
              Privacy
            </Link>
            <Link to="/about" className={styles.footLink}>
              Terms
            </Link>
          </span>
        </div>
      </div>

      <div className={styles.wordmark} aria-hidden="true">
        Kostody
      </div>
    </footer>
  );
};

export default Footer;
