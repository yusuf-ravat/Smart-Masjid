// index.jsx or main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(  
  <React.StrictMode>
      <GoogleOAuthProvider clientId="800134392758-pglltf5instte2sas1q6s27q376jeimk.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
  </React.StrictMode>
  
);
