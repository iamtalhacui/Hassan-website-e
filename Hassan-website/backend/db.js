const mongoose = require("mongoose");

const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");

// Create Default Admin if not exists (kept alongside DB init)
const createDefaultAdmin = async () => {
  try {
    const User = require("./models/User");
    const existing = await User.findOne({ email: "admin@hassanstore.com" });
    if (!existing) {
      const hashed = await bcrypt.hash("Admin@123", 10);
      await User.create({
        name: "Admin",
        email: "admin@hassanstore.com",
        password: hashed,
        isAdmin: true,
      });
      console.log("✅ Default admin created: admin@hassanstore.com / Admin@123");
    } else {
      console.log("✅ Admin account already exists");
    }
  } catch (err) {
    console.error("❌ Could not create admin:", err.message);
  }
};

// Connect to MongoDB with retry and optional in-memory fallback
// Default to local MongoDB at mongodb://localhost:27017/hassan when MONGO_URI is not set
// (include a database name to avoid ambiguous default DB behavior)
const connectDB = async (retries = 5) => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/hassan";

  const connectTo = async (mongouri) => {
    await mongoose.connect(mongouri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📦 Database: ${mongoose.connection.name}`);
    await createDefaultAdmin();
  };

  // Try the configured Mongo URI first (if provided)
  if (uri) {
    for (let i = 1; i <= retries; i++) {
      try {
        console.log(`🔄 Connecting to MongoDB... (attempt ${i}/${retries}) -> ${uri}`);
        await connectTo(uri);
        return true;
      } catch (err) {
        // Log full error object for better diagnostics
        console.error(`❌ Connection attempt ${i} failed:`);
        console.error(err);
        if (i < retries) {
          console.log(`⏳ Retrying in 3 seconds...`);
          await new Promise((res) => setTimeout(res, 3000));
        }
      }
    }

    console.error("❌ All connection attempts failed. Falling back to in-memory MongoDB.");
  } else {
    console.warn("⚠️ MONGO_URI is not defined; using in-memory MongoDB instance.");
  }

  // Fallback: use in-memory MongoDB for local / CI environments
  const mongod = await MongoMemoryServer.create();
  const inMemoryUri = mongod.getUri();
  console.log("🧪 Using in-memory MongoDB:", inMemoryUri);
  await connectTo(inMemoryUri);
  return true;
};

// Handle mongoose connection events
mongoose.connection.on("disconnected", () => console.log("⚠️  MongoDB Disconnected"));
mongoose.connection.on("reconnected", () => console.log("✅ MongoDB Reconnected"));
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

module.exports = { connectDB };
