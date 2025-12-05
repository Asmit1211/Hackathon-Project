const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/cursed_relics",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "super_secret_access_key_change_me",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "super_secret_refresh_key_change_me",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:8080",
  // Secrets must be provided via environment variables in real deployments.
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: process.env.SMTP_PORT || 465,
  SMTP_USERNAME: process.env.SMTP_USERNAME || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
  SMTP_FROM: process.env.SMTP_FROM || "noreply@cursedrelics.shop",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
};

module.exports = { ENV };
