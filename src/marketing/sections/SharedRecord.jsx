import { useEffect, useState } from "react";
import { Card, Icon, Keypad } from "../../ui";
import styles from "./SharedRecord.module.css";

const SharedRecord = () => {
  const [locked, setLocked] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!locked) return undefined;
    const timer = setTimeout(() => {
      setLocked(false);
      setResetKey((key) => key + 1);
    }, 2800);
    return () => clearTimeout(timer);
  }, [locked]);

  return (
    <section className={styles.shared} aria-labelledby="shared-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={`${styles.eyebrow} md-typescale-label-large`}>
            Where the two apps meet
          </span>
          <h2 id="shared-title" className={styles.title}>
            One record. <em>Both sides.</em>
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            The engineer writes it, the customer approves it, and neither side
            can edit it afterwards. Every entry is time-stamped - and both sides
            are notified the same second.
          </p>

          <div className={styles.pills}>
            <span className={`${styles.pill} md-typescale-label-large`}>
              <Icon name="handyman" size={18} />
              Engineer
            </span>
            <Icon name="sync_alt" size={20} className={styles.pillJoin} />
            <span className={`${styles.pill} md-typescale-label-large`}>
              <Icon name="person" size={18} />
              Customer
            </span>
          </div>
        </div>

        <div className={styles.figure}>
          <Card variant="elevated" padded={false} className={styles.keypadCard}>
            <div className={styles.keypadHead}>
              <span className={`${styles.keypadKicker} md-typescale-label-large`}>
                <Icon name="lock" size={16} filled />
                Approve repair
              </span>
              <span className={`${styles.keypadJob} md-typescale-label-medium`}>
                iPhone 12 · ₦85,000
              </span>
            </div>

            <Keypad
              length={4}
              instruction="Enter any 4 digits to approve - try it"
              onComplete={() => setLocked(true)}
              resetKey={resetKey}
              disabled={locked}
            />

            {locked && (
              <div className={styles.locked} role="status">
                <span className={styles.lockedIcon}>
                  <Icon name="verified_user" size={28} filled />
                </span>
                <p className={`${styles.lockedTitle} md-typescale-title-medium`}>
                  Agreement locked
                </p>
                <p className={`${styles.lockedSub} md-typescale-body-medium`}>
                  Both sides notified · time-stamped
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SharedRecord;
