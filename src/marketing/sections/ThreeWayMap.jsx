import { Icon } from "../../ui";
import styles from "./ThreeWayMap.module.css";

const ENTITIES = [
  {
    index: "01",
    icon: "history",
    name: "The Record",
    role: "Answers 'what happened'",
    lead: "Answers",
    accent: "what happened",
    tail: " with zero room to rewrite.",
    desc: "Your repair timeline cannot be edited or erased. Every quote, photo, and status update is saved with the time it happened. When you need to know what was agreed, or when the work was done, the record is the one answer everyone trusts.",
  },
  {
    index: "02",
    icon: "storefront",
    name: "Your Shop",
    role: "Answers device questions",
    lead: "Holds your",
    accent: "physical device",
    tail: " and does the work.",
    desc: "The shop physically has your phone or laptop. They find the fault, set the price, and do the repair. Kostody is not a middleman and does not fix devices. Anything about the device itself is between you and the shop.",
  },
  {
    index: "03",
    icon: "shield",
    name: "Kostody",
    role: "Keeps your account safe",
    lead: "Protects your",
    accent: "PIN & history",
    tail: " across every shop.",
    desc: "We build and run the app that keeps your shared history locked. We keep your 4-digit PIN scrambled so no one can read it, and we make sure no shop can quietly rewrite what happened. We do not set prices, do repairs, or answer questions about your device.",
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
                <h3 className={styles.headline}>
                  {item.lead} <em>{item.accent}</em>
                  {item.tail}
                </h3>
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
