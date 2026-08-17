import { useState } from "react";
import styles from "./ChangePinSheet.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";
import { changePin } from "../../services/api";
import useToast from "../../hooks/useToast";

const ChangePinSheet = ({ onClose, customerId }) => {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      showToast("New PINs do not match.", "error");
      return;
    }

    setIsLoading(true);
    await changePin(customerId, oldPin, newPin)
      .then(() => {
        showToast("PIN changed successfully.", "success");
        onClose();
      })
      .catch((error) => {
        showToast(error.message || "Failed to change PIN.", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <BottomSheet onClose={onClose} title="Change PIN">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="oldPin">
            Old PIN
          </label>
          <input
            type="password"
            id="oldPin"
            className={styles.input}
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value)}
            required
            autoFocus
            disabled={isLoading}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="newPin">
            New PIN
          </label>
          <input
            type="password"
            id="newPin"
            className={styles.input}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="confirmPin">
            Confirm New PIN
          </label>
          <input
            type="password"
            id="confirmPin"
            className={styles.input}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className={styles.spinner}></span> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </BottomSheet>
  );
};

export default ChangePinSheet;
