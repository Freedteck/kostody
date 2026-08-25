import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./material.js";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/themeContext/ThemeProvider.jsx";
import { ToastProvider } from "./contexts/toastContext/ToastProvider.jsx";
import ShopProvider from "./contexts/shopContext/ShopContext.jsx";
import { router } from "./router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <ShopProvider>
          <RouterProvider router={router} />
        </ShopProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
