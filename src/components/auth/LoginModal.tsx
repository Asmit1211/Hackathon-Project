import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { X, Skull, Apple } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import FogOverlay from "@/components/FogOverlay";

const LoginModal = () => {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openSignup,
    login,
    loginWithGoogle,
    loginWithApple,
    loading,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!authModalOpen || authModalMode !== "login") return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-shadow-black/80 backdrop-blur-sm">
      <FogOverlay />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 260 }}
        className="relative z-10 w-full max-w-md rounded-lg border border-blood-rust/40 bg-gradient-to-b from-shadow-black via-sepia-brown/80 to-shadow-black shadow-2xl shadow-black/80 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img src="/hero-haunted-shop.jpg" alt="Haunted texture" className="h-full w-full object-cover" />
        </div>

        <div className="relative p-8 space-y-6">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 text-ash-gray hover:text-bone-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.span
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Skull className="h-8 w-8 text-blood-rust glow-pulse" />
            </motion.span>
            <div>
              <h2 className="font-gothic text-2xl text-bone-white tracking-wide">Enter the Cursed Shop</h2>
              <p className="text-xs text-muted-foreground/80 font-serif">
                Sign in to bind items to your cart, wishlist, and eternal checkout.
              </p>
            </div>
          </motion.div>

          <div className="space-y-3">
            <motion.button
              type="button"
              onClick={loginWithGoogle}
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0 0 22px rgba(255,255,255,0.12)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-ash-gray bg-shadow-black/70 px-3 py-2 text-sm font-gothic uppercase tracking-wide text-bone-white hover:bg-shadow-black/90 transition-colors"
            >
              <span className="h-4 w-4 rounded-full bg-blood-rust/70 shadow-shift" />
              <span>Continue with Google</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={loginWithApple}
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0 0 22px rgba(255,255,255,0.12)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-ash-gray bg-shadow-black/80 px-3 py-2 text-sm font-gothic uppercase tracking-wide text-bone-white hover:bg-shadow-black transition-colors"
            >
              <Apple className="h-4 w-4" />
              <span>Continue with Apple</span>
            </motion.button>

            <div className="flex items-center gap-3 py-1 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span className="font-serif tracking-widest uppercase">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Email of the living
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-shadow-black/70 border border-border/60 px-3 py-2 text-sm text-bone-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blood-rust/70"
                placeholder="you@midnightmail.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Secret incantation
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-shadow-black/70 border border-border/60 px-3 py-2 text-sm text-bone-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blood-rust/70"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blood-rust hover:bg-blood-rust/80 text-bone-white font-gothic tracking-wider shadow-shift"
            >
              {loading ? "Summoning..." : "Enter the Relic Vault"}
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-foreground font-serif">
            New to Cursed Relics?{' '}
            <button
              type="button"
              onClick={openSignup}
              className="font-semibold text-antique-brass hover:text-antique-brass/80 underline-offset-4 hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
