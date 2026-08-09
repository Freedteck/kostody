import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerLogin.module.css";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [tempPin, setTempPin] = useState("");
  const [existingUserName, setExistingUserName] = useState("");

  // Refs for focus management
  const inputRefs = useRef([]);

  // Force focus to the first PIN box whenever the stage changes to a PIN entry phase
  useEffect(() => {
    if (
      stage === "createPin" ||
      stage === "confirmPin" ||
      stage === "enterPin"
    ) {
      inputRefs.current[0]?.focus();
    }
  }, [stage]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone === "08012345678") {
      setExistingUserName("Chidi O.");
      setStage("enterPin");
    } else {
      setStage("name");
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setStage("createPin");
  };

  const handlePinChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Use ref instead of getElementById
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
        if (fullPin === tempPin) navigate("/c/dashboard");
        else {
          alert("PINs do not match. Please try again.");
          setPin(["", "", "", ""]);
          setTempPin("");
          setStage("createPin");
        }
      } else if (stage === "enterPin") {
        navigate("/c/dashboard");
      }
    }
  };

  const renderHeader = () => {
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
            />
            <button type="submit" className={styles.submitBtn}>
              Continue
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
            />
            <button type="submit" className={styles.submitBtn}>
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
                  ref={(el) => (inputRefs.current[index] = el)} // Attach ref here
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
