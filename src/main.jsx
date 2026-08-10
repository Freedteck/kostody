import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.js";
import { ToastProvider } from "./contexts/toastContext/ToastProvider.jsx";
import ShopProvider from "./contexts/shopContext/ShopContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <ShopProvider>
        <RouterProvider router={router} />
      </ShopProvider>
    </ToastProvider>
  </StrictMode>,
);
