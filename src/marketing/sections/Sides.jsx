import { Link } from "react-router-dom";
import { Icon } from "../../ui";
import styles from "./Sides.module.css";

const EVENTS = [
  {
    icon: "photo_camera",
    record: "Logged · 4 photos",
    time: "2:01 PM",
    eng: "Shot every crack",
    you: "You saw all four",
  },
  {
    icon: "request_quote",
    record: "Quote · ₦85,000",
    time: "2:14 PM",
    eng: "Set the price once",
    you: "It can't creep up",
  },
  {
    icon: "lock",
    record: "Locked with PIN",
    time: "2:20 PM",
    eng: "Waits for approval",
    you: "Your PIN, your call",
  },
  {
    icon: "task_alt",
    record: "Ready for pickup",
    time: "5:47 PM",
    eng: "Marked it done",
    you: "Same alert, same second",
  },
];

const Sides = () => {
  return (
    <section className={styles.sides} aria-labelledby="sides-title">
      <div className={styles.seam} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="sides-title" className={styles.title}>
            Two sides. <em>One record.</em>
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            The engineer's app and yours aren't two versions of the story.
            They're two windows on the same locked timeline — same events, same
            timestamps, nothing either side can quietly rewrite.
          </p>
        </div>

        <div className={styles.labels} aria-hidden="true">
          <span
            className={`${styles.label} ${styles.labelEng} md-typescale-label-large`}
          >
            <Icon name="handyman" size={18} />
            The engineer's app
          </span>
          <span
            className={`${styles.label} ${styles.labelCust} md-typescale-label-large`}
          >
            <Icon name="person" size={18} />
            Your app
          </span>
        </div>

        <ol
          className={styles.spine}
          aria-label="One repair, seen from both sides"
        >
          {EVENTS.map((ev) => (
            <li key={ev.record} className={styles.row}>
              <p
                className={`${styles.side} ${styles.eng} md-typescale-title-small`}
              >
                {ev.eng}
              </p>
              <span className={styles.record}>
                <Icon
                  name={ev.icon}
                  filled
                  size={18}
                  className={styles.recordIcon}
                />
                <span className={`${styles.recordText} md-typescale-label-large`}>
                  {ev.record}
                </span>
                <time className={`${styles.recordTime} md-typescale-label-small`}>
                  {ev.time}
                </time>
              </span>
              <p
                className={`${styles.side} ${styles.cust} md-typescale-title-small`}
              >
                {ev.you}
              </p>
            </li>
          ))}
        </ol>

        <Link to="/product" className={`${styles.more} md-typescale-title-small`}>
          See everything the record holds
          <Icon name="arrow_forward" size={18} />
        </Link>
      </div>
    </section>
  );
};

export default Sides;
