import { Link } from "react-router-dom";
import { Icon } from "../../ui";
import mark from "../../assets/mark.png";
import styles from "./NotFoundHero.module.css";

const NotFoundHero = () => {
  return (
    <section className={styles.hero} aria-labelledby="not-found-title">
      <img src={mark} alt="" aria-hidden="true" className={styles.mark} />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="not-found-title" className={styles.headline}>
            404 · This page <em>isn't on the record.</em>
          </h1>
          <p className={`${styles.para} md-typescale-body-large`}>
            The URL you followed doesn't exist, was moved, or was never logged
            at the counter. Everything that actually exists is back on the home
            page.
          </p>
          <div className={styles.actions}>
            <Link to="/" className={styles.ctaPrimary}>
              <Icon name="arrow_back" size={20} />
              Return to home
            </Link>
          </div>
        </div>

        <div className={styles.sealWrap} aria-hidden="true">
          <div className={styles.seal}>
            <svg
              className={styles.ring}
              viewBox="0 0 200 200"
              role="presentation"
            >
              <defs>
                <path
                  id="notFoundSealArc"
                  fill="none"
                  d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                />
              </defs>
              <circle className={styles.ringAccent} cx="100" cy="100" r="95" />
              <circle className={styles.ringLine} cx="100" cy="100" r="89" />
              <circle className={styles.ringLine} cx="100" cy="100" r="58" />
              <text className={styles.ringText}>
                <textPath href="#notFoundSealArc" startOffset="0">
                  {"404 · NOT ON THE RECORD · ".repeat(3)}
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

export default NotFoundHero;
