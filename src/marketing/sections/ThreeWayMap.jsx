import { Icon } from "../../ui";
import styles from "./ThreeWayMap.module.css";

const ENTITIES = [
  {
    index: "01",
    icon: "history",
    name: "The Record",
    role: "Answers 'what happened'",
    headline: "Answers <em>what happened</em> with zero room to rewrite.",
    desc: "Your repair timeline is tamper-proof. Every quote, condition photo, and status update is logged with a clock on it. When you need to know what was agreed to or when work finished, the record is the only source of truth.",
  },
  {
    index: "02",
    icon: "storefront",
    name: "Your Shop",
    role: "Answers device questions",
    headline: "Holds your <em>physical device</em> and does the work.",
    desc: "The shop has physical custody of your phone or laptop. They diagnose faults, set quotes, and carry out repairs. Kostody is not a middleman or support desk for repair work. Anything about the hardware is between you and the shop.",
  },
  {
    index: "03",
    icon: "shield",
    name: "Kostody",
    role: "Handles the account layer",
    desc: "We build and maintain the platform that locks the shared history. We protect your 4-digit PIN, keep the timeline tamper-proof, and verify registered shops. We don't set prices, manage repairs, or take phone calls about hardware.",
    headline: "Protects your <em>PIN & history</em> across every shop.",
  },
];

const ThreeWayMap = () => {
  return (
    <section className={styles.mapSection} aria-labelledby="three-way-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="three-way-title" className={styles.title}>
            Where help actually <em>comes from.</em>
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            To know who to ask, you first need to know who controls what.
            Kostody is built on a three-way split that keeps everyone honest.
          </p>
        </div>

        <div className={styles.grid}>
          {ENTITIES.map((item, i) => (
            <div key={item.name} className={styles.column} style={{ "--col-index": i }}>
              <div className={styles.colHeader}>
                <span className={`${styles.index} md-typescale-label-large`}>
                  {item.index}
                </span>
                <span className={styles.badge}>
                  <Icon name={item.icon} size={22} />
                </span>
              </div>

              <div className={styles.colBody}>
                <span className={`${styles.role} md-typescale-label-large`}>
                  {item.role}
                </span>
                <h3
                  className={styles.headline}
                  dangerouslySetInnerHTML={{ __html: item.headline }}
                />
                <p className={`${styles.desc} md-typescale-body-large`}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeWayMap;
