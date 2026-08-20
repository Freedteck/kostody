import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import mark from "../../assets/mark.png";
import useToast from "../../hooks/useToast";
import useShop from "../../hooks/useShop";
import { loginShop } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setShop } = useShop();
  const [isLoading, setIsLoading] = useState(false);

  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await loginShop(authData)
      .then((data) => {
        localStorage.setItem("kostody_token", data.token);
        setShop(data.data);

        showToast("Login successful! Welcome back.", "success");
        navigate("/app/dashboard");
      })
      .catch((error) => {
        showToast(
          error.message || "Invalid credentials. Please try again.",
          "error",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <img src={mark} alt="Kostody" className={styles.logo} />
        <p className={styles.subtitle}>Engineer Portal</p>
      </div>

      <div className={styles.formArea}>
        <h2 className={styles.welcomeTitle}>Welcome Back</h2>
        <p className={styles.welcomeText}>
          Sign in to manage your workbench and active jobs.
        </p>

        <form onSubmit={handleLogin}>
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
              placeholder="••••••••"
              value={authData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span> Processing...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className={styles.registerText}>
            Don't have an account?{" "}
            <span
              className={styles.registerLink}
              onClick={() => navigate("/register")}
            >
              Register your Shop
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
