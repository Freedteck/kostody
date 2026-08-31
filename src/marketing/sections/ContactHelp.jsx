import { Icon } from "../../ui";
import styles from "./ContactHelp.module.css";

const METHODS = [
  {
    icon: "mail",
    label: "Email",
    value: "freedteck@gmail.com",
    href: "mailto:freedteck@gmail.com",
    note: "Best for anything with details or screenshots.",
    external: false,
  },
  {
    icon: "chat",
    label: "WhatsApp",
    value: "0906 846 0732",
    href: "https://wa.me/2349068460732",
    note: "Quick questions, quickest reply.",
    external: true,
  },
  {
    icon: "call",
    label: "Call",
    value: "0808 145 8864",
    href: "tel:+2348081458864",
    note: "When you would rather just talk it through.",
    external: false,
  },
];

const ContactHelp = () => {
  return (
    <section className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={`${styles.eyebrow} md-typescale-label-large`}>
            Still stuck?
          </span>
          <h2 id="contact-title" className={styles.title}>
            Talk to a <em>real person.</em>
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            If the record did not settle your question, reach out. A real human
            reads every message, and we answer.
          </p>
        </div>

        <ul className={styles.grid}>
          {METHODS.map((m) => (
            <li key={m.label} className={styles.item}>
              <a
                className={styles.method}
                href={m.href}
                target={m.external ? "_blank" : undefined}
                rel={m.external ? "noreferrer" : undefined}
                aria-label={`${m.label}: ${m.value}`}
              >
                <span className={styles.badge}>
                  <Icon name={m.icon} size={24} />
                </span>
                <span className={styles.body}>
                  <span className={`${styles.label} md-typescale-label-large`}>
                    {m.label}
                  </span>
                  <span className={styles.value}>{m.value}</span>
                  <span className={`${styles.note} md-typescale-body-small`}>
                    {m.note}
                  </span>
                </span>
                <Icon
                  name="arrow_outward"
                  size={20}
                  className={styles.arrow}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ContactHelp;
