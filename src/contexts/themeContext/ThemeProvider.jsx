import { useCallback, useEffect, useState } from "react";
import { ThemeContext } from "./theme";

const STORAGE_KEY = "kostody_theme";
const THEME_COLOR = { light: "#fff8f6", dark: "#1a120e" };

const readStored = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
};

const systemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const getInitial = () => {
  const stored = readStored();
  return stored
    ? { theme: stored, isSystem: false }
    : { theme: systemTheme(), isSystem: true };
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
};

export const ThemeProvider = ({ children }) => {
  const [{ theme, isSystem }, setState] = useState(getInitial);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!isSystem) return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) =>
      setState({ theme: e.matches ? "dark" : "light", isSystem: true });
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [isSystem]);

  const setTheme = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, next);
    setState({ theme: next, isSystem: false });
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => {
      const next = prev.theme === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return { theme: next, isSystem: false };
    });
  }, []);

  const followSystem = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ theme: systemTheme(), isSystem: true });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, isSystem, setTheme, toggleTheme, followSystem }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
