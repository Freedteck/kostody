import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, IconButton } from "../ui";
import logoMark from "../assets/logo-mark.png";
import styles from "./Header.module.css";

const NAV = [
  { to: "/product", label: "Product" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToGetApp = () => {
    setMenuOpen(false);
    const el = document.getElementById("get-app");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const linkClass = ({ isActive }) =>
    `${styles.link} md-typescale-label-large ${isActive ? styles.active : ""}`;

  return (
    <header
      className={`${styles.bar} ${scrolled ? styles.scrolled : ""} ${menuOpen ? styles.open : ""}`}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/" className={styles.brand} aria-label="Kostody home">
            <img src={logoMark} alt="Kostody" className={styles.logo} />
            <span className={`${styles.word} md-typescale-title-medium`}>
              Kostody
            </span>
          </Link>
          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={styles.right}>
          <Button
            variant="filled"
            icon="download"
            onClick={goToGetApp}
            className={styles.cta}
          >
            Download
          </Button>
          <IconButton
            className={styles.menuBtn}
            icon={menuOpen ? "close" : "menu"}
            label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          />
        </div>
      </div>

      <div className={styles.sheet} hidden={!menuOpen}>
        <nav className={styles.sheetNav} aria-label="Mobile">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={`${styles.sheetLink} md-typescale-title-medium`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
