import { Icon } from "../../ui";
import styles from "./HelpScenarios.module.css";

const SCENARIOS = [
  {
    icon: "request_quote",
    question: "I got a quote from my shop. <em>Now what?</em>",
    answer:
      "Review the quote in your timeline. If you accept it, enter your PIN to authorize the repair. The shop is notified instantly and work can begin.",
  },
  {
    icon: "pin",
    question: "I forgot my PIN. <em>How do I reset it?</em>",
    answer:
      "Right now, there is no self-service PIN reset. Because your PIN is the key that authorizes repairs, we do not store it and cannot reset it via SMS or email.",
  },
  {
    icon: "price_change",
    question: "The price is higher at pickup. <em>What do I do?</em>",
    answer:
      "It can't be. The price you approved in the app is the exact price logged in the shared record. A shop cannot alter an approved quote without sending a new one for your PIN approval first.",
  },
  {
    icon: "broken_image",
    question: "My device came back with <em>new damage.</em>",
    answer:
      "Open the intake record. The shop logs condition photos when you hand over your device. The time-stamped record proves exactly what state it arrived in.",
  },
  {
    icon: "pending_actions",
    question: "Where is my repair? <em>Is it done?</em>",
    answer:
      "Your timeline shows the exact, real-time status of your device. When the shop finishes the repair or updates the status, it reflects immediately on your end.",
  },
  {
    icon: "payments",
    question: "Can I cancel or <em>pay online?</em>",
    answer:
      "Only the shop can cancel a repair once it's started (since they hold the device). All payments are currently recorded in ₦ at the counter. Online pay arrives in Phase 2.",
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
            Real scenarios, answered accurately. Because the record handles the
            heavy lifting, you rarely need to ask "what happened."
          </p>
        </div>

        <ul className={styles.grid}>
          {SCENARIOS.map((item) => (
            <li key={item.question} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>
                  <Icon name={item.icon} size={22} />
                </span>
                <h3
                  className={styles.question}
                  dangerouslySetInnerHTML={{ __html: item.question }}
                />
              </div>
              <p className={`${styles.answer} md-typescale-body-medium`}>
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HelpScenarios;
