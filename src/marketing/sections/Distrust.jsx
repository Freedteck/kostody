import { Icon } from "../../ui";
import styles from "./Distrust.module.css";

const CUSTOMER = [
  {
    icon: "request_quote",
    fear: "Will the price they said hold, or creep up by the time I collect it?",
  },
  {
    icon: "lock",
    fear: "Is everything on my phone safe while it's sitting in the back?",
  },
  {
    icon: "policy",
    fear: "If it comes back with a new crack, can I prove it wasn't there?",
  },
];

const ENGINEER = [
  {
    icon: "gavel",
    fear: "Will they blame me for damage that arrived with the device?",
  },
  {
    icon: "price_change",
    fear: "Will they insist I quoted less than we actually agreed?",
  },
  {
    icon: "reviews",
    fear: "Will one furious review sink me with no way to answer it?",
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
