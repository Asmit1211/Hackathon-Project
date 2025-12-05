const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

const { ENV } = require("./config/env");
const apiRouter = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Trust proxy (for rate limiting, HTTPS on reverse proxies)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS
// In development, allow any origin so the Vite dev server can talk to the API
// without CORS issues. In other environments, fall back to the configured
// CORS_ORIGIN.
app.use(
  cors({
    origin:
      ENV.NODE_ENV === "development" || !ENV.CORS_ORIGIN
        ? true
        : ENV.CORS_ORIGIN,
    credentials: true,
  })
);

// Logging
if (ENV.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitization
app.use(mongoSanitize());
app.use(xssClean());

// Rate limiting (global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// API routes
app.use("/api/v1", apiRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "The relics are restless but online." });
});

// 404 and error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
