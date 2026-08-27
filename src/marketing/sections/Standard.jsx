import mark from "../../assets/mark.png";
import styles from "./Standard.module.css";

const Standard = () => {
  return (
    <section className={styles.standard}>
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
                id="sealArc"
                fill="none"
                d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
              />
            </defs>
            <circle className={styles.ringAccent} cx="100" cy="100" r="95" />
            <circle className={styles.ringLine} cx="100" cy="100" r="89" />
            <circle className={styles.ringLine} cx="100" cy="100" r="58" />
            <text className={styles.ringText}>
              <textPath href="#sealArc" startOffset="0">
                {"ON THE RECORD · PROOF · ".repeat(3)}
              </textPath>
            </text>
          </svg>
          <img src={mark} alt="" aria-hidden="true" className={styles.sealMark} />
        </div>

        <div className={styles.copy}>
          <span className={`${styles.eyebrow} md-typescale-label-large`}>
            For every repair in Nigeria
          </span>
          <h2 className={styles.title}>
            One standard of <em>proof</em>.
          </h2>
          <p className={`${styles.lede} md-typescale-body-large`}>
            Every shop, every repair, both sides of the counter — held to one
            record.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Standard;
