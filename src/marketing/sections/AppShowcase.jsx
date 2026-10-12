import { useState } from "react";
import { Icon, DeviceMockup } from "../../ui";
import board from "../../assets/dashboard-clinic-light-2x.png";
import customerProof from "../../assets/dashboard-customer-light-2x.png";
import referralImg from "../../assets/e2e-referral-2x.png";
import styles from "./AppShowcase.module.css";

const TABS = [
  {
    key: "engineer",
    label: "For the shop",
    icon: "handyman",
    img: board,
    imgAlt: "The engineer's Active Jobs board on Kostody",
    title: "Run your bench on proof.",
    lede:
      "Every job on the bench, every step on the record. Look professional and get paid without arguments.",
    caps: [
      {
        icon: "photo_camera",
        label: "Check in with condition photos",
        line: "Log the device and its faults with time-stamped photos before you touch it.",
      },
      {
        icon: "request_quote",
        label: "Quote once, in the open",
        line: "Set the price a single time. It's on the record, so it can't be argued later.",
      },
      {
        icon: "history",
        label: "A verified work log",
        line: "Parts fitted and tests run are added as you go. A clean history neither side can rewrite.",
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
    label: "For the customer",
    icon: "person",
    img: customerProof,
    imgAlt: "The customer's live repair record on iPhone 12",
    title: "Your device, your PIN, your proof.",
    lede:
      "Hand over your phone and still know exactly what's happening to it. From any shop, on one number that's always yours.",
    caps: [
      {
        icon: "visibility",
        label: "Watch every step, live",
        line: "See each photo, quote, and update the moment it's logged. Not after the fact.",
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
        icon: "sync_alt",
        label: "One record, both sides",
        line: "The engineer writes it, you approve it. Neither side can edit a line afterwards.",
      },
    ],
  },
  {
    key: "referral",
    label: "Referrals",
    icon: "swap_horiz",
    img: referralImg,
    imgAlt: "Engineer-to-engineer referral intake on Kostody",
    title: "Outsource without losing the chain of custody.",
    lede:
      "Sending a board for CPU reballing or specialized flashing? Hand off with a Referral Job ID so accountability never breaks.",
    caps: [
      {
        icon: "qr_code_2",
        label: "One-tap referral intake",
        line: "The receiving specialist enters your Referral Job ID to auto-fill customer and device history.",
      },
      {
        icon: "handshake",
        label: "Both technicians protected",
        line: "You are the client to the specialist. Your original customer agreement stays intact.",
      },
      {
        icon: "inventory_2",
        label: "Accessories logged across hands",
        line: "Every retained component, battery, and peripheral is accounted for across bench transfers.",
      },
      {
        icon: "verified_user",
        label: "No multi-engineer blame games",
        line: "A clear handoff record means no one can claim the board died before it reached their bench.",
      },
    ],
  },
];

const AppShowcase = () => {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const handleTab = (index) => {
    if (index === active) return;
    setActive(index);
    setAnimKey((k) => k + 1);
  };

  const tab = TABS[active];

  return (
    <section className={styles.showcase} aria-labelledby="showcase-title">
      <div className={styles.inner}>
        {/* ── Left: tabs + content ── */}
        <div className={styles.contentCol}>
          <nav className={styles.tabs} aria-label="App view">
            {TABS.map((t, i) => (
              <button
                key={t.key}
                className={`${styles.tab} ${i === active ? styles.tabActive : ""}`}
                onClick={() => handleTab(i)}
                aria-pressed={i === active}
              >
                <Icon name={t.icon} size={18} filled={i === active} />
                {t.label}
              </button>
            ))}
          </nav>

          <div key={animKey} className={styles.panel}>
            <h2 id="showcase-title" className={styles.title}>
              {tab.title}
            </h2>
            <p className={`${styles.lede} md-typescale-body-large`}>
              {tab.lede}
            </p>
            <ul className={styles.caps}>
              {tab.caps.map((cap) => (
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
        </div>

        {/* ── Right: phone ── */}
        <div className={styles.visualCol} aria-hidden="true">
          <div key={`phone-${animKey}`} className={styles.phoneWrap}>
            <DeviceMockup src={tab.img} alt={tab.imgAlt} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
