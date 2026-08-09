import { useState, useRef, useEffect } from "react";
import styles from "./ChangePin.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const ChangePinSheet = ({ onClose, onSuccess }) => {
  const [phase, setPhase] = useState("old"); // old, new, confirm
  const [pin, setPin] = useState(["", "", "", ""]);
  const [tempPin, setTempPin] = useState("");

  // Create a reference to hold all input elements
  const inputRefs = useRef([]);

  // Whenever the phase changes, focus the first input box
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [phase]);

  const handlePinChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move to next input if there is a value
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // If last digit entered
    if (index === 3 && value) {
      const fullPin = newPin.join("");
      if (phase === "old") {
        // Mock verify old pin (assuming 1234 is correct for testing)
        if (fullPin === "1234") {
          setPin(["", "", "", ""]);
          setPhase("new");
        } else {
          alert("Incorrect old PIN.");
          setPin(["", "", "", ""]);
          inputRefs.current[0]?.focus(); // Refocus first box on error
        }
      } else if (phase === "new") {
        setTempPin(fullPin);
        setPin(["", "", "", ""]);
        setPhase("confirm");
      } else if (phase === "confirm") {
        if (fullPin === tempPin) {
          onSuccess();
        } else {
          alert("PINs do not match.");
          setPin(["", "", "", ""]);
          setTempPin("");
          setPhase("new");
        }
      }
    }
  };

  const getTitle = () => {
    if (phase === "old") return "Enter Old PIN";
    if (phase === "new") return "Enter New PIN";
    return "Confirm New PIN";
  };

  return (
    <BottomSheet onClose={onClose} title={getTitle()}>
      <div className={styles.pinContainer}>
        <div className={styles.pinRow}>
          {pin.map((digit, index) => (
            <input
              key={index}
              type="password"
              inputMode="numeric"
              maxLength="1"
              className={styles.pinInput}
              value={digit}
              onChange={(e) => handlePinChange(e, index)}
              ref={(el) => (inputRefs.current[index] = el)} // Attach ref here
            />
          ))}
        </div>
      </div>
    </BottomSheet>
  );
};

export default ChangePinSheet;
