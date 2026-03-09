const express  = require("express");
const cors   = require("cors");
require("dotenv").config();

const authRoutes    = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes   = require("./routes/orders");
const { connectDB } = require("./db");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);

app.get("/", (req, res) => res.json({ message: "Hassan Store API Running" }));

// MongoDB connection is handled in ./db.js

// ── Start Server ──────────────────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("─────────────────────────────────────");
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API: http://localhost:${PORT}`);
    console.log(`🔑 Admin: admin@hassanstore.com / Admin@123`);
    console.log("─────────────────────────────────────");
  });
};

startServer();
