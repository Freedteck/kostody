import { Icon, DeviceMockup } from "../../ui";
import mark from "../../assets/mark.png";
import clinic from "../../assets/dashboard-clinic-light-2x.png";
import styles from "./Reframe.module.css";

const PHASES = [
  {
    label: "Checked in",
    icon: "photo_camera",
    line: "Logged with condition photos before a screwdriver ever touches it.",
  },
  {
    label: "Charted",
    icon: "clinical_notes",
    line: "Every step time-stamped on a record neither side can rewrite.",
  },
  {
    label: "Discharged",
    icon: "task_alt",
    line: "Handed back with the full history, signed with the customer's PIN.",
  },
];

const Reframe = () => {
  return (
    <section className={styles.reframe} aria-labelledby="reframe-title">
      <img src={mark} alt="" aria-hidden="true" className={styles.mark} />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.copy}>
            <h2 id="reframe-title" className={styles.headline}>
              The repair guy didn't change. His workbench{" "}
              <em>became a clinic.</em>
            </h2>
            <p className={`${styles.para} md-typescale-body-large`}>
              Devices used to sit in a drawer on nothing but trust. On Kostody
              the same shop runs like a clinic: the device moves through it on a
              record instead of a promise, and no line ever gets rewritten.
            </p>
          </div>

          <div className={styles.figure}>
            <DeviceMockup
              src={clinic}
              alt="A Kostody engineer's Active Jobs board on iPhone 12"
            />
          </div>
        </div>

        <ol
          className={styles.clinic}
          aria-label="How a device moves through the clinic"
        >
          {PHASES.map((phase, i) => (
            <li key={phase.label} className={styles.phase} style={{ "--i": i }}>
              <span className={styles.dot}>
                <Icon name={phase.icon} filled size={18} />
              </span>
              <span className={`${styles.phaseLabel} md-typescale-title-small`}>
                {phase.label}
              </span>
              <span className={`${styles.phaseLine} md-typescale-body-medium`}>
                {phase.line}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Reframe;
