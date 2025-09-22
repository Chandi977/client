import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { UserProvider } from "./components/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
