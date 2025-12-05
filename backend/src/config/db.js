const mongoose = require("mongoose");
const { ENV } = require("./env");
const { logger } = require("../utils/logger");

async function connectDB() {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info("Connected to MongoDB Atlas for Cursed Relics");
    logger.info(`Database: ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    logger.error("MongoDB connection error", { error: err });
    throw err;
  }
}

module.exports = { connectDB };
