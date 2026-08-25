import { useState } from "react";
import Sheet from "../../ui/Sheet";
import Keypad from "../../ui/Keypad";

const PinPad = ({
  onProcess,
  onClose,
  title,
  isNewUser = false,
  onForgotPin,
}) => {
  const [phase, setPhase] = useState(isNewUser ? "create" : "enter");
  const [tempPin, setTempPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const instruction = loading
    ? "Verifying…"
    : phase === "create"
      ? "Create a 4-digit PIN"
      : phase === "confirm"
        ? "Confirm your 4-digit PIN"
        : "Enter your 4-digit PIN";

  const handleComplete = (pin) => {
    if (phase === "create") {
      setTempPin(pin);
      setPhase("confirm");
      setResetKey((k) => k + 1);
      return;
    }
    if (phase === "confirm" && pin !== tempPin) {
      setError((e) => e + 1);
      return;
    }
    setLoading(true);
    onProcess(pin)
      .catch(() => setError((e) => e + 1))
      .finally(() => setLoading(false));
  };

  return (
    <Sheet open onClose={onClose} title={title} dismissible={!loading}>
      <Keypad
        onComplete={handleComplete}
        error={error}
        resetKey={resetKey}
        disabled={loading}
        instruction={instruction}
        onForgot={phase === "enter" && !loading ? onForgotPin : undefined}
      />
    </Sheet>
  );
};

export default PinPad;
