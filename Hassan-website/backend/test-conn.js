const mongoose = require("mongoose");

// A tiny script to test connection to local MongoDB and print full errors.
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/hassan";

(async () => {
  try {
    console.log(`Testing MongoDB connection -> ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Connection successful. Database:", mongoose.connection.name);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection test failed:");
    console.error(err);
    process.exit(1);
  }
})();
