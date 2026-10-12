import { Icon } from "../../ui";
import styles from "./HelpScenarios.module.css";

const SCENARIOS = [
  {
    icon: "price_change",
    worry: "The price at collection is higher than agreed.",
    truth:
      "The quote confirmed with the customer PIN is locked on the timeline with the exact date and amount.",
    move: "Open the job timeline and show the agreed quote. There is nothing to argue about.",
  },
  {
    icon: "broken_image",
    worry: "The customer claims new damage appeared during repair.",
    truth:
      "Condition photos taken at intake document pre-existing cracks, dents, and wear before any tool was used.",
    move: "Open condition photos on the record. Compare the drop-off state side by side.",
  },
  {
    icon: "inventory_2",
    worry: "A customer claims they left accessories, a charger, or a SIM card.",
    truth:
      "The intake checklist records every retained accessory before the device moves to the bench.",
    move: "Check the job record under 'Accessories retained'. Whatever was returned at the counter is documented.",
  },
  {
    icon: "schedule",
    worry: "A device was abandoned for weeks and parts prices surged.",
    truth:
      "Every quote carries a strict 7-day validity window to protect shops against market inflation.",
    move: "Expired quotes invalidate automatically. Issue a new quote based on current market rates.",
  },
  {
    icon: "qr_code_2",
    worry: "I need to outsource a board to a specialist in another plaza.",
    truth:
      "Kostody referral jobs preserve chain of custody across workshops without exposing customer contact info.",
    move: "Share the Referral Job ID with the specialist to auto-fill their intake while keeping both benches covered.",
  },
  {
    icon: "pin",
    worry: "I forgot my 4-digit PIN or account password.",
    truth:
      "Credentials are encrypted so neither the repair shop nor Kostody support can look them up.",
    move: "Tap 'Forgot PIN?' on the keypad or 'Forgot Password?' on login to verify with an OTP sent to your registered phone and set a new one.",
  },
];

const HelpScenarios = () => {
  return (
    <section className={styles.scenarios} aria-labelledby="scenarios-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="scenarios-title" className={styles.title}>
            What do I do <em>when...</em>
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            Real situations, answered straight. In almost every one, the record
            has already done the hard part for you.
          </p>
        </div>

        <ul className={styles.grid}>
          {SCENARIOS.map((item) => (
            <li key={item.worry} className={styles.card}>
              <div className={styles.worry}>
                <span className={styles.badge}>
                  <Icon name={item.icon} size={22} />
                </span>
                <h3 className={styles.worryText}>{item.worry}</h3>
              </div>

              <div className={styles.beats}>
                <div className={styles.beat}>
                  <span
                    className={`${styles.beatLabel} md-typescale-label-medium`}
                  >
                    What is already true
                  </span>
                  <p className={`${styles.beatText} md-typescale-body-medium`}>
                    {item.truth}
                  </p>
                </div>
                <div className={styles.beat}>
                  <span
                    className={`${styles.beatLabel} md-typescale-label-medium`}
                  >
                    Your move
                  </span>
                  <p className={`${styles.beatText} md-typescale-body-medium`}>
                    {item.move}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HelpScenarios;
