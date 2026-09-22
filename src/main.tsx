// main.tsx (ejemplo)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



import "./assets/css/global.css";

// import "./assets/css/auth.css";

import "./assets/css/sidebar.css";

// import "./assets/css/header.css";


import "./assets/css/footer.css";
// import "./index.css";

import "./assets/css/custom-bootstrap.css"



import { AuthProvider } from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
