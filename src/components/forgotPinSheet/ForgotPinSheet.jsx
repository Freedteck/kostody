import { useState, useRef, useEffect } from "react";
import styles from "./ForgotPinSheet.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";
import { requestOtp, resetPin } from "../../services/api";
import useToast from "../../hooks/useToast";

const ForgotPinSheet = ({ onClose, onSuccess, initialPhone = "" }) => {
  const [phase, setPhase] = useState("phone");
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [tempPin, setTempPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMismatch, setIsMismatch] = useState(false);
  const { showToast } = useToast();

  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [phase]);

  const triggerError = (message) => {
    setError(message);
    setIsMismatch(true);
    setTimeout(() => {
      setIsMismatch(false);
      setError(null);
      if (phase === "otp") setOtp(["", "", "", ""]);
      if (phase === "newPin") setNewPin(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }, 1500);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    requestOtp(phone)
      .then((data) => {
        showToast(`OTP sent! (Dev: ${data.devOtp})`, "success");
        setPhase("otp");
      })
      .catch((err) => {
        setError(err.message || "Failed to send OTP");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOtpChange = (e, index) => {
    if (isLoading) return;
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 3 && value) {
      setPhase("newPin");
      showToast("OTP Entered. Set new PIN.", "success");
    }
  };

  const handleNewPinChange = (e, index) => {
    if (isLoading) return;
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newPinArr = [...newPin];
    newPinArr[index] = value;
    setNewPin(newPinArr);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 3 && value) {
      const fullPin = newPinArr.join("");

      if (!tempPin) {
        setTempPin(fullPin);
        setNewPin(["", "", "", ""]);
        setError(null);
        inputRefs.current[0]?.focus();
      } else {
        if (fullPin === tempPin) {
          submitReset(fullPin);
        } else {
          triggerError("PINs do not match");
          setTempPin("");
        }
      }
    }
  };

  const submitReset = (finalPin) => {
    setIsLoading(true);
    setError(null);

    resetPin(phone, otp.join(""), finalPin)
      .then(() => {
        showToast("PIN reset successfully.", "success");
        onSuccess();
      })
      .catch((err) => {
        triggerError(err.message || "Failed to reset PIN");
        setPhase("otp");
        setTempPin("");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getTitle = () => {
    if (isLoading && phase === "phone") return "Sending...";
    if (isLoading && phase === "newPin") return "Saving...";
    if (phase === "phone") return "Forgot PIN";
    if (phase === "otp") return "Enter OTP";
    if (phase === "newPin" && !tempPin) return "Set New PIN";
    return "Confirm New PIN";
  };

  return (
    <BottomSheet onClose={onClose} title={getTitle()}>
      <div className={styles.container}>
        {phase === "phone" && (
          <form className={styles.form} onSubmit={handlePhoneSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className={`${styles.input} ${error ? styles.inputError : ""}`}
                placeholder="e.g. 0801 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoFocus
                disabled={isLoading}
              />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {phase === "otp" && (
          <div className={styles.pinContainer}>
            <p className={styles.instruction}>
              Enter the 4-digit code sent to {phone}
            </p>
            <div
              className={`${styles.pinRow} ${isMismatch ? styles.shake : ""}`}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  inputMode="numeric"
                  maxLength="1"
                  className={`${styles.pinInput} ${isMismatch ? styles.errorDot : ""}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  disabled={isLoading}
                />
              ))}
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
        )}

        {phase === "newPin" && (
          <div className={styles.pinContainer}>
            <p className={styles.instruction}>
              {!tempPin ? "Create a 4-digit PIN" : "Confirm your 4-digit PIN"}
            </p>
            <div
              className={`${styles.pinRow} ${isMismatch ? styles.shake : ""}`}
            >
              {newPin.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  inputMode="numeric"
                  maxLength="1"
                  className={`${styles.pinInput} ${isMismatch ? styles.errorDot : ""}`}
                  value={digit}
                  onChange={(e) => handleNewPinChange(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  disabled={isLoading}
                />
              ))}
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

export default ForgotPinSheet;
