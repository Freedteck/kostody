import { Icon } from "../../ui";
import styles from "./Convictions.module.css";

const CONVICTIONS = [
  {
    icon: "fingerprint",
    lead: "Your identity is",
    accent: "yours",
    tail: ", not the shop's.",
    decision:
      "One phone number is your account across every shop on Kostody. No storefront owns your history - you carry it from counter to counter.",
  },
  {
    icon: "handshake",
    lead: "The record belongs to",
    accent: "both",
    tail: " of you.",
    decision:
      "The engineer writes each step; you watch it land live. Neither side can quietly edit what's already written down.",
  },
  {
    icon: "pin",
    lead: "Nothing happens without",
    accent: "your yes",
    tail: ".",
    decision:
      "Your 4-digit PIN - held by you, never the shop - gates every agreement. No PIN, no repair, no exceptions.",
  },
  {
    icon: "sell",
    lead: "The price is the",
    accent: "price",
    tail: ".",
    decision:
      "The quote you approve is the amount you pay. It's locked the moment you sign - it can't drift upward by the time you collect.",
  },
];

const Convictions = () => {
  return (
    <section className={styles.convictions} aria-labelledby="convictions-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="convictions-title" className={styles.title}>
            What we stand for.
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            Four convictions. Each one is a line in the product you can point to
            - not a value on a wall.
          </p>
        </div>

        <ol className={styles.list}>
          {CONVICTIONS.map((c, i) => (
            <li key={c.accent} className={styles.item}>
              <span className={`${styles.index} md-typescale-label-large`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={styles.body}>
                <p className={styles.statement}>
                  <span className={styles.stIcon}>
                    <Icon name={c.icon} size={26} />
                  </span>
                  {c.lead} <em>{c.accent}</em>
                  {c.tail}
                </p>
                <p className={`${styles.decision} md-typescale-body-large`}>
                  {c.decision}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Convictions;
