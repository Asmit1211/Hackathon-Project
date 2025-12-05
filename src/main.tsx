import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

declare global {
  interface Window {
    __APP_ENV__?: ImportMetaEnv;
  }
}

if (typeof window !== "undefined") {
  window.__APP_ENV__ = import.meta.env;
}
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CartProvider>
      <App />
      {/* Global auth modals rendered once at root */}
      <LoginModal />
      <SignupModal />
    </CartProvider>
  </AuthProvider>,
);
