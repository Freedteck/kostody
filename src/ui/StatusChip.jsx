import Icon from "./Icon";
import styles from "./StatusChip.module.css";

const MAP = {
  "Pending Confirmation": {
    cls: "pending",
    icon: "schedule",
    label: "Pending",
  },
  "In Progress": { cls: "progress", icon: "build", label: "In Progress" },
  "Ready for Pickup": {
    cls: "ready",
    icon: "check_circle",
    label: "Ready",
  },
  Completed: { cls: "done", icon: "task_alt", label: "Completed" },
  Cancelled: { cls: "cancelled", icon: "cancel", label: "Cancelled" },
  Expired: { cls: "expired", icon: "timer_off", label: "Expired" },
  Transferred: { cls: "transferred", icon: "swap_horiz", label: "Transferred" },
};

const StatusChip = ({ status, size = "medium", label, className = "" }) => {
  const meta = MAP[status] || { cls: "default", icon: "info", label: status };
  const dims = size === "small" ? 14 : 16;
  return (
    <span
      className={`${styles.chip} ${styles[meta.cls]} ${styles[size]} md-typescale-label-large ${className}`}
    >
      <Icon name={meta.icon} size={dims} filled />
      {label || meta.label}
    </span>
  );
};

export default StatusChip;
