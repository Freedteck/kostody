import { DeviceMockup } from "../../ui";
import recordMobile from "../../assets/record-mobile-proof.png";
import styles from "./Gap.module.css";

const Gap = () => {
  return (
    <section className={styles.gap} aria-labelledby="gap-title">
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Left Column: Direct dialogue clash */}
          <div className={styles.copyCol}>
            <span className={`${styles.eyebrow} md-typescale-label-large`}>
              The Counter Conflict
            </span>

            <div className={styles.disputeStory}>
              <div className={styles.quoteBlock}>
                <span className={`${styles.speaker} md-typescale-label-medium`}>
                  Customer
                </span>
                <p className={styles.speech}>
                  &ldquo;The screen was fine. I only brought it in for the battery.&rdquo;
                </p>
              </div>

              <div className={styles.vsSeam} aria-hidden="true">
                <span className={styles.seamLine} />
                <span className={styles.seamWord}>VS</span>
                <span className={styles.seamLine} />
              </div>

              <div className={`${styles.quoteBlock} ${styles.shopBlock}`}>
                <span className={`${styles.speaker} md-typescale-label-medium`}>
                  Shop
                </span>
                <p className={styles.speech}>
                  &ldquo;That crack was there on arrival. I pointed it out at the counter.&rdquo;
                </p>
              </div>
            </div>

            <p className={`${styles.summary} md-typescale-body-large`}>
              Without proof, the loudest memory wins. With Kostody, the intake condition photos, 
              fixed quote, and customer PIN resolve it the moment the device hits the counter.
            </p>
          </div>

          {/* Right Column: Grounded phone proof */}
          <div className={styles.visualCol}>
            <div className={styles.mockupContainer}>
              <DeviceMockup
                src={recordMobile}
                alt="Actual Kostody verified intake record showing pre-repair condition photos and quote"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gap;
