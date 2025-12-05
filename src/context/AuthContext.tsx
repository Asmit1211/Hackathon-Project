import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Modal control
  authModalOpen: boolean;
  authModalMode: "login" | "signup";
  openLogin: () => void;
  openSignup: () => void;
  closeAuthModal: () => void;
  // Require auth helper
  requireAuth: (action: () => void | Promise<void>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const pendingActionRef = useRef<(() => void | Promise<void>) | null>(null);
  const { toast } = useToast();

  const googleProvider = new GoogleAuthProvider();
  const appleProvider = new OAuthProvider("apple.com");

  const notifyBackendLogin = async (user: User | null) => {
    if (!user?.email) return;
    try {
      await fetch(`${API_BASE_URL}/auth/firebase-login-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || undefined,
        }),
      });
    } catch (err) {
      console.error("Failed to notify backend of Firebase login", err);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  const runPendingAction = async () => {
    const action = pendingActionRef.current;
    if (!action) return;
    pendingActionRef.current = null;
    try {
      await action();
    } catch (err) {
      console.error("Error running pending action", err);
      toast({
        title: "Something stirred in the dark",
        description: "Your action failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      void notifyBackendLogin(cred.user);
      toast({
        title: "Welcome back to the crypt",
        description: "The relics remember you.",
      });
      setAuthModalOpen(false);
      await runPendingAction();
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      void notifyBackendLogin(cred.user);
      toast({
        title: "The veil parted for Google",
        description: `Welcome, ${cred.user.displayName || cred.user.email}.`,
      });
      setAuthModalOpen(false);
      await runPendingAction();
    } catch (err) {
      console.error("Google sign-in failed", err);
      toast({
        title: "The ritual was interrupted",
        description: "Google sign-in failed. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithApple = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, appleProvider);
      void notifyBackendLogin(cred.user);
      toast({
        title: "An apple falls in the dark",
        description: `Welcome, ${cred.user.displayName || cred.user.email}.`,
      });
      setAuthModalOpen(false);
      await runPendingAction();
    } catch (err) {
      console.error("Apple sign-in failed", err);
      toast({
        title: "The omen was unclear",
        description: "Apple sign-in failed. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user && name) {
        await updateProfile(cred.user, { displayName: name });
      }

      // Ask backend to send spooky welcome email via SMTP (fire-and-forget)
      fetch(`${API_BASE_URL}/auth/firebase-signup-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      }).catch((err) => {
        console.error("Failed to notify backend of Firebase signup", err);
      });

      toast({
        title: "Account conjured",
        description: "Your cursed profile has been bound.",
      });
      setAuthModalOpen(false);
      await runPendingAction();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    toast({
      title: "You left the shop",
      description: "The relics await your return.",
    });
  };

  const openLogin = () => {
    setAuthModalMode("login");
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthModalMode("signup");
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const requireAuth = (action: () => void | Promise<void>) => {
    if (user) {
      void action();
      return;
    }
    pendingActionRef.current = action;
    setAuthModalMode("login");
    setAuthModalOpen(true);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: loading || initializing,
      login,
      loginWithGoogle,
      loginWithApple,
      signup,
      logout,
      authModalOpen,
      authModalMode,
      openLogin,
      openSignup,
      closeAuthModal,
      requireAuth,
    }),
    [user, loading, initializing, authModalOpen, authModalMode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
