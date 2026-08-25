import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "../../ui";
import ForgotPinSheet from "../../components/forgotPinSheet/ForgotPinSheet";
import mark from "../../assets/mark.png";
import {
  checkCustomer,
  loginCustomer,
  createCustomer,
} from "../../services/api";
import useToast from "../../hooks/useToast";
import styles from "./CustomerLogin.module.css";

const onlyDigits = (value) => value.replace(/\D/g, "").slice(0, 4);

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stage, setStage] = useState("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [existingUserName, setExistingUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        setPin("");
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
        setPin("");
        setConfirmPin("");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEnterPin = (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      showToast("Enter your 4-digit PIN", "error");
      return;
    }
    submitLogin(pin);
  };

  const handleCreatePin = (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      showToast("Choose a 4-digit PIN", "error");
      return;
    }
    if (pin !== confirmPin) {
      showToast("PINs do not match", "error");
      return;
    }
    submitRegistration(pin);
  };

  const resetToPhone = () => {
    setStage("phone");
    setName("");
    setPin("");
    setConfirmPin("");
    setExistingUserName("");
  };

  const heading = () => {
    if (stage === "phone") return "Welcome to Kostody";
    if (stage === "name") return "Create your account";
    if (stage === "createPin") return "Set your PIN";
    return `Welcome back, ${existingUserName.split(" ")[0] || ""}`;
  };

  const subtext = () => {
    if (stage === "phone")
      return "Enter your phone number to sign in or set up your account.";
    if (stage === "name")
      return "We couldn't find that number. What should we call you?";
    if (stage === "createPin")
      return "This PIN authorizes all your repair agreements.";
    return "Enter your 4-digit PIN to sign in.";
  };

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
              <Button type="button" variant="text" full onClick={resetToPhone}>
                Use a different number
              </Button>
            </form>
          )}

          {stage === "createPin" && (
            <form className={styles.form} onSubmit={handleCreatePin}>
              <TextField
                label="Create PIN"
                type="password"
                inputmode="numeric"
                autocomplete="off"
                maxlength={4}
                value={pin}
                onChange={(e) => setPin(onlyDigits(e.target.value))}
                leadingIcon="lock"
                required
                disabled={isLoading}
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
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
              <Button
                type="button"
                variant="text"
                full
                onClick={resetToPhone}
                disabled={isLoading}
              >
                Use a different number
              </Button>
            </form>
          )}

          {stage === "enterPin" && (
            <form className={styles.form} onSubmit={handleEnterPin}>
              <TextField
                label="PIN"
                type="password"
                inputmode="numeric"
                autocomplete="off"
                maxlength={4}
                value={pin}
                onChange={(e) => setPin(onlyDigits(e.target.value))}
                leadingIcon="lock"
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
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
              <Button
                type="button"
                variant="text"
                full
                onClick={() => setIsForgotOpen(true)}
                disabled={isLoading}
              >
                Forgot PIN?
              </Button>
              <Button
                type="button"
                variant="text"
                full
                onClick={resetToPhone}
                disabled={isLoading}
              >
                Use a different number
              </Button>
            </form>
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
