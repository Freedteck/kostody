import { Icon } from "../../ui";
import styles from "./Refusals.module.css";

const REFUSALS = [
  {
    icon: "edit_off",
    title: "No editable history.",
    reason:
      "Once a step is on the record, no one rewrites it - not the shop, not us. A history you can edit is just a rumor with a timestamp.",
  },
  {
    icon: "money_off",
    title: "No hidden prices.",
    reason:
      "There is no fee that quietly appears at pickup. If it wasn't in the quote you approved, you don't pay it.",
  },
  {
    icon: "no_accounts",
    title: "No shop-owned accounts.",
    reason:
      "A shop can't create, hold or close your account. Your identity is tied to your phone, never to their storefront.",
  },
  {
    icon: "block",
    title: 'No "just trust me."',
    reason:
      "Every claim points back to a time-stamped record. On Kostody, trust is the output - never the thing we ask of you up front.",
  },
];

const Refusals = () => {
  return (
    <section className={styles.refusals} aria-labelledby="refusals-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="refusals-title" className={styles.title}>
            What we <em>won't</em> build.
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            A trust product is defined as much by its refusals as its features.
            These four would be easy to ship - and each one would quietly break
            the record. So we don't.
          </p>
        </div>

        <ul className={styles.grid}>
          {REFUSALS.map((r) => (
            <li key={r.title} className={styles.card}>
              <span className={styles.badge}>
                <Icon name={r.icon} size={24} />
              </span>
              <h3 className={`${styles.cardTitle} md-typescale-title-large`}>
                {r.title}
              </h3>
              <p className={`${styles.reason} md-typescale-body-medium`}>
                {r.reason}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Refusals;
