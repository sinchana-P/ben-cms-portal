import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SessionProvider } from "@/context/session";
import { AppDataProvider } from "@/context/appData";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <AppDataProvider>
          <App />
        </AppDataProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
