import { useState } from "react";
import styles from "./PinPad.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const PinPad = ({ onSuccess, onClose, title, isNewUser = false }) => {
  const [pin, setPin] = useState("");
  const [tempPin, setTempPin] = useState(""); // Holds the first PIN during creation
  const [phase, setPhase] = useState(isNewUser ? "create" : "enter");

  const handlePress = (val) => {
    if (val === "del") {
      setPin(pin.slice(0, -1));
    } else if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);

      if (newPin.length === 4) {
        if (phase === "create") {
          // Save the first PIN, clear dots, move to confirm phase
          setTempPin(newPin);
          setTimeout(() => setPin(""), 150);
          setPhase("confirm");
        } else if (phase === "confirm") {
          if (newPin === tempPin) {
            setTimeout(() => onSuccess(newPin), 200);
          } else {
            // PINs don't match, reset everything
            alert("PINs do not match. Please try again.");
            setPin("");
            setTempPin("");
            setPhase("create");
          }
        } else if (phase === "enter") {
          // Existing user just entering
          setTimeout(() => onSuccess(newPin), 200);
        }
      }
    }
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
    if (phase === "create") return "Create a 4-digit PIN";
    if (phase === "confirm") return "Confirm your 4-digit PIN";
    return "Enter your 4-digit PIN";
  };

  return (
    <BottomSheet onClose={onClose} title={title}>
      <div className={styles.pinContainer}>
        <p className={styles.instruction}>{getInstruction()}</p>

        {/* PIN Dots */}
        <div className={styles.pinDots}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${styles.dot} ${pin.length > i ? styles.active : ""}`}
            ></div>
          ))}
        </div>

        {/* Custom Keypad */}
        <div className={styles.keypad}>
          {keys.map((key, index) => {
            if (key === "blank")
              return <div key={index} className={styles.blankKey}></div>;

            return (
              <button
                key={index}
                className={`${styles.key} ${key === "del" ? styles.delKey : ""}`}
                onClick={() => handlePress(key)}
              >
                {key === "del" ? "⌫" : key}
              </button>
            );
          })}
        </div>

        {/* Forgot PIN link (Only for existing users entering PIN) */}
        {phase === "enter" && (
          <button
            className={styles.forgotBtn}
            onClick={() => alert("Mock: SMS sent to reset PIN.")}
          >
            Forgot PIN?
          </button>
        )}
      </div>
    </BottomSheet>
  );
};

export default PinPad;
