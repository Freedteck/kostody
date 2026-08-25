import { Icon } from "../../ui";
import styles from "./Gap.module.css";

const RECORD = [
  {
    icon: "photo_camera",
    text: "Four condition photos logged at intake",
    time: "Aug 20, 09:02 AM",
  },
  {
    icon: "lock",
    text: "Fault and ₦85,000 quote signed with the customer PIN",
    time: "Aug 20, 09:14 AM",
  },
];

const Gap = () => {
  return (
    <section className={styles.gap} aria-labelledby="gap-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="gap-title" className={styles.title}>
            When it goes wrong, it becomes your word against theirs.
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            Weeks after a repair the battery swells or the screen lifts, and the
            story splits in two. No one is lying. You each remember it
            differently, and with nothing written down the louder memory wins.
          </p>
        </div>

        <div className={styles.clash}>
          <figure className={`${styles.memory} ${styles.customer}`}>
            <figcaption className={`${styles.voice} md-typescale-label-large`}>
              What the customer remembers
            </figcaption>
            <blockquote className={styles.quote}>
              The screen was fine. I only brought it in for the battery.
            </blockquote>
          </figure>

          <span className={styles.fault} aria-hidden="true" />

          <figure className={`${styles.memory} ${styles.shop}`}>
            <figcaption className={`${styles.voice} md-typescale-label-large`}>
              What the shop remembers
            </figcaption>
            <blockquote className={styles.quote}>
              That crack was there on arrival. I pointed it out at the counter.
            </blockquote>
          </figure>
        </div>

        <div className={styles.resolve}>
          <p className={`${styles.resolveLabel} md-typescale-label-large`}>
            <Icon name="verified_user" filled size={18} />
            Kostody already settled it
          </p>

          <ul className={styles.record}>
            {RECORD.map((r, i) => (
              <li key={i} className={styles.recordLine}>
                <span className={styles.recordDot}>
                  <Icon name={r.icon} filled size={18} />
                </span>
                <span className={`${styles.recordText} md-typescale-body-large`}>
                  {r.text}
                </span>
                <span
                  className={`${styles.recordTime} md-typescale-label-medium`}
                >
                  {r.time}
                </span>
              </li>
            ))}
          </ul>

          <p className={`${styles.resolveNote} md-typescale-body-medium`}>
            Nobody has to be believed. You both signed the record the day it
            came in.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Gap;
