import { Icon } from "../../ui";
import styles from "./Distrust.module.css";

const CUSTOMER = [
  {
    icon: "request_quote",
    fear: "Will the price they quoted hold, or creep up by the time I collect it?",
  },
  {
    icon: "lock",
    fear: "Is my personal data, banking, and messages safe while it is sitting in the back?",
  },
  {
    icon: "policy",
    fear: "If it comes back with a new crack or missing part, can I prove it was not there?",
  },
];

const ENGINEER = [
  {
    icon: "gavel",
    fear: "Will they hold me liable for pre-existing liquid damage once the device is opened?",
  },
  {
    icon: "inventory_2",
    fear: "Will they accuse me of losing a SIM card, memory card, or battery they never left?",
  },
  {
    icon: "schedule",
    fear: "Will they abandon the device for months and demand the old quote after parts prices surge?",
  },
];

const Distrust = () => {
  return (
    <section className={styles.distrust} aria-labelledby="distrust-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="distrust-title" className={styles.title}>
            Before Kostody, every repair is a leap of faith.
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            You hand a device that holds your messages, your photos and your
            bank app to someone you met ten minutes ago - on a price they said
            out loud - and hope. They take it in with no proof of what they
            received. Both sides are exposed, so both sides quietly worry.
          </p>
        </div>

        <div className={styles.clash}>
          <div className={styles.seam} aria-hidden="true">
            <span className={styles.seamIcon}>
              <Icon name="link_off" size={20} />
            </span>
          </div>

          <div className={`${styles.column} ${styles.customer}`}>
            <span className={`${styles.voice} md-typescale-label-large`}>
              <Icon name="person" size={18} />
              What the customer fears
            </span>
            <ul className={styles.fears}>
              {CUSTOMER.map((item) => (
                <li key={item.fear} className={styles.fear}>
                  <span className={styles.fearIcon}>
                    <Icon name={item.icon} size={20} />
                  </span>
                  <p className={`${styles.fearText} md-typescale-title-small`}>
                    {item.fear}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.column} ${styles.engineer}`}>
            <span className={`${styles.voice} md-typescale-label-large`}>
              <Icon name="handyman" size={18} />
              What the engineer fears
            </span>
            <ul className={styles.fears}>
              {ENGINEER.map((item) => (
                <li key={item.fear} className={styles.fear}>
                  <span className={styles.fearIcon}>
                    <Icon name={item.icon} size={20} />
                  </span>
                  <p className={`${styles.fearText} md-typescale-title-small`}>
                    {item.fear}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={`${styles.turn} md-typescale-title-medium`}>
          Neither side is lying. There's just no shared proof - so weeks later,
          the louder memory wins. <em>That gap is the whole reason Kostody
          exists.</em>
        </p>
      </div>
    </section>
  );
};

export default Distrust;
