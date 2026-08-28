import mark from "../../assets/mark.png";
import styles from "./AboutHero.module.css";

const AboutHero = () => {
  return (
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <img src={mark} alt="" aria-hidden="true" className={styles.mark} />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="about-hero-title" className={styles.headline}>
            A repair should run on <em>proof</em> - not on your word against
            theirs.
          </h1>
          <p className={`${styles.para} md-typescale-body-large`}>
            That belief is the whole of Kostody. Everything the product does -
            and everything it refuses to do - comes back to it.
          </p>
        </div>

        <div className={styles.sealWrap} aria-hidden="true">
          <div className={styles.seal}>
            <svg className={styles.ring} viewBox="0 0 200 200" role="presentation">
              <defs>
                <path
                  id="aboutSealArc"
                  fill="none"
                  d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                />
              </defs>
              <circle className={styles.ringAccent} cx="100" cy="100" r="95" />
              <circle className={styles.ringLine} cx="100" cy="100" r="89" />
              <circle className={styles.ringLine} cx="100" cy="100" r="58" />
              <text className={styles.ringText}>
                <textPath href="#aboutSealArc" startOffset="0">
                  {"ON THE RECORD · PROOF · ".repeat(3)}
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

export default AboutHero;
