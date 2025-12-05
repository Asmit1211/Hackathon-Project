require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { logger } = require("./utils/logger");
const { ENV } = require("./config/env");

const server = http.createServer(app);

async function start() {
  try {
    await connectDB();
    server.listen(ENV.PORT, () => {
      logger.info(`Cursed Relics API listening on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
    });
  } catch (err) {
    logger.error("Failed to start server", { error: err });
    process.exit(1);
  }
}

start();

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { error: err });
  process.exit(1);
});
