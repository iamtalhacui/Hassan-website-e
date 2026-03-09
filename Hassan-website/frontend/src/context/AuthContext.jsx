import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const BACKEND = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on app load ──────────────────────────────────────────
  useEffect(() => {
    const savedUser  = localStorage.getItem("hs_user");
    const savedToken = localStorage.getItem("hs_token");
    if (savedUser && savedToken) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    setIsLoading(false);
  }, []);

  // ── Sign Up ──────────────────────────────────────────────────────────────
  const signup = async (name, email, password, adminCode = "") => {
    if (!name || !email || !password) throw new Error("All fields are required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    try {
      const res = await fetch(`${BACKEND}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, adminCode }),
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      return data;
    } catch (err) {
      if (err.name === "AbortError" || err.message.includes("fetch") || err.message.includes("Failed")) {
        return signupLocal(name, email, password, adminCode);
      }
      throw err;
    }
  };

  const signupLocal = (name, email, password, adminCode) => {
    const allUsers = JSON.parse(localStorage.getItem("hs_all_users") || "[]");
    if (allUsers.find(u => u.email === email)) throw new Error("Email already registered");
    const newUser = {
      id: "local_" + Date.now(), name, email, password,
      isAdmin: adminCode === "ADMIN123",
      createdAt: new Date().toISOString(),
    };
    allUsers.push(newUser);
    localStorage.setItem("hs_all_users", JSON.stringify(allUsers));
    return { message: "Account created successfully" };
  };

  // ── Sign In ──────────────────────────────────────────────────────────────
  const signin = async (email, password) => {
    if (!email || !password) throw new Error("Email and password are required");
    try {
      const res = await fetch(`${BACKEND}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid email or password");
      localStorage.setItem("hs_token", data.token);
      localStorage.setItem("hs_user",  JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      if (err.name === "AbortError" || err.message.includes("fetch") || err.message.includes("Failed")) {
        return signinLocal(email, password);
      }
      throw err;
    }
  };

  const signinLocal = (email, password) => {
    const allUsers = JSON.parse(localStorage.getItem("hs_all_users") || "[]");
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const userToSave = { id: found.id, name: found.name, email: found.email, isAdmin: found.isAdmin, createdAt: found.createdAt };
    localStorage.setItem("hs_user",  JSON.stringify(userToSave));
    localStorage.setItem("hs_token", "local_token_" + Date.now());
    setUser(userToSave);
    return userToSave;
  };

  // ── Real Google Login ────────────────────────────────────────────────────
  // credential is the Google ID token supplied by the Google Identity SDK
  const googleLogin = async (credential) => {
    try {
      const res = await fetch(`${BACKEND}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Google sign-in failed");
      }

      const data = await res.json();
      localStorage.setItem("hs_token", data.token);
      localStorage.setItem("hs_user",  JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      // Fallback for offline/local mode (works without backend)
      if (err.name === "AbortError" || err.message.includes("fetch") || err.message.includes("Failed")) {
        const googleUser = {
          id:        "google_" + Date.now(),
          name:      "Google User",
          email:     "google@example.com",
          picture:   "",
          isAdmin:   false,
          isGoogle:  true,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("hs_token", "google_" + Date.now());
        localStorage.setItem("hs_user",  JSON.stringify(googleUser));
        setUser(googleUser);
        return googleUser;
      }
      throw new Error(err.message || "Google login failed");
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("hs_user");
    localStorage.removeItem("hs_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, signin, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};