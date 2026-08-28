import { Icon } from "../../ui";
import styles from "./LegalBody.module.css";

const CLAUSES = [
  {
    index: "01",
    icon: "shield",
    title: "What Kostody is.",
    body: "Kostody is the platform that creates and protects the shared repair record between shops and customers. We build the infrastructure, enforce the tamper-proof timeline, verify registered shops, and secure the PIN authorization system. That is the full scope of our role.",
  },
  {
    index: "02",
    icon: "handyman",
    title: "What Kostody is not.",
    body: "We are not a repair shop. We do not perform repairs, set prices, or make recommendations about hardware. We are not a dispute arbitrator. We do not mediate disagreements between you and a shop, though the record makes most disputes self-resolving. We are not a payment processor. All payments are currently made directly at the shop counter.",
  },
  {
    index: "03",
    icon: "gavel",
    title: "The record is the agreement.",
    body: "When you enter your PIN to authorize a repair, you are creating a binding agreement with the shop at the exact quoted price. That agreement is time-stamped and locked on the shared record. It cannot be altered by either side after the fact. By using Kostody, you accept the shared record as the authoritative account of every transaction.",
  },
  {
    index: "04",
    icon: "storefront",
    title: "Shops are independent businesses.",
    body: "Kostody registers and verifies shops on the platform, but shops are independent businesses. Kostody is not liable for the quality of repairs, the availability of parts, turnaround times, or any outcome that occurs at the shop's physical location. Your repair contract is with the shop, enforced by the record.",
  },
  {
    index: "05",
    icon: "pin",
    title: "Your PIN is your responsibility.",
    body: "Your 4-digit PIN is the sole authorization mechanism on the platform. You are responsible for keeping it private. Kostody cannot reset it remotely. If your PIN is compromised because you shared it, the consequences of any authorized action taken with it are yours. No shop or Kostody representative will ever ask you for your PIN.",
  },
  {
    index: "06",
    icon: "payments",
    title: "Payments happen at the counter.",
    body: "All current payments on Kostody are recorded manually in Naira (NGN) and settled directly between the customer and the shop. Kostody is not a party to payment transactions and is not liable for payment disputes. The amount on the locked record is the agreed amount. Online payment handling will be covered in updated terms before Phase 2 launches.",
  },
  {
    index: "07",
    icon: "history",
    title: "The timeline cannot be edited.",
    body: "By using the platform, both shops and customers agree that the append-only repair timeline is the full and final record of the job. No entry can be deleted or rewritten. Both sides see the same record in real time. This is the feature, not a limitation.",
  },
  {
    index: "08",
    icon: "logout",
    title: "Leaving the platform.",
    body: "Either side can stop using Kostody at any time. Shops can request deregistration. Customers can request account deletion. Past records that were completed while your account was active remain in the system, attributed to no one, for the integrity of the other party's record. Active jobs must be resolved or formally closed before an account can be removed.",
  },
];

const TermsBody = () => {
  return (
    <section className={styles.body} aria-labelledby="terms-body-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="terms-body-title" className={styles.title}>
            What you agree to. <em>And what we agree to.</em>
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            Eight clauses. No legalese. Every rule points back to one thing: the
            shared record is the truth, and both sides agreed to it.
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

export default TermsBody;
