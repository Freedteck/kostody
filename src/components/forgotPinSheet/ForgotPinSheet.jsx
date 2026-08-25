import { useState } from "react";
import Sheet from "../../ui/Sheet";
import Keypad from "../../ui/Keypad";
import Button from "../../ui/Button";
import TextField from "../../ui/TextField";
import useToast from "../../hooks/useToast";
import { requestOtp, resetPin } from "../../services/api";
import styles from "./ForgotPinSheet.module.css";

const ForgotPinSheet = ({ onClose, onSuccess, initialPhone = "" }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [tempPin, setTempPin] = useState("");
  const [pinPhase, setPinPhase] = useState("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const sendCode = () => {
    if (!phone.trim()) {
      showToast("Enter your phone number", "error");
      return;
    }
    setLoading(true);
    requestOtp(phone.trim())
      .then(() => {
        showToast("Verification code sent", "success");
        setStep("otp");
      })
      .catch((e) => showToast(e.message || "Could not send code", "error"))
      .finally(() => setLoading(false));
  };

  const confirmCode = () => {
    if (otp.trim().length < 4) {
      showToast("Enter the code you received", "error");
      return;
    }
    setStep("pin");
  };

  const handlePin = (pin) => {
    if (pinPhase === "create") {
      setTempPin(pin);
      setPinPhase("confirm");
      setResetKey((k) => k + 1);
      return;
    }
    if (pin !== tempPin) {
      setError((e) => e + 1);
      return;
    }
    setLoading(true);
    resetPin(phone.trim(), otp.trim(), pin)
      .then(() => {
        showToast("PIN reset successfully", "success");
        onSuccess?.();
        onClose?.();
      })
      .catch((e) => {
        setError((x) => x + 1);
        showToast(e.message || "Reset failed", "error");
      })
      .finally(() => setLoading(false));
  };

  const titles = { phone: "Reset PIN", otp: "Enter Code", pin: "New PIN" };
  const subtitles = {
    phone: "We'll text a verification code to your phone.",
    otp: `Enter the 6-digit code sent to ${phone}.`,
    pin:
      pinPhase === "create"
        ? "Choose a new 4-digit PIN."
        : "Re-enter your new PIN to confirm.",
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={titles[step]}
      subtitle={subtitles[step]}
      dismissible={!loading}
    >
      {step === "phone" && (
        <div className={styles.form}>
          <TextField
            label="Phone Number"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leadingIcon="call"
          />
          <Button variant="filled" full onClick={sendCode} disabled={loading}>
            {loading ? "Sending…" : "Send Code"}
          </Button>
        </div>
      )}

      {step === "otp" && (
        <div className={styles.form}>
          <TextField
            label="Verification Code"
            name="otp"
            type="text"
            inputmode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            leadingIcon="sms"
          />
          <Button variant="filled" full onClick={confirmCode}>
            Continue
          </Button>
          <Button variant="text" full onClick={sendCode} disabled={loading}>
            Resend Code
          </Button>
        </div>
      )}

      {step === "pin" && (
        <Keypad
          onComplete={handlePin}
          error={error}
          resetKey={resetKey}
          disabled={loading}
          instruction={loading ? "Resetting…" : undefined}
        />
      )}
    </Sheet>
  );
};

export default ForgotPinSheet;
