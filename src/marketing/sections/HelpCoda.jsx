import mark from "../../assets/mark.png";
import styles from "./HelpCoda.module.css";

const HelpCoda = () => {
  return (
    <section className={styles.coda} aria-labelledby="help-coda-title">
      <div className={styles.inner}>
        <div className={styles.seal}>
          <svg
            className={styles.ring}
            viewBox="0 0 200 200"
            role="presentation"
            aria-hidden="true"
          >
            <defs>
              <path
                id="helpCodaArc"
                fill="none"
                d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
              />
            </defs>
            <circle className={styles.ringAccent} cx="100" cy="100" r="95" />
            <circle className={styles.ringLine} cx="100" cy="100" r="89" />
            <circle className={styles.ringLine} cx="100" cy="100" r="58" />
            <text className={styles.ringText}>
              <textPath href="#helpCodaArc" startOffset="0">
                {"THE RECORD IS THE PROOF · ".repeat(3)}
              </textPath>
            </text>
          </svg>
          <img src={mark} alt="" aria-hidden="true" className={styles.sealMark} />
        </div>

        <div className={styles.copy}>
          <span className={`${styles.eyebrow} md-typescale-label-large`}>
            Self-service by design
          </span>
          <h2 id="help-coda-title" className={styles.title}>
            Help here means you <em>rarely</em> need it.
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            When every quote, photo, and status is locked permanently on the
            shared record, there are no arguments left to settle.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HelpCoda;
