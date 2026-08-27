import { useEffect, useState } from "react";
import { Card, Icon, Keypad } from "../../ui";
import mark from "../../assets/mark.png";
import styles from "./Identity.module.css";

const SHOPS = [
  "TechFix, Ikeja",
  "PhoneDoctor, Yaba",
  "Gadget Clinic, Wuse",
  "iCare Repairs, Lekki",
  "SwiftRepair, Port Harcourt",
  "MobileCare, Enugu",
  "GadgetHub, Surulere",
];

const Identity = () => {
  const [locked, setLocked] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!locked) return undefined;
    const t = setTimeout(() => {
      setLocked(false);
      setResetKey((k) => k + 1);
    }, 2800);
    return () => clearTimeout(t);
  }, [locked]);

  return (
    <section className={styles.identity} aria-labelledby="identity-title">
      <img src={mark} alt="" aria-hidden="true" className={styles.mark} />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.copy}>
            <h2 id="identity-title" className={styles.headline}>
              One number. <em>Every shop.</em>
            </h2>
            <p className={`${styles.para} md-typescale-body-large`}>
              You don't open a new account at every repair shop. Your phone
              number is your identity across all of Kostody — and one 4-digit
              PIN, held by you and never the shop, locks every agreement.
            </p>
            <p className={`${styles.note} md-typescale-body-medium`}>
              Walk into any shop and the record already knows who you are.
              Nothing gets signed without your PIN.
            </p>
          </div>

          <div className={styles.keystoneWrap}>
            <Card
              variant="elevated"
              padded={false}
              className={styles.keystone}
            >
              <div className={styles.keystoneHead}>
                <span
                  className={`${styles.keystoneKicker} md-typescale-label-large`}
                >
                  <Icon name="lock" size={16} filled />
                  Authorize repair
                </span>
                <span
                  className={`${styles.keystoneJob} md-typescale-label-medium`}
                >
                  #2481 · Samsung Galaxy A54
                </span>
              </div>

              <Keypad
                length={4}
                instruction="Enter your 4-digit PIN"
                onComplete={() => setLocked(true)}
                resetKey={resetKey}
                disabled={locked}
              />

              {locked && (
                <div className={styles.locked} role="status">
                  <span className={styles.lockedIcon}>
                    <Icon name="verified_user" size={30} filled />
                  </span>
                  <p
                    className={`${styles.lockedTitle} md-typescale-title-medium`}
                  >
                    Agreement locked
                  </p>
                  <p
                    className={`${styles.lockedSub} md-typescale-body-medium`}
                  >
                    Signed with your PIN · time-stamped · can't be rewritten
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className={styles.shops}>
          <span className={`${styles.shopsLabel} md-typescale-label-large`}>
            The same you, recognized at
          </span>
          <ul className={styles.shopList} aria-label="Shops on Kostody">
            {SHOPS.map((shop) => (
              <li
                key={shop}
                className={`${styles.shopChip} md-typescale-label-large`}
              >
                <Icon name="storefront" size={18} />
                {shop}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Identity;
