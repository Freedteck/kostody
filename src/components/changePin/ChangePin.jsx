import { useState, useRef, useEffect } from "react";
import styles from "./ChangePin.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";
import { changePin } from "../../services/api";
import useToast from "../../hooks/useToast";

const ChangePinSheet = ({ onClose, onSuccess, customerId }) => {
  const [phase, setPhase] = useState("old");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMismatch, setIsMismatch] = useState(false);
  const { showToast } = useToast();

  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [phase]);

  const triggerError = (message) => {
    setError(message);
    setIsMismatch(true);

    setTimeout(() => {
      setIsMismatch(false);
      setPin(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }, 1500);
  };

  const handlePinChange = (e, index) => {
    if (isLoading) return;
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    if (error || isMismatch) {
      setError(null);
      setIsMismatch(false);
    }

    const newPinArr = [...pin];
    newPinArr[index] = value;
    setPin(newPinArr);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 3 && value) {
      const fullPin = newPinArr.join("");

      if (phase === "old") {
        setOldPin(fullPin);
        setPin(["", "", "", ""]);
        setError(null);
        setPhase("new");
      } else if (phase === "new") {
        setNewPin(fullPin);
        setPin(["", "", "", ""]);
        setPhase("confirm");
      } else if (phase === "confirm") {
        if (fullPin === newPin) {
          submitChange(oldPin, newPin);
        } else {
          triggerError("PINs do not match");
        }
      }
    }
  };

  const submitChange = async (oldPinVal, newPinVal) => {
    setIsLoading(true);
    setError(null);

    await changePin(customerId, oldPinVal, newPinVal)
      .then(() => {
        showToast("PIN changed successfully.", "success");
        onSuccess();
      })
      .catch((err) => {
        triggerError(err.message || "Failed to change PIN");
        setPhase("old");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getTitle = () => {
    if (isLoading) return "Verifying...";
    if (phase === "old") return "Enter Old PIN";
    if (phase === "new") return "Enter New PIN";
    return "Confirm New PIN";
  };

  return (
    <BottomSheet onClose={onClose} title={getTitle()}>
      <div className={styles.pinContainer}>
        <div className={`${styles.pinRow} ${isMismatch ? styles.shake : ""}`}>
          {pin.map((digit, index) => (
            <input
              key={index}
              type="password"
              inputMode="numeric"
              maxLength="1"
              className={`${styles.pinInput} ${isMismatch ? styles.errorDot : ""}`}
              value={digit}
              onChange={(e) => handlePinChange(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              disabled={isLoading}
            />
          ))}
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    </BottomSheet>
  );
};

export default ChangePinSheet;
