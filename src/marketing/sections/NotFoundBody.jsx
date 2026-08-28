import { Link } from "react-router-dom";
import { Icon } from "../../ui";
import styles from "./NotFoundBody.module.css";

const OPTIONS = [
  {
    icon: "inventory_2",
    title: "Product Overview",
    desc: "See how the shared record works for both customers and engineers.",
    to: "/product",
  },
  {
    icon: "help_outline",
    title: "Help & Support",
    desc: "Find clear answers about PINs, quotes, intake photos, and shop custody.",
    to: "/help",
  },
  {
    icon: "info",
    title: "About Kostody",
    desc: "Read the convictions and refusals that guide our platform.",
    to: "/about",
  },
];

const NotFoundBody = () => {
  return (
    <section className={styles.body} aria-labelledby="wayfinding-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="wayfinding-title" className={styles.title}>
            Where to <em>go next.</em>
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            Every valid page on Kostody is listed on the record. Pick a destination
            below to get back on track.
          </p>
        </div>

        <ul className={styles.grid}>
          {OPTIONS.map((item) => (
            <li key={item.title}>
              <Link to={item.to} className={styles.card}>
                <span className={styles.badge}>
                  <Icon name={item.icon} size={24} />
                </span>
                <div className={styles.cardContent}>
                  <h3 className={`${styles.cardTitle} md-typescale-title-large`}>
                    {item.title}
                  </h3>
                  <p className={`${styles.desc} md-typescale-body-medium`}>
                    {item.desc}
                  </p>
                </div>
                <Icon name="arrow_forward" size={20} className={styles.arrow} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default NotFoundBody;
