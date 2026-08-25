import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Select, Option, Button, IconButton } from "../../ui";
import styles from "./Register.module.css";
import mark from "../../assets/mark.png";
import useToast from "../../hooks/useToast";
import { registerShop } from "../../services/api";

const SPECIALTIES = [
  { value: "general", label: "General Repairs (Hardware/Software)" },
  { value: "hardware", label: "Hardware / Microsoldering" },
  { value: "software", label: "Software / Flashing" },
  { value: "board", label: "Board Level Repairs" },
];

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [businessData, setBusinessData] = useState({
    shopName: "",
    engineerName: "",
    shopPhone: "",
    shopAddress: "",
    specialty: "",
  });
  const [authData, setAuthData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" || name === "password") {
      setAuthData((prev) => ({ ...prev, [name]: value }));
    } else {
      setBusinessData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);

    registerShop(businessData, authData)
      .then((data) => {
        if (data) {
          showToast("Registration successful! Please log in.", "success");
          navigate("/login");
        }
      })
      .catch((error) => {
        showToast(
          error.message || "Registration failed. Please try again.",
          "error",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <header className={styles.brand}>
          <img src={mark} alt="Kostody" className={styles.logo} />
          <span className={`${styles.portal} md-typescale-label-large`}>
            Register your shop
          </span>
        </header>

        <div className={styles.stepper}>
          <span className={`${styles.step} ${styles.stepOn}`}>
            <span className={styles.stepDot}>1</span> Business
          </span>
          <span className={styles.stepLine} />
          <span
            className={`${styles.step} ${step === 2 ? styles.stepOn : ""}`}
          >
            <span className={styles.stepDot}>2</span> Account
          </span>
        </div>

        {step === 1 ? (
          <div key="step1" className={styles.pane}>
            <div className={styles.intro}>
              <h1 className={`${styles.title} md-typescale-headline-small`}>
                Business profile
              </h1>
              <p className={`${styles.subtitle} md-typescale-body-medium`}>
                This information appears on your customer receipts.
              </p>
            </div>

            <form onSubmit={handleBusinessSubmit} className={styles.form}>
              <TextField
                label="Shop / business name"
                name="shopName"
                value={businessData.shopName}
                onChange={handleChange}
                leadingIcon="storefront"
                required
                disabled={isLoading}
              />
              <TextField
                label="Lead engineer name"
                name="engineerName"
                value={businessData.engineerName}
                onChange={handleChange}
                leadingIcon="badge"
                required
                disabled={isLoading}
              />
              <TextField
                label="Contact phone (WhatsApp)"
                name="shopPhone"
                type="tel"
                value={businessData.shopPhone}
                onChange={handleChange}
                leadingIcon="call"
                required
                disabled={isLoading}
              />
              <TextField
                label="Shop address / area"
                name="shopAddress"
                value={businessData.shopAddress}
                onChange={handleChange}
                leadingIcon="location_on"
                required
                disabled={isLoading}
              />
              <Select
                label="Specialty"
                name="specialty"
                value={businessData.specialty}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                {SPECIALTIES.map((s) => (
                  <Option key={s.value} value={s.value}>
                    {s.label}
                  </Option>
                ))}
              </Select>

              <Button
                type="submit"
                variant="filled"
                full
                trailing="arrow_forward"
                className={styles.submit}
              >
                Continue
              </Button>
            </form>
          </div>
        ) : (
          <div key="step2" className={styles.pane}>
            <div className={styles.intro}>
              <h1 className={`${styles.title} md-typescale-headline-small`}>
                Secure your account
              </h1>
              <p className={`${styles.subtitle} md-typescale-body-medium`}>
                Set the email and password you'll use to sign in.
              </p>
            </div>

            <form onSubmit={handleFinalRegister} className={styles.form}>
              <TextField
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                value={authData.email}
                onChange={handleChange}
                leadingIcon="mail"
                required
                disabled={isLoading}
              />
              <TextField
                label="Password"
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                value={authData.password}
                onChange={handleChange}
                leadingIcon="lock"
                required
                disabled={isLoading}
              >
                <IconButton
                  slot="trailing-icon"
                  type="button"
                  icon={showPw ? "visibility_off" : "visibility"}
                  label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((v) => !v)}
                />
              </TextField>

              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="text"
                  icon="arrow_back"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="filled"
                  disabled={isLoading}
                  className={styles.grow}
                >
                  {isLoading ? "Creating…" : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <p className={`${styles.footer} md-typescale-body-medium`}>
          Already have an account?{" "}
          <Button variant="text" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Register;
