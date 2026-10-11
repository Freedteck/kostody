import { Icon } from "../../ui";
import mark from "../../assets/mark.png";
import pinAuth from "../../assets/pin-auth.png";
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
              number is your universal ID across all of Kostody. Dropping off a
              dead device? You don't even need a working phone on you: the engineer
              inputs your number, and your 4-digit PIN confirms the agreement right at the counter.
            </p>
            <p className={`${styles.note} md-typescale-body-medium`}>
              Walk into any shop nationwide and the workbench recognizes you.
              No work begins without your PIN.
            </p>
          </div>

          <div className={styles.figure}>
            <div className={styles.device}>
              <div className={styles.screen}>
                <img
                  src={pinAuth}
                  alt="Customer 4-digit PIN authorization screen on Kostody"
                  loading="lazy"
                />
              </div>
            </div>
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
