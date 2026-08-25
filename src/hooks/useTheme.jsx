import { useContext } from "react";
import { ThemeContext } from "../contexts/themeContext/theme";

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context) {
    return context;
  }
};

export default useTheme;
