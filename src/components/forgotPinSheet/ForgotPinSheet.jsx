import { useState } from "react";
import Sheet from "../../ui/Sheet";
import Button from "../../ui/Button";
import TextField from "../../ui/TextField";
import useToast from "../../hooks/useToast";
import { requestOtp, resetPin } from "../../services/api";
import styles from "./ForgotPinSheet.module.css";

const onlyDigits = (value) => value.replace(/\D/g, "").slice(0, 4);

const ForgotPinSheet = ({ onClose, onSuccess, initialPhone = "" }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

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

  const submitReset = () => {
    if (newPin.length < 4) {
      showToast("Choose a 4-digit PIN", "error");
      return;
    }
    if (newPin !== confirmPin) {
      showToast("PINs do not match", "error");
      return;
    }
    setLoading(true);
    resetPin(phone.trim(), otp.trim(), newPin)
      .then(() => {
        showToast("PIN reset successfully", "success");
        onSuccess?.();
        onClose?.();
      })
      .catch((e) => {
        showToast(e.message || "Reset failed", "error");
        setNewPin("");
        setConfirmPin("");
      })
      .finally(() => setLoading(false));
  };

  const titles = { phone: "Reset PIN", otp: "Enter Code", pin: "New PIN" };
  const subtitles = {
    phone: "We'll text a verification code to your phone.",
    otp: `Enter the code sent to ${phone}.`,
    pin: "Choose a new 4-digit PIN.",
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
          <Button variant="filled" full onClick={confirmCode} disabled={loading}>
            Continue
          </Button>
          <Button variant="text" full onClick={sendCode} disabled={loading}>
            Resend Code
          </Button>
        </div>
      )}

      {step === "pin" && (
        <div className={styles.form}>
          <TextField
            label="New PIN"
            type="password"
            inputmode="numeric"
            autocomplete="off"
            maxlength={4}
            value={newPin}
            onChange={(e) => setNewPin(onlyDigits(e.target.value))}
            leadingIcon="lock"
          />
          <TextField
            label="Confirm PIN"
            type="password"
            inputmode="numeric"
            autocomplete="off"
            maxlength={4}
            value={confirmPin}
            onChange={(e) => setConfirmPin(onlyDigits(e.target.value))}
            leadingIcon="lock"
          />
          <Button variant="filled" full onClick={submitReset} disabled={loading}>
            {loading ? "Resetting…" : "Reset PIN"}
          </Button>
        </div>
      )}
    </Sheet>
  );
};

export default ForgotPinSheet;
