import Icon from "./Icon";
import styles from "./SegmentedButtons.module.css";

const SegmentedButtons = ({ options, value, onChange, className = "" }) => (
  <div className={`${styles.group} ${className}`} role="group">
    {options.map((opt) => {
      const selected = value === opt.value;
      return (
        <button
          key={String(opt.value)}
          type="button"
          className={`${styles.segment} ${selected ? styles.selected : ""}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={selected}
        >
          {selected && <Icon name="check" size={18} />}
          <span>{opt.label}</span>
        </button>
      );
    })}
  </div>
);

export default SegmentedButtons;
