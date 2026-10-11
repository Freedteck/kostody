import { Icon, DeviceMockup } from "../../ui";
import pinLocked from "../../assets/pin-locked-2x.png";
import styles from "./SharedRecord.module.css";

const SharedRecord = () => {
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
          <DeviceMockup
            src={pinLocked}
            objectPosition="bottom center"
            className={styles.rotatedMockup}
            alt="Kostody Agreement Locked verified record on iPhone 12"
          />
        </div>
      </div>
    </section>
  );
};

export default SharedRecord;
