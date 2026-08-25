import Icon from "./Icon";
import styles from "./Timeline.module.css";

const Timeline = ({ events = [], className = "" }) => (
  <ol className={`${styles.timeline} ${className}`}>
    {events.map((ev, i) => (
      <li key={ev.id ?? i} className={styles.item}>
        <span className={styles.node}>
          <Icon name={ev.icon || "check"} size={18} />
        </span>
        <div className={styles.content}>
          <p className={`${styles.text} md-typescale-body-medium`}>{ev.text}</p>
          {ev.time && (
            <time className={`${styles.time} md-typescale-label-small`}>
              {ev.time}
            </time>
          )}
        </div>
      </li>
    ))}
  </ol>
);

export default Timeline;
