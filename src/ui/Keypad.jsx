import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import styles from "./Keypad.module.css";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

const Keypad = ({
  length = 4,
  onComplete,
  error = 0,
  resetKey = 0,
  disabled = false,
  onForgot,
  forgotLabel = "Forgot PIN?",
  instruction,
}) => {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [prevError, setPrevError] = useState(error);
  const [prevReset, setPrevReset] = useState(resetKey);
  const completedRef = useRef(false);

  if (error !== prevError) {
    setPrevError(error);
    if (error) setShake(true);
  }
  if (resetKey !== prevReset) {
    setPrevReset(resetKey);
    setPin("");
  }

  const press = useCallback(
    (val) => {
      if (disabled) return;
      if (val === "back") {
        setPin((p) => p.slice(0, -1));
        return;
      }
      setPin((p) => (p.length < length ? p + val : p));
    },
    [disabled, length],
  );

  useEffect(() => {
    if (pin.length === length && !completedRef.current) {
      completedRef.current = true;
      onComplete?.(pin);
    }
    if (pin.length < length) completedRef.current = false;
  }, [pin, length, onComplete]);

  useEffect(() => {
    if (!shake) return undefined;
    const t1 = setTimeout(() => setShake(false), 500);
    const t2 = setTimeout(() => setPin(""), 480);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shake]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      else if (e.key === "Backspace") press("back");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  return (
    <div className={styles.keypad}>
      {instruction && (
        <p className={`${styles.instruction} md-typescale-body-large`}>
          {instruction}
        </p>
      )}
      <div className={`${styles.dots} ${shake ? styles.shake : ""}`}>
        {Array.from({ length }).map((_, i) => (
          <span
            key={i}
            className={[
              styles.dot,
              i < pin.length ? styles.filled : "",
              shake ? styles.error : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>
      <div className={styles.grid}>
        {KEYS.map((k, i) => {
          if (k === "") return <span key={i} className={styles.spacer} />;
          if (k === "back")
            return (
              <button
                key={i}
                type="button"
                className={`${styles.key} ${styles.ghost}`}
                onClick={() => press("back")}
                disabled={disabled}
                aria-label="Delete"
              >
                <Icon name="backspace" size={26} />
              </button>
            );
          return (
            <button
              key={i}
              type="button"
              className={styles.key}
              onClick={() => press(k)}
              disabled={disabled}
            >
              {k}
            </button>
          );
        })}
      </div>
      {onForgot && (
        <button type="button" className={styles.forgot} onClick={onForgot}>
          {forgotLabel}
        </button>
      )}
    </div>
  );
};

export default Keypad;
