import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { X, UserPlus } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import FogOverlay from "@/components/FogOverlay";

const SignupModal = () => {
  const { authModalOpen, authModalMode, closeAuthModal, openLogin, signup, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!authModalOpen || authModalMode !== "signup") return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signup(name, email, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-shadow-black/80 backdrop-blur-sm">
      <FogOverlay />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 260 }}
        className="relative z-10 w-full max-w-md rounded-lg border border-antique-brass/40 bg-gradient-to-b from-shadow-black via-sepia-brown/80 to-shadow-black shadow-2xl shadow-black/80 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
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

          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-antique-brass glow-pulse" />
            <div>
              <h2 className="font-gothic text-2xl text-bone-white tracking-wide">Bind a New Soul</h2>
              <p className="text-xs text-muted-foreground/80 font-serif">
                Create an account to claim cursed dolls, charms, and haunted stones.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Name for the ledger
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md bg-shadow-black/70 border border-border/60 px-3 py-2 text-sm text-bone-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-antique-brass/70"
                placeholder="Lilith Nightshade"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Email for hauntings
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-shadow-black/70 border border-border/60 px-3 py-2 text-sm text-bone-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-antique-brass/70"
                placeholder="you@cursedmail.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Secret incantation
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-shadow-black/70 border border-border/60 px-3 py-2 text-sm text-bone-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-antique-brass/70"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-antique-brass hover:bg-antique-brass/80 text-shadow-black font-gothic tracking-wider shadow-shift"
            >
              {loading ? "Binding..." : "Create Cursed Account"}
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-foreground font-serif">
            Already cursed with us?{' '}
            <button
              type="button"
              onClick={openLogin}
              className="font-semibold text-antique-brass hover:text-antique-brass/80 underline-offset-4 hover:underline"
            >
              Sign in instead
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupModal;
