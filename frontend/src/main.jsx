import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/auth.context.jsx";

/** decide which bundle to mount */

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
     <App />
  </AuthProvider>
);
