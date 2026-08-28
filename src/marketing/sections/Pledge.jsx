import styles from "./Pledge.module.css";

const Pledge = () => {
  return (
    <section className={styles.pledge} aria-labelledby="pledge-title">
      <div className={styles.fade} aria-hidden="true" />
      <div className={styles.inner}>
        <h2 id="pledge-title" className={styles.headline}>
          This is the <em>standard</em> we hold every repair to.
        </h2>
        <p className={`${styles.sub} md-typescale-title-medium`}>
          Every shop. Both sides of the counter. The same proof, every time.
        </p>
      </div>
    </section>
  );
};

export default Pledge;
