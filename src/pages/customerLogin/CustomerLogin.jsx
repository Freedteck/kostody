import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Keypad, Icon } from "../../ui";
import ForgotPinSheet from "../../components/forgotPinSheet/ForgotPinSheet";
import mark from "../../assets/mark.png";
import {
  checkCustomer,
  loginCustomer,
  createCustomer,
} from "../../services/api";
import useToast from "../../hooks/useToast";
import styles from "./CustomerLogin.module.css";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stage, setStage] = useState("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [tempPin, setTempPin] = useState("");
  const [existingUserName, setExistingUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const store = (data) => {
    localStorage.setItem("kostody_token", data.token);
    localStorage.setItem("kostody_customer", JSON.stringify(data.data));
    navigate("/c/dashboard");
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast("Enter your phone number", "error");
      return;
    }
    setIsLoading(true);
    checkCustomer(phone)
      .then((res) => {
        if (res.exists) {
          setExistingUserName(res.name);
          setStage("enterPin");
        } else {
          setStage("name");
        }
      })
      .catch((err) => {
        showToast(err.message || "Failed to check account", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Enter your name", "error");
      return;
    }
    setStage("createPin");
  };

  const submitLogin = (finalPin) => {
    setIsLoading(true);
    loginCustomer(phone, finalPin)
      .then(store)
      .catch((err) => {
        showToast(err.message || "Invalid PIN", "error");
        setError((x) => x + 1);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const submitRegistration = (finalPin) => {
    setIsLoading(true);
    createCustomer(phone, name, finalPin)
      .then(store)
      .catch((err) => {
        showToast(err.message || "Failed to create account", "error");
        setError((x) => x + 1);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleKeypadComplete = (pin) => {
    if (stage === "createPin") {
      setTempPin(pin);
      setStage("confirmPin");
      setResetKey((k) => k + 1);
    } else if (stage === "confirmPin") {
      if (pin === tempPin) {
        submitRegistration(pin);
      } else {
        showToast("PINs do not match", "error");
        setError((x) => x + 1);
      }
    } else if (stage === "enterPin") {
      submitLogin(pin);
    }
  };

  const resetToPhone = () => {
    setStage("phone");
    setName("");
    setTempPin("");
    setExistingUserName("");
  };

  const heading = () => {
    if (stage === "phone") return "Welcome to Kostody";
    if (stage === "name") return "Create your account";
    if (stage === "createPin") return "Set your PIN";
    if (stage === "confirmPin") return "Confirm your PIN";
    return `Welcome back, ${existingUserName.split(" ")[0] || ""}`;
  };

  const subtext = () => {
    if (stage === "phone")
      return "Enter your phone number to sign in or set up your account.";
    if (stage === "name")
      return "We couldn't find that number. What should we call you?";
    if (stage === "createPin")
      return "This PIN authorizes all your repair agreements.";
    if (stage === "confirmPin") return "Re-enter your PIN to confirm.";
    return "Enter your 4-digit PIN to sign in.";
  };

  const keypadInstruction = () => {
    if (isLoading) return "Please wait…";
    if (stage === "createPin") return "Create a 4-digit PIN";
    if (stage === "confirmPin") return "Confirm your 4-digit PIN";
    return "Enter your 4-digit PIN";
  };

  const isPinStage =
    stage === "createPin" || stage === "confirmPin" || stage === "enterPin";

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <header className={styles.brand}>
          <img src={mark} alt="Kostody" className={styles.logo} />
          <span className={`${styles.portal} md-typescale-label-large`}>
            Customer Portal
          </span>
        </header>

        <div className={styles.intro}>
          <h1 className={`${styles.title} md-typescale-headline-medium`}>
            {heading()}
          </h1>
          <p className={`${styles.subtitle} md-typescale-body-medium`}>
            {subtext()}
          </p>
        </div>

        <div key={stage} className={styles.stage}>
          {stage === "phone" && (
            <form className={styles.form} onSubmit={handlePhoneSubmit}>
              <TextField
                label="Phone number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leadingIcon="call"
                required
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="filled"
                full
                disabled={isLoading}
                className={styles.submit}
              >
                {isLoading ? "Checking…" : "Continue"}
              </Button>
            </form>
          )}

          {stage === "name" && (
            <form className={styles.form} onSubmit={handleNameSubmit}>
              <TextField
                label="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leadingIcon="person"
                required
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="filled"
                full
                className={styles.submit}
              >
                Continue
              </Button>
              <Button variant="text" full onClick={resetToPhone}>
                Use a different number
              </Button>
            </form>
          )}

          {isPinStage && (
            <div className={styles.pinArea}>
              <Keypad
                onComplete={handleKeypadComplete}
                error={error}
                resetKey={resetKey}
                disabled={isLoading}
                instruction={keypadInstruction()}
                onForgot={
                  stage === "enterPin" && !isLoading
                    ? () => setIsForgotOpen(true)
                    : undefined
                }
              />
              <button
                type="button"
                className={styles.changeNumber}
                onClick={resetToPhone}
                disabled={isLoading}
              >
                <Icon name="arrow_back" size={16} />
                Use a different number
              </button>
            </div>
          )}
        </div>
      </div>

      {isForgotOpen && (
        <ForgotPinSheet
          initialPhone={phone}
          onClose={() => setIsForgotOpen(false)}
          onSuccess={() => setIsForgotOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerLogin;
