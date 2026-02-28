// src/main.tsx
import "./styles/globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./app/providers/AuthProvider";
import { SidebarThemeProvider } from "./app/providers/SidebarThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <SidebarThemeProvider>
        <App />
      </SidebarThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);