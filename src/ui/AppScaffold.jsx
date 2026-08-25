import { useLocation, useNavigate } from "react-router-dom";
import useBreakpoint from "../hooks/useBreakpoint";
import Icon from "./Icon";
import styles from "./AppScaffold.module.css";

const isActive = (pathname, to) =>
  pathname === to || pathname.startsWith(`${to}/`);

const NavItem = ({ item, active, rail, onClick }) => (
  <button
    type="button"
    className={`${styles.navItem} ${rail ? styles.railItem : ""} ${
      active ? styles.active : ""
    }`}
    onClick={onClick}
    aria-current={active ? "page" : undefined}
  >
    <span className={styles.indicator}>
      <Icon
        name={active && item.filledIcon ? item.filledIcon : item.icon}
        filled={active}
        size={24}
      />
      {item.badge ? (
        <span className={styles.badge}>
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      ) : null}
    </span>
    <span className={`${styles.navLabel} md-typescale-label-medium`}>
      {item.label}
    </span>
  </button>
);

const AppScaffold = ({
  nav = [],
  header,
  children,
  fab,
  detail,
  hideNav = false,
  contentClassName = "",
}) => {
  const { isExpanded } = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();

  const rail = isExpanded && !hideNav && nav.length > 0;
  const showBar = !isExpanded && !hideNav && nav.length > 0;
  const twoPane = detail && isExpanded;

  const items = nav.map((item) => ({
    ...item,
    isOn: isActive(location.pathname, item.to),
  }));

  const renderNav = (asRail) => (
    <nav className={asRail ? styles.rail : styles.bar} aria-label="Primary">
      {asRail && fab && <div className={styles.railFab}>{fab}</div>}
      <div className={asRail ? styles.railItems : styles.barItems}>
        {items.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            active={item.isOn}
            rail={asRail}
            onClick={() => !item.isOn && navigate(item.to)}
          />
        ))}
      </div>
    </nav>
  );

  return (
    <div className={`${styles.root} ${rail ? styles.hasRail : ""}`}>
      {rail && renderNav(true)}
      <div className={`${styles.frame} ${showBar ? styles.withBar : ""}`}>
        {header}
        <div className={`${styles.body} ${twoPane ? styles.twoPane : ""}`}>
          <main className={`${styles.content} ${contentClassName}`}>
            {children}
          </main>
          {twoPane && <aside className={styles.detail}>{detail}</aside>}
        </div>
        {showBar && renderNav(false)}
      </div>
      {fab && !rail && (
        <div className={`${styles.fabWrap} ${showBar ? styles.fabAboveBar : ""}`}>
          {fab}
        </div>
      )}
    </div>
  );
};

export default AppScaffold;
