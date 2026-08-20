import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import mark from "../../assets/mark.png";
import useToast from "../../hooks/useToast";
import { registerShop } from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [businessData, setBusinessData] = useState({
    shopName: "",
    engineerName: "",
    shopPhone: "",
    shopAddress: "",
    specialty: "",
  });

  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await registerShop(businessData, authData)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" || name === "password") {
      setAuthData((prev) => ({ ...prev, [name]: value }));
    } else {
      setBusinessData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.header}>
        <img src={mark} alt="Kostody" className={styles.logo} />
        <p className={styles.subtitle}>Register Your Shop</p>
      </div>

      <div className={styles.formArea}>
        {step === 1 ? (
          <>
            <h2 className={styles.stepTitle}>Business Profile</h2>
            <p className={styles.stepText}>
              Set up your digital workbench. This info appears on customer
              receipts.
            </p>

            <form onSubmit={handleBusinessSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="shopName">
                  Shop / Business Name
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  className={styles.input}
                  placeholder="e.g. TechFix Clinic"
                  value={businessData.shopName}
                  onChange={handleChange}
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="engineerName">
                  Lead Engineer Name
                </label>
                <input
                  type="text"
                  id="engineerName"
                  name="engineerName"
                  className={styles.input}
                  placeholder="Your full name"
                  value={businessData.engineerName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="shopPhone">
                  Contact Phone (WhatsApp)
                </label>
                <input
                  type="tel"
                  id="shopPhone"
                  name="shopPhone"
                  className={styles.input}
                  placeholder="e.g. 0801 234 5678"
                  value={businessData.shopPhone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="shopAddress">
                  Shop Address / Area
                </label>
                <input
                  type="text"
                  id="shopAddress"
                  name="shopAddress"
                  className={styles.input}
                  placeholder="e.g. Computer Village, Ikeja"
                  value={businessData.shopAddress}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="specialty">
                  Specialty
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  className={styles.select}
                  value={businessData.specialty}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select your specialty...</option>
                  <option value="general">
                    General Repairs (Hardware/Software)
                  </option>
                  <option value="hardware">Hardware / Microsoldering</option>
                  <option value="software">Software / Flashing</option>
                  <option value="board">Board Level Repairs</option>
                </select>
              </div>

              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={isLoading}
              >
                Continue
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className={styles.stepTitle}>Secure Your Account</h2>
            <p className={styles.stepText}>
              Set the email and password you'll use to sign in.
            </p>

            <form onSubmit={handleFinalRegister}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  placeholder="engineer@shop.com"
                  value={authData.email}
                  onChange={handleChange}
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.input}
                  placeholder="Create a strong password"
                  value={authData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span> Processing...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </>
        )}

        <p className={styles.loginText}>
          Already have an account?{" "}
          <span className={styles.loginLink} onClick={() => navigate("/login")}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
