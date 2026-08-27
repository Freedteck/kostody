import { useEffect, useRef, useState } from "react";
import { Icon } from "../../ui";
import record from "../../assets/dispute-record.png";
import styles from "./Dispute.module.css";

const BEATS = [
  "She swore the screen was fine at drop-off. He swore the crack was already there. Both of them meant it.",
  "So we opened the record and scrolled back to 09:02, the minute it hit the counter, before a single screw was turned.",
  "There it is in condition photo 3, shot at intake. The same hairline crack, time-stamped 09:02. Not a memory now, a fact with a clock on it.",
  "Nobody had to be believed. The record read the same for both of them, and it always will, because a line can be added but never rewritten.",
];

const Dispute = () => {
  const [beat, setBeat] = useState(0);
  const [live, setLive] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    setLive(true);
    const nodes = trackRef.current?.querySelectorAll("[data-beat-index]");
    if (!nodes || !nodes.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBeat(Number(entry.target.dataset.beatIndex));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  return (
    <section
      className={styles.dispute}
      aria-labelledby="dispute-title"
      data-beat={beat}
      data-live={live ? "" : undefined}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id="dispute-title" className={styles.title}>
            So we scrolled back to the morning it came in.
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            The whole repair is one locked record, every step added and none ever
            rewritten. Play it back and the crack stops being a memory. It becomes
            a time-stamp.
          </p>
        </header>

        <div className={styles.stage}>
          <div className={styles.track} ref={trackRef}>
            {BEATS.map((text, i) => (
              <div
                key={i}
                className={styles.beat}
                data-beat-index={i}
                data-active={beat === i ? "" : undefined}
              >
                <p className={styles.beatText}>{text}</p>
              </div>
            ))}
          </div>

          <div className={styles.viewport} aria-hidden="true">
            <div className={styles.device}>
              <img className={styles.record} src={record} alt="" />
              <div className={styles.veil} />

              <span className={styles.stamp}>
                <Icon name="schedule" size={15} filled />
                09:02 · at intake
              </span>

              <span className={styles.verdict}>
                <Icon name="verified" size={15} filled />
                Settled
              </span>

              <div className={styles.evidence}>
                <div className={styles.evidenceHead}>
                  <span className={styles.evidenceIcon}>
                    <Icon name="photo_camera" size={16} filled />
                  </span>
                  <div>
                    <p className={`${styles.evidenceTitle} md-typescale-label-large`}>
                      Condition photo 3
                    </p>
                    <p className={`${styles.evidenceSub} md-typescale-label-medium`}>
                      Logged 09:02, before the device was opened
                    </p>
                  </div>
                </div>
                <div className={styles.photoSlot}>
                  <Icon name="image" size={22} />
                  <span className="md-typescale-label-small">Intake photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dispute;
