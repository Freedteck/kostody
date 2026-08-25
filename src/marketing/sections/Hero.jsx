import { Link } from "react-router-dom";
import { Button, Icon } from "../../ui";
import mark from "../../assets/mark.png";
import proof from "../../assets/hero-proof.png";
import styles from "./Hero.module.css";

const CHAIN = [
  { label: "Logged", icon: "photo_camera" },
  { label: "Diagnosed", icon: "search_check" },
  { label: "Quoted", icon: "request_quote" },
  { label: "Repaired", icon: "build" },
  { label: "Handed over", icon: "verified_user" },
];

const Hero = () => {
  const goToGetApp = () => {
    const el = document.getElementById("get-app");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <img src={mark} alt="" aria-hidden="true" className={styles.mark} />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.copy}>
            <h1 id="hero-title" className={styles.headline}>
              Your phone holds your whole life. Get it repaired professionally,
              with <em>proof at every step.</em>
            </h1>

            <p className={`${styles.para} md-typescale-body-large`}>
              Kostody turns every repair into a locked, tamper-proof record.
              Condition photos, the fault, the quote and each payment are signed
              with your Universal PIN and time-stamped, so neither you nor the
              engineer can rewrite what happened.
            </p>

            <div className={styles.actions}>
              <Button
                variant="filled"
                icon="download"
                onClick={goToGetApp}
                className={styles.cta}
              >
                Download the app
              </Button>
              <Link
                to="/product"
                className={`${styles.ghost} md-typescale-title-small`}
              >
                See what gets recorded
                <Icon name="arrow_forward" size={18} />
              </Link>
            </div>
          </div>

          <div className={styles.figure}>
            <div className={styles.device}>
              <div className={styles.screen}>
                <img
                  src={proof}
                  alt="A Kostody repair record: each step signed with a PIN and time-stamped"
                />
              </div>
            </div>
          </div>
        </div>

        <ol className={styles.chain} aria-label="What every repair records">
          {CHAIN.map((step, i) => (
            <li key={step.label} className={styles.node} style={{ "--i": i }}>
              <span className={styles.dot}>
                <Icon name={step.icon} filled size={18} />
              </span>
              <span className={`${styles.nodeLabel} md-typescale-label-large`}>
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Hero;
