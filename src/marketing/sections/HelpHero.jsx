import mark from "../../assets/mark.png";
import styles from "./HelpHero.module.css";

const HelpHero = () => {
  return (
    <section className={styles.hero} aria-labelledby="help-hero-title">
      <img src={mark} alt="" aria-hidden="true" className={styles.mark} />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="help-hero-title" className={styles.headline}>
            On Kostody, help isn't a hotline. <em>It's the record.</em>
          </h1>
          <p className={`${styles.para} md-typescale-body-large`}>
            Most answers are already on your side. When you need more, here is exactly how things work and where to look.
          </p>
        </div>

        <div className={styles.sealWrap} aria-hidden="true">
          <div className={styles.seal}>
            <svg className={styles.ring} viewBox="0 0 200 200" role="presentation">
              <defs>
                <path
                  id="helpSealArc"
                  fill="none"
                  d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                />
              </defs>
              <circle className={styles.ringAccent} cx="100" cy="100" r="95" />
              <circle className={styles.ringLine} cx="100" cy="100" r="89" />
              <circle className={styles.ringLine} cx="100" cy="100" r="58" />
              <text className={styles.ringText}>
                <textPath href="#helpSealArc" startOffset="0">
                  {"THE SOURCE OF TRUTH · ".repeat(3)}
                </textPath>
              </text>
            </svg>
            <img src={mark} alt="" className={styles.sealMark} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpHero;
