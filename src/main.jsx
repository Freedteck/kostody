import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./material.js";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/themeContext/ThemeProvider.jsx";
import { router } from "./router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
