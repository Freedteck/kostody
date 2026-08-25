import Sheet from "../../ui/Sheet";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";
import styles from "./ConfirmCancel.module.css";

const ConfirmCancel = ({ onConfirm, onClose }) => (
  <Sheet open onClose={onClose} title="Cancel this job?">
    <div className={styles.body}>
      <div className={styles.badge}>
        <Icon name="cancel" size={30} />
      </div>
      <p className={`${styles.text} md-typescale-body-large`}>
        This moves the job to history and cannot be undone. If the customer has
        confirmed, you'll need their PIN to authorize.
      </p>
      <div className={styles.actions}>
        <Button variant="text" onClick={onClose}>
          Keep Job
        </Button>
        <Button
          variant="filled"
          icon="delete"
          onClick={onConfirm}
          style={{
            "--md-filled-button-container-color": "var(--md-sys-color-error)",
            "--md-filled-button-label-text-color":
              "var(--md-sys-color-on-error)",
            "--md-filled-button-icon-color": "var(--md-sys-color-on-error)",
          }}
        >
          Yes, Cancel
        </Button>
      </div>
    </div>
  </Sheet>
);

export default ConfirmCancel;
