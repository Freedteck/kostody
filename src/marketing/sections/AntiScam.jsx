import { Icon } from "../../ui";
import styles from "./AntiScam.module.css";

const RULES = [
  {
    icon: "pin",
    title: "No PIN over chat or phone.",
    reason:
      "We will never ask for your 4-digit PIN over email, phone, or DM. We keep it scrambled, so not even we can read it. It is yours alone.",
  },
  {
    icon: "mark_email_unread",
    title: "No DM money requests.",
    reason:
      "We will never message you on WhatsApp, Telegram, or Instagram asking for transfer payments or deposit top-ups.",
  },
  {
    icon: "credit_card_off",
    title: "No off-counter payments.",
    reason:
      "All payments are handled directly with the shop at their counter. Online payment will only ever happen inside the official app, and that is coming soon.",
  },
  {
    icon: "verified",
    title: "No unverified claims.",
    reason:
      "Every request points back to a record in your app, stamped with the time. If a change or charge is not on your timeline, ignore it.",
  },
];

const AntiScam = () => {
  return (
    <section className={styles.antiScam} aria-labelledby="anti-scam-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="anti-scam-title" className={styles.title}>
            What Kostody will <em>never</em> ask of you.
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            Trust only works if boundaries are absolute. We maintain strict
            rules for how we communicate: if anyone asks for these, it is a scam.
          </p>
        </div>

        <ul className={styles.grid}>
          {RULES.map((rule) => (
            <li key={rule.title} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>
                  <Icon name={rule.icon} size={22} />
                </span>
                <h3 className={`${styles.cardTitle} md-typescale-title-large`}>
                  {rule.title}
                </h3>
              </div>
              <p className={`${styles.reason} md-typescale-body-medium`}>
                {rule.reason}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AntiScam;
