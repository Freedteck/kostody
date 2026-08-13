import { useState } from "react";
import styles from "./ProcessCollection.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";
import { processPayment } from "../../services/api";

const ProcessCollection = ({
  onClose,
  onSuccess,
  jobDetails,
  outstandingBalance,
}) => {
  const [finalPayment, setFinalPayment] = useState("");
  const [phase, setPhase] = useState(
    outstandingBalance > 0 ? "payment" : "pin",
  );
  const [pin, setPin] = useState("");
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

  const handleProceedToPin = (e) => {
    e.preventDefault();
    setPhase("pin");
  };

  const submitPin = (finalPin) => {
    setIsLoading(true);
    setError(null);

    processPayment(jobDetails.id, finalPin, parseFloat(finalPayment || 0))
      .then(() => {
        onSuccess(finalPin, parseFloat(finalPayment || 0));
      })
      .catch((err) => {
        triggerError(err.message || "Invalid PIN");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleKeyPress = (val) => {
    if (isLoading) return;

    if (val === "del") {
      setPin(pin.slice(0, -1));
      setError(null);
    } else if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);

      if (newPin.length === 4) {
        submitPin(newPin);
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

  return (
    <BottomSheet
      onClose={onClose}
      title={phase === "payment" ? "Final Payment" : "Authorize Collection"}
    >
      {phase === "payment" && (
        <form className={styles.paymentPhase} onSubmit={handleProceedToPin}>
          <div className={styles.balanceDisplay}>
            <span className={styles.balanceLabel}>Outstanding Balance</span>
            <span className={styles.balanceAmount}>
              ₦{outstandingBalance.toLocaleString()}
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Cash Collected Now (₦)</label>
            <input
              type="number"
              className={styles.input}
              value={finalPayment}
              onChange={(e) => setFinalPayment(e.target.value)}
              placeholder="Enter amount paid by customer"
            />
          </div>

          <button type="submit" className={styles.proceedBtn}>
            Proceed to Customer Confirmation
          </button>
        </form>
      )}

      {phase === "pin" && (
        <div className={styles.pinPhase}>
          <div className={styles.jobSummary}>
            <h3 className={styles.summaryDevice}>{jobDetails?.deviceModel}</h3>
            <p className={styles.summaryFault}>
              Customer has tested device and is satisfied.
            </p>
          </div>

          <p className={styles.instruction}>
            {isLoading
              ? "Verifying..."
              : "Enter 4-digit PIN to finalize collection"}
          </p>

          <div
            className={`${styles.pinDots} ${isMismatch ? styles.shake : ""}`}
          >
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
                  onClick={() => handleKeyPress(key)}
                  type="button"
                  disabled={isLoading}
                >
                  {key === "del" ? "⌫" : key}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </BottomSheet>
  );
};

export default ProcessCollection;
