import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      // AJOUT : containerStyle garantit que le conteneur global des toasts
      // est au-dessus de toutes les couches CSS de ton application.
      containerStyle={{
        zIndex: 99999,
      }}
      toastOptions={{
        duration: 6000,
        style: {
          background: "#FFFFFF",
          color: "#101828",
          fontFamily: "'Rubik', sans-serif",
          borderRadius: "12px",
          padding: "16px",
          maxWidth: "400px",
          fontSize: "14px",
          fontWeight: "400",
          border: "1px solid #E2E8F0",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#FFFFFF",
          },
          style: {
            borderLeft: "6px solid #10B981",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF233C",
            secondary: "#FFFFFF",
          },
          style: {
            borderLeft: "6px solid #EF233C",
          },
        },
      }}
    />
  </StrictMode>,
);
