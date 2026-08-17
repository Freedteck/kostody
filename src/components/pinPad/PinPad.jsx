import { useState } from "react";
import styles from "./PinPad.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const PinPad = ({
  onProcess,
  onClose,
  title,
  isNewUser = false,
  onForgotPin,
}) => {
  const [pin, setPin] = useState("");
  const [tempPin, setTempPin] = useState("");
  const [phase, setPhase] = useState(isNewUser ? "create" : "enter");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMismatch, setIsMismatch] = useState(false);

  const triggerError = (message) => {
    setError(message);
    setIsMismatch(true);
    setTimeout(() => {
      setPin("");
      setIsMismatch(false);
      setError(null);
    }, 1000);
  };

  const handlePress = (val) => {
    if (isLoading) return;

    if (val === "del") {
      setPin(pin.slice(0, -1));
      setError(null);
    } else if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);

      if (newPin.length === 4) {
        if (phase === "create") {
          setTempPin(newPin);
          setTimeout(() => setPin(""), 150);
          setPhase("confirm");
        } else if (phase === "confirm") {
          if (newPin === tempPin) {
            submitPin(newPin);
          } else {
            triggerError("PINs do not match");
          }
        } else if (phase === "enter") {
          submitPin(newPin);
        }
      }
    }
  };

  const submitPin = (finalPin) => {
    setIsLoading(true);
    setError(null);
    onProcess(finalPin)
      .catch((err) => {
        triggerError(err.message || "Invalid PIN");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "blank",
    "0",
    "del",
  ];

  const getInstruction = () => {
    if (isLoading) return "Verifying...";
    if (phase === "create") return "Create a 4-digit PIN";
    if (phase === "confirm") return "Confirm your 4-digit PIN";
    return "Enter your 4-digit PIN";
  };

  return (
    <BottomSheet onClose={onClose} title={title}>
      <div className={styles.pinContainer}>
        <p className={styles.instruction}>{getInstruction()}</p>

        <div className={`${styles.pinDots} ${isMismatch ? styles.shake : ""}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${styles.dot} ${pin.length > i ? styles.active : ""} ${isMismatch ? styles.errorDot : ""}`}
            ></div>
          ))}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.keypad}>
          {keys.map((key, index) => {
            if (key === "blank")
              return <div key={index} className={styles.blankKey}></div>;

            return (
              <button
                key={index}
                className={`${styles.key} ${key === "del" ? styles.delKey : ""}`}
                onClick={() => handlePress(key)}
                disabled={isLoading}
              >
                {key === "del" ? "⌫" : key}
              </button>
            );
          })}
        </div>

        {phase === "enter" && !isLoading && onForgotPin && (
          <button className={styles.forgotBtn} onClick={onForgotPin}>
            Forgot PIN?
          </button>
        )}
      </div>
    </BottomSheet>
  );
};

export default PinPad;
