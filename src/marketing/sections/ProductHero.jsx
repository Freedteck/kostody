import mark from "../../assets/mark.png";
import board from "../../assets/dashboard-clinic-light-2x.png";
import customerDash from "../../assets/dashboard-customer-light-2x.png";
import { Icon, DeviceMockup } from "../../ui";
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
              meet on one record neither side can edit: here is what each side
              gets.
            </p>
          </div>

          <div className={styles.figure} aria-hidden="true">
            <DeviceMockup
              src={board}
              alt="The engineer active jobs board on iPhone 12"
              className={styles.back}
            />
            <DeviceMockup
              src={customerDash}
              alt="The customer live repair tracking dashboard on iPhone 12"
              className={styles.front}
            />
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
