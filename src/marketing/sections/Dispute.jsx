import { Icon } from "../../ui";
import recordExpanded from "../../assets/record-expanded-proof.png";
import styles from "./Dispute.module.css";

const CALLOUTS = [
  {
    icon: "photo_camera",
    title: "Condition photos",
    line: "Pre-existing screen cracks captured and timestamped before work starts.",
  },
  {
    icon: "request_quote",
    title: "Financial summary",
    line: "Quoted price and paid amount locked in. No hidden fees or quote inflation.",
  },
  {
    icon: "history_toggle_off",
    title: "Tracking history",
    line: "Intake authorized, marked ready for pickup, and closed with customer PIN verification.",
  },
];

const Dispute = () => {
  return (
    <section className={styles.dispute} aria-labelledby="dispute-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id="dispute-title" className={styles.title}>
            So we scrolled back to the morning it came in.
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            The repair is one continuous record. Every event is appended, none is ever rewritten.
            Play it back and the debate stops being an argument: it is a timestamped fact.
          </p>
        </header>

        <div className={styles.canvas}>
          {/* Tablet hardware enclosure */}
          <div className={styles.tabletChassis}>
            <div className={styles.tabletCamera} aria-hidden="true" />
            <div
              className={styles.tabletScreen}
              tabIndex={0}
              aria-label="Scrollable Kostody repair record on tablet"
            >
              <img
                src={recordExpanded}
                alt="Kostody real audit record featuring intake photos, financial summary, and tracking history"
                className={styles.screenshot}
              />
            </div>
          </div>

          <div className={styles.callouts}>
            {CALLOUTS.map((callout) => (
              <div key={callout.title} className={styles.callout}>
                <div className={styles.calloutIcon}>
                  <Icon name={callout.icon} size={20} filled />
                </div>
                <div className={styles.calloutBody}>
                  <h3 className={`${styles.calloutTitle} md-typescale-title-medium`}>
                    {callout.title}
                  </h3>
                  <p className={`${styles.calloutLine} md-typescale-body-medium`}>
                    {callout.line}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dispute;
