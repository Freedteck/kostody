import styles from "./PageStub.module.css";

const PageStub = ({ title, accent, lede }) => {
  return (
    <section className={styles.stub}>
      <h1 className={styles.title}>
        {title} <span>{accent}</span>
      </h1>
      <p className={`${styles.lede} md-typescale-body-large`}>{lede}</p>
    </section>
  );
};

export default PageStub;
