import Sheet from "../../ui/Sheet";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";
import styles from "./ConfirmTransfer.module.css";

const ConfirmTransfer = ({ onAccept, onDecline, title, fromName, onClose }) => (
  <Sheet open onClose={onClose} title={title}>
    <div className={styles.body}>
      <div className={styles.badge}>
        <Icon name="swap_horiz" size={30} />
      </div>
      <p className={`${styles.text} md-typescale-body-large`}>
        <strong>{fromName || "The referring engineer"}</strong> logged this job
        and is waiting for you to confirm receipt of the device. Accepting
        confirms the device is physically in your possession.
      </p>
      <div className={styles.actions}>
        <Button variant="text" onClick={onDecline}>
          Decline
        </Button>
        <Button variant="filled" icon="check" onClick={onAccept}>
          Accept
        </Button>
      </div>
    </div>
  </Sheet>
);

export default ConfirmTransfer;
