const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// DEFAULT ADMIN CREDENTIALS - Used when MongoDB is unavailable
const DEFAULT_ADMIN_EMAIL = "admin@hassanstore.com";
const DEFAULT_ADMIN_PASSWORD = "Admin@123";
const DEFAULT_ADMIN_NAME = "System Admin";

// Helper to verify Google ID token (uses public Google endpoint)
const verifyGoogleToken = async (idToken) => {
  if (!idToken) throw new Error("Missing idToken");
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Invalid Google token");
  return res.json();
};

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email,
      password: hashed,
      isAdmin: adminCode === "ADMIN123",
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for default admin account first (works even without MongoDB)
    if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: "admin-system", name: DEFAULT_ADMIN_NAME, email: DEFAULT_ADMIN_EMAIL, isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({ 
        token, 
        user: { id: "admin-system", name: DEFAULT_ADMIN_NAME, email: DEFAULT_ADMIN_EMAIL, isAdmin: true }
      });
    }
    
    // Try to find user in database
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // If user exists but has no password (e.g. created via Google), do not allow password sign in
    if (!user.password) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google Sign In (token-based)
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    const payload = await verifyGoogleToken(idToken);

    const email = payload.email;
    const name = payload.name || "Google User";
    const googleId = payload.sub;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        isAdmin: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;