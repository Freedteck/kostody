import { Icon } from "../../ui";
import board from "../../assets/dashboard-clinic.png";
import proof from "../../assets/hero-proof.png";
import styles from "./AppShowcase.module.css";

const SHOWS = [
  {
    key: "engineer",
    eyebrow: "For the engineer",
    title: "Run your bench on proof.",
    lede: "The Device Clinic for your shop - every job on the bench, every step on the record. Look professional, and get paid without arguments.",
    img: board,
    imgAlt: "The engineer's Active Jobs board",
    caps: [
      {
        icon: "photo_camera",
        label: "Check in with photos",
        line: "Log the device and its faults with time-stamped condition photos before you touch it.",
      },
      {
        icon: "request_quote",
        label: "Quote once, in the open",
        line: "Set the price a single time. It's on the record, so it can't be argued later.",
      },
      {
        icon: "history",
        label: "A tamper-proof work log",
        line: "Parts fitted and tests run are added as you go - a log no one can quietly edit.",
      },
      {
        icon: "task_alt",
        label: "Mark ready in one tap",
        line: "Flip the status and the customer knows instantly. No more phone tag.",
      },
    ],
  },
  {
    key: "customer",
    eyebrow: "For the customer",
    title: "Your device, your PIN, your proof.",
    lede: "Hand over your phone and still know exactly what's happening to it - from any shop, on one number that's always yours.",
    img: proof,
    imgAlt: "The customer's live repair record",
    caps: [
      {
        icon: "visibility",
        label: "Watch every step, live",
        line: "See each photo, quote, and update the moment it's logged - not after the fact.",
      },
      {
        icon: "lock",
        label: "Approve with your PIN",
        line: "Nothing proceeds until you sign off with your own 4-digit PIN.",
      },
      {
        icon: "payments",
        label: "No surprise prices",
        line: "The quote you approved is the price you pay. It's locked on the record.",
      },
      {
        icon: "gavel",
        label: "Proof if it's questioned",
        line: "If anything is ever disputed, the record answers on your behalf.",
      },
    ],
  },
];

const AppShowcase = () => {
  return (
    <section className={styles.showcases} aria-label="What each side gets">
      {SHOWS.map((show) => (
        <div
          key={show.key}
          className={`${styles.show} ${styles[show.key]}`}
        >
          <div className={styles.inner}>
            <div className={styles.textCol}>
              <span className={`${styles.eyebrow} md-typescale-label-large`}>
                {show.eyebrow}
              </span>
              <h2 className={styles.title}>{show.title}</h2>
              <p className={`${styles.lede} md-typescale-body-large`}>
                {show.lede}
              </p>

              <ul className={styles.caps}>
                {show.caps.map((cap) => (
                  <li key={cap.label} className={styles.cap}>
                    <span className={styles.capIcon}>
                      <Icon name={cap.icon} size={20} filled />
                    </span>
                    <div className={styles.capText}>
                      <span className={`${styles.capLabel} md-typescale-title-small`}>
                        {cap.label}
                      </span>
                      <span className={`${styles.capLine} md-typescale-body-medium`}>
                        {cap.line}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.visualCol}>
              <div className={styles.device}>
                <div className={styles.screen}>
                  <img src={show.img} alt={show.imgAlt} loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default AppShowcase;
