import { useState } from "react";
import Sheet from "../../ui/Sheet";
import Keypad from "../../ui/Keypad";
import TextField from "../../ui/TextField";
import Button from "../../ui/Button";
import { processPayment } from "../../services/api";
import styles from "./ProcessCollection.module.css";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(0);

  const handleProceed = (e) => {
    e.preventDefault();
    setPhase("pin");
  };

  const submitPin = (finalPin) => {
    setIsLoading(true);
    processPayment(jobDetails.id, finalPin, parseFloat(finalPayment || 0))
      .then(() => {
        onSuccess(finalPin, parseFloat(finalPayment || 0));
      })
      .catch(() => {
        setError((n) => n + 1);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const remaining = outstandingBalance - parseFloat(finalPayment || 0);

  return (
    <Sheet
      open
      onClose={onClose}
      title={phase === "payment" ? "Final Payment" : "Authorize Collection"}
      dismissible={!isLoading}
    >
      {phase === "payment" ? (
        <form className={styles.form} onSubmit={handleProceed}>
          <div className={styles.balance}>
            <span className="md-typescale-body-medium">Outstanding balance</span>
            <span
              className={`${styles.balanceAmount} md-typescale-headline-small`}
            >
              ₦{outstandingBalance.toLocaleString()}
            </span>
          </div>

          <TextField
            className={styles.field}
            label="Cash collected now"
            type="number"
            inputmode="numeric"
            prefixText="₦ "
            value={finalPayment}
            onChange={(e) => setFinalPayment(e.target.value)}
            placeholder="Amount paid by customer"
          />

          {finalPayment !== "" && (
            <p className={`${styles.remaining} md-typescale-body-small`}>
              Balance after this payment: ₦{remaining.toLocaleString()}
            </p>
          )}

          <Button type="submit" variant="filled" full trailing="arrow_forward">
            Continue to PIN
          </Button>
        </form>
      ) : (
        <div className={styles.pinPhase}>
          <div className={styles.deviceNote}>
            <p className={`${styles.deviceName} md-typescale-title-medium`}>
              {jobDetails?.deviceModel}
            </p>
            <p className="md-typescale-body-small">
              Customer has tested the device and is satisfied.
            </p>
          </div>
          <Keypad
            onComplete={submitPin}
            error={error}
            disabled={isLoading}
            instruction={
              isLoading
                ? "Verifying…"
                : "Enter customer PIN to finalize collection"
            }
          />
        </div>
      )}
    </Sheet>
  );
};

export default ProcessCollection;
