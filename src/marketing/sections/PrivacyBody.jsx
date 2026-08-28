import { Icon } from "../../ui";
import styles from "./LegalBody.module.css";

const CLAUSES = [
  {
    index: "01",
    icon: "database",
    title: "What we collect.",
    body: "When you use Kostody, we store your phone number (your identity across all shops), the device description per repair job (make, model, reported fault), condition photos logged at intake, and every event on the repair timeline: quotes, PIN approvals, status updates, and completion records. Nothing else.",
  },
  {
    index: "02",
    icon: "pin",
    title: "Your PIN is never stored by us.",
    body: "Your 4-digit PIN is the key that authorizes every repair agreement. We do not store it, hash it, or have any server-side record of it. If you forget your PIN, we cannot recover or reset it remotely. That is not a limitation. It is a design decision that protects you.",
  },
  {
    index: "03",
    icon: "photo_camera",
    title: "Condition photos stay on the record.",
    body: "Photos logged at intake are attached permanently to the job record they belong to. Both the engineer and the customer can view them for that job. They are stored on our servers for as long as the job record exists, and are not used for any purpose outside of the record.",
  },
  {
    index: "04",
    icon: "storefront",
    title: "Shops only see their own jobs.",
    body: "An engineer's account gives access to jobs that were checked into their registered shop. No shop can see another shop's records, your history at other shops, or any data not tied to a job they opened.",
  },
  {
    index: "05",
    icon: "devices",
    title: "We do not read your device.",
    body: "Kostody records what the engineer logs about your device: its make, fault description, and condition photos. We have no access to the contents of your phone. Your apps, messages, photos, and personal files are never seen or stored by us.",
  },
  {
    index: "06",
    icon: "sell",
    title: "We do not sell your data.",
    body: "Your phone number, repair history, and photos are never sold, shared with advertisers, or used for profiling. The only third parties who see any part of your data are the shops involved in your repairs and the infrastructure services that run our platform.",
  },
  {
    index: "07",
    icon: "lock",
    title: "The timeline is append-only.",
    body: "Once an event is written to a repair timeline, it cannot be deleted or edited by anyone: not the shop, not the customer, not us. You may request deletion of your account, in which case we will remove your personal identifiers. The structural record of the repair remains, attributed to no one.",
  },
  {
    index: "08",
    icon: "update",
    title: "This policy will update before Phase 2.",
    body: "Online payment handling is not live yet. When it launches, this policy will be updated before the feature goes live to reflect exactly what payment data is collected and how it is handled. You will be notified.",
  },
];

const PrivacyBody = () => {
  return (
    <section className={styles.body} aria-labelledby="privacy-body-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="privacy-body-title" className={styles.title}>
            Plain language. <em>Full picture.</em>
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            Eight things you should know about how Kostody handles your
            information, written the way we write everything else: accurately.
          </p>
        </div>

        <ol className={styles.list}>
          {CLAUSES.map((c) => (
            <li key={c.index} className={styles.item}>
              <span className={`${styles.index} md-typescale-label-large`}>
                {c.index}
              </span>
              <div className={styles.clause}>
                <p className={styles.clauseTitle}>
                  <span className={styles.clauseIcon}>
                    <Icon name={c.icon} size={24} />
                  </span>
                  {c.title}
                </p>
                <p className={`${styles.clauseBody} md-typescale-body-large`}>
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default PrivacyBody;
