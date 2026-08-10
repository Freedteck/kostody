import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
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
        <h1 className={styles.logo}>Kostody</h1>
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
              Choose how you want to sign in going forward.
            </p>

            <button
              type="button"
              className={styles.googleBtn}
              onClick={() => navigate("/app/dashboard")}
              disabled={isLoading}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Register with Google
            </button>

            <div className={styles.divider}>
              <span>OR USE EMAIL</span>
            </div>

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
