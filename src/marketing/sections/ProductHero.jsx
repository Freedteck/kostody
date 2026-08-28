import mark from "../../assets/mark.png";
import board from "../../assets/dashboard-clinic.png";
import proof from "../../assets/hero-proof.png";
import { Icon } from "../../ui";
import styles from "./ProductHero.module.css";

const STRIP = [
  { label: "The engineer's app", icon: "handyman" },
  { label: "One shared record", icon: "verified_user", key: true },
  { label: "The customer's app", icon: "person" },
];

const ProductHero = () => {
  return (
    <section className={styles.hero} aria-labelledby="product-hero-title">
      <img src={mark} alt="" aria-hidden="true" className={styles.mark} />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.copy}>
            <h1 id="product-hero-title" className={styles.headline}>
              Two apps. One record. <em>Both sides of the counter.</em>
            </h1>
            <p className={`${styles.para} md-typescale-body-large`}>
              The engineer runs the repair. The customer follows it live. Both
              meet on one record neither side can edit - here's what each side
              gets.
            </p>
          </div>

          <div className={styles.figure} aria-hidden="true">
            <div className={`${styles.device} ${styles.back}`}>
              <div className={styles.screen}>
                <img src={board} alt="" loading="lazy" />
              </div>
            </div>
            <div className={`${styles.device} ${styles.front}`}>
              <div className={styles.screen}>
                <img src={proof} alt="" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        <ol className={styles.strip} aria-label="Two apps, one shared record">
          {STRIP.map((item) => (
            <li
              key={item.label}
              className={`${styles.node} ${item.key ? styles.nodeKey : ""}`}
            >
              <span className={styles.dot}>
                <Icon name={item.icon} filled size={18} />
              </span>
              <span className={`${styles.nodeLabel} md-typescale-title-small`}>
                {item.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProductHero;
