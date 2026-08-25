import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, IconButton } from "../../ui";
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
  const [showPw, setShowPw] = useState(false);
  const [authData, setAuthData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    loginShop(authData)
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
    <div className={styles.screen}>
      <div className={styles.card}>
        <header className={styles.brand}>
          <img src={mark} alt="Kostody" className={styles.logo} />
          <span className={`${styles.portal} md-typescale-label-large`}>
            Engineer Portal
          </span>
        </header>

        <div className={styles.intro}>
          <h1 className={`${styles.title} md-typescale-headline-medium`}>
            Welcome back
          </h1>
          <p className={`${styles.subtitle} md-typescale-body-medium`}>
            Sign in to manage your workbench and active jobs.
          </p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
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
            autoComplete="current-password"
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

          <Button
            type="submit"
            variant="filled"
            full
            disabled={isLoading}
            className={styles.submit}
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className={`${styles.footer} md-typescale-body-medium`}>
          Don't have an account?{" "}
          <Button variant="text" onClick={() => navigate("/register")}>
            Register your shop
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Login;
