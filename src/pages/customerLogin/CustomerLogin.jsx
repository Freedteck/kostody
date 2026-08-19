import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerLogin.module.css";
import {
  checkCustomer,
  loginCustomer,
  createCustomer,
} from "../../services/api";
import useToast from "../../hooks/useToast";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [stage, setStage] = useState("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [tempPin, setTempPin] = useState("");
  const [existingUserName, setExistingUserName] = useState("");
  // const [customerId, setCustomerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (
      stage === "createPin" ||
      stage === "confirmPin" ||
      stage === "enterPin"
    ) {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    checkCustomer(phone)
      .then((res) => {
        if (res.exists) {
          setExistingUserName(res.name);
          // setCustomerId(res.customerId);
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
    setStage("createPin");
  };

  const handlePinChange = (e, index) => {
    if (isLoading) return;
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 3 && value) {
      const fullPin = newPin.join("");

      if (stage === "createPin") {
        setTempPin(fullPin);
        setPin(["", "", "", ""]);
        setStage("confirmPin");
      } else if (stage === "confirmPin") {
        if (fullPin === tempPin) {
          submitRegistration(fullPin);
        } else {
          showToast("PINs do not match", "error");
          setPin(["", "", "", ""]);
          setTempPin("");
          setStage("createPin");
        }
      } else if (stage === "enterPin") {
        submitLogin(fullPin);
      }
    }
  };

  const submitLogin = (finalPin) => {
    setIsLoading(true);
    loginCustomer(phone, finalPin)
      .then((data) => {
        localStorage.setItem("kostody_token", data.token);
        localStorage.setItem("kostody_customer", JSON.stringify(data.data));
        navigate("/c/dashboard");
      })
      .catch((err) => {
        showToast(err.message || "Invalid PIN", "error");
        setPin(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const submitRegistration = (finalPin) => {
    setIsLoading(true);
    createCustomer(phone, name, finalPin)
      .then((data) => {
        localStorage.setItem("kostody_token", data.token);
        localStorage.setItem("kostody_customer", JSON.stringify(data.data));
        navigate("/c/dashboard");
      })
      .catch((err) => {
        showToast(err.message || "Failed to create account", "error");
        setPin(["", "", "", ""]);
        setStage("phone");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderHeader = () => {
    if (isLoading) return "Processing...";
    if (stage === "phone") return "Welcome to Kostody";
    if (stage === "name") return "Create Account";
    if (stage === "createPin") return "Create 4-digit PIN";
    if (stage === "confirmPin") return "Confirm your PIN";
    if (stage === "enterPin")
      return `Welcome back, ${existingUserName.split(" ")[0]}!`;
  };

  const renderSubtext = () => {
    if (stage === "phone")
      return "Enter your phone number to continue. If you are new, we will set you up.";
    if (stage === "name")
      return "We couldn't find an account for this number. What should we call you?";
    if (stage === "createPin")
      return "This PIN will be used to authorize all your repair agreements securely.";
    if (stage === "confirmPin") return "Re-enter the PIN to confirm.";
    if (stage === "enterPin") return "Enter your 4-digit PIN to log in.";
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <h1 className={styles.logo}>Kostody</h1>
        <p className={styles.subtitle}>Customer Portal</p>
      </div>

      <div className={styles.formArea}>
        <h2 className={styles.welcomeTitle}>{renderHeader()}</h2>
        <p className={styles.welcomeText}>{renderSubtext()}</p>

        {stage === "phone" && (
          <form className={styles.inputForm} onSubmit={handlePhoneSubmit}>
            <input
              type="tel"
              className={styles.input}
              placeholder="e.g. 0801 234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoFocus
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {stage === "name" && (
          <form className={styles.inputForm} onSubmit={handleNameSubmit}>
            <input
              type="text"
              className={styles.input}
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              Continue
            </button>
          </form>
        )}

        {(stage === "createPin" ||
          stage === "confirmPin" ||
          stage === "enterPin") && (
          <div className={styles.pinContainer}>
            <div className={styles.pinRow}>
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  inputMode="numeric"
                  maxLength="1"
                  className={styles.pinInput}
                  value={digit}
                  onChange={(e) => handlePinChange(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerLogin;
