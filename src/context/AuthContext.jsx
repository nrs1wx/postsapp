import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  signUpWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  getAuthErrorMessage,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function run(action) {
    setError("");
    try {
      return await action();
    } catch (err) {
      setError(getAuthErrorMessage(err));
      return null;
    }
  }

  const value = {
    user,
    loading,
    error,
    clearError: () => setError(""),
    signup: (email, password) => run(() => signUpWithEmail(email, password)),
    login: (email, password) => run(() => loginWithEmail(email, password)),
    loginWithGoogle: () => run(() => loginWithGoogle()),
    logout: () => run(() => logoutUser()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
