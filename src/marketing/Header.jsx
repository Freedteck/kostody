import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, IconButton } from "../ui";
import logoMark from "../assets/logo-mark.png";
import styles from "./Header.module.css";

const NAV = [
  { to: "/product", label: "Product" },
  { to: "/about", label: "About" },
  { to: "/help", label: "Help & Support" },
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

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goToGetApp = () => {
    setMenuOpen(false);
    const el = document.getElementById("get-app");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const linkClass = ({ isActive }) =>
    `${styles.link} md-typescale-label-large ${isActive ? styles.active : ""}`;

  return (
    <header className={styles.headerWrapper}>
      {/* Top Navbar Bar */}
      <div className={`${styles.bar} ${scrolled ? styles.scrolled : ""}`}>
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
              icon="menu"
              label="Open menu"
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Full-viewport Backdrop for Mobile Drawer */}
      <div
        className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Right to Left Full-Height Mobile Drawer */}
      <aside
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-label="Mobile navigation"
      >
        <div className={styles.drawerHeader}>
          <Link to="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
            <img src={logoMark} alt="Kostody logo" className={styles.drawerLogo} />
            <span className={`${styles.word} md-typescale-title-medium`}>
              Kostody
            </span>
          </Link>
          <IconButton
            icon="close"
            label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        <nav className={styles.drawerNav}>
          {NAV.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={{ "--i": index }}
              className={({ isActive }) =>
                `${styles.drawerLink} md-typescale-title-medium ${
                  isActive ? styles.drawerLinkActive : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.drawerFooter}>
          <Button
            variant="filled"
            icon="download"
            onClick={goToGetApp}
            className={styles.drawerCta}
          >
            Download
          </Button>
        </div>
      </aside>
    </header>
  );
};

export default Header;
