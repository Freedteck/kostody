import { useState } from "react";
import Sheet from "../../ui/Sheet";
import Keypad from "../../ui/Keypad";
import { changePin } from "../../services/api";
import useToast from "../../hooks/useToast";

const ChangePinSheet = ({ onClose, onSuccess, customerId }) => {
  const { showToast } = useToast();
  const [phase, setPhase] = useState("old");
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const submitChange = (oldVal, newVal) => {
    setLoading(true);
    changePin(customerId, oldVal, newVal)
      .then(() => {
        showToast("PIN changed successfully.", "success");
        onSuccess();
      })
      .catch((err) => {
        showToast(err.message || "Failed to change PIN", "error");
        setOldPin("");
        setNewPin("");
        setPhase("old");
        setError((e) => e + 1);
        setResetKey((k) => k + 1);
      })
      .finally(() => setLoading(false));
  };

  const handleComplete = (pin) => {
    if (phase === "old") {
      setOldPin(pin);
      setPhase("new");
      setResetKey((k) => k + 1);
    } else if (phase === "new") {
      setNewPin(pin);
      setPhase("confirm");
      setResetKey((k) => k + 1);
    } else if (pin === newPin) {
      submitChange(oldPin, pin);
    } else {
      setError((e) => e + 1);
    }
  };

  const title = loading
    ? "Verifying…"
    : phase === "old"
      ? "Enter current PIN"
      : phase === "new"
        ? "Create new PIN"
        : "Confirm new PIN";

  const instruction = loading
    ? "Updating your PIN…"
    : phase === "old"
      ? "Enter your current 4-digit PIN"
      : phase === "new"
        ? "Choose a new 4-digit PIN"
        : "Re-enter your new PIN to confirm";

  return (
    <Sheet open onClose={onClose} title={title} dismissible={!loading}>
      <Keypad
        onComplete={handleComplete}
        error={error}
        resetKey={resetKey}
        disabled={loading}
        instruction={instruction}
      />
    </Sheet>
  );
};

export default ChangePinSheet;
