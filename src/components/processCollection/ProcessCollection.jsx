import { useState } from "react";
import styles from "./ProcessCollection.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const ProcessCollection = ({
  onClose,
  onSuccess,
  jobDetails,
  outstandingBalance,
}) => {
  const [finalPayment, setFinalPayment] = useState("");
  const [phase, setPhase] = useState("payment"); // "payment" -> "pin"
  const [pin, setPin] = useState("");

  const handleProceedToPin = (e) => {
    e.preventDefault();
    // If they logged a payment, we pass it up later. For now, just move to PIN phase.
    setPhase("pin");
  };

  const handleKeyPress = (val) => {
    if (val === "del") {
      setPin(pin.slice(0, -1));
    } else if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4) {
        // Pass the final payment amount (or 0 if none) and the pin back to JobDetails
        setTimeout(() => onSuccess(newPin, parseFloat(finalPayment || 0)), 200);
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

          {outstandingBalance > 0 && (
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
          )}

          <button type="submit" className={styles.proceedBtn}>
            Proceed to Customer Confirmation
          </button>
        </form>
      )}

      {phase === "pin" && (
        <div className={styles.pinPhase}>
          <div className={styles.jobSummary}>
            <h3 className={styles.summaryDevice}>{jobDetails?.device}</h3>
            <p className={styles.summaryFault}>
              Customer has tested device and is satisfied.
            </p>
          </div>

          <p className={styles.instruction}>
            Enter 4-digit PIN to finalize collection
          </p>

          <div className={styles.pinDots}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${styles.dot} ${pin.length > i ? styles.active : ""}`}
              ></div>
            ))}
          </div>

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
