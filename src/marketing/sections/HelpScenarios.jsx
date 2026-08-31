import { Icon } from "../../ui";
import styles from "./HelpScenarios.module.css";

const SCENARIOS = [
  {
    icon: "request_quote",
    worry: "My shop sent me a quote. What now?",
    truth:
      "The quote sits in your timeline with the exact price and what it covers.",
    move: "Read it. If it looks right, tap in your PIN, and the shop can start.",
  },
  {
    icon: "pin",
    worry: "I forgot my PIN.",
    truth:
      "Your PIN is scrambled the moment you set it, so no one, not even us, can look it up for you. That is what keeps it safe.",
    move: "Reach out and we will help you set a new one. Our details are further down this page.",
  },
  {
    icon: "price_change",
    worry: "The price is higher than we agreed.",
    truth:
      "It cannot be. The amount you approved is locked in your timeline, the exact figure at the exact time.",
    move: "Open it and show them. There is nothing to argue about.",
  },
  {
    icon: "broken_image",
    worry: "My device came back with damage that was not there before.",
    truth:
      "The photos from when you dropped it off are saved in your timeline, each one stamped with the time.",
    move: "Compare them side by side. The proof is already yours.",
  },
  {
    icon: "pending_actions",
    worry: "Where is my repair? Is it done yet?",
    truth:
      "Your timeline shows the real status, updated the moment the shop moves it forward.",
    move: "Open the app and look. No need to call and ask.",
  },
  {
    icon: "payments",
    worry: "Can I cancel, or pay online?",
    truth:
      "Once a repair starts, only the shop can cancel it, since they are holding your device. Paying online is coming soon; for now every payment is at the counter in naira.",
    move: "Sort a cancellation with your shop directly.",
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
