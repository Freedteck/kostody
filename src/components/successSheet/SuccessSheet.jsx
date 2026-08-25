import Sheet from "../../ui/Sheet";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";
import styles from "./SuccessSheet.module.css";

const SuccessSheet = ({ title, message, onClose }) => (
  <Sheet open onClose={onClose} title={title}>
    <div className={styles.container}>
      <div className={styles.badge}>
        <Icon name="check" size={44} weight={500} />
      </div>
      <p className={`${styles.message} md-typescale-body-large`}>{message}</p>
      <Button variant="filled" full onClick={onClose}>
        Done
      </Button>
    </div>
  </Sheet>
);

export default SuccessSheet;
