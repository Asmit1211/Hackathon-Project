const nodemailer = require("nodemailer");
const { ENV } = require("../config/env");
const { logger } = require("../utils/logger");

const isSmtpConfigured = Boolean(ENV.SMTP_HOST && ENV.SMTP_USERNAME && ENV.SMTP_PASSWORD);

let transporter;
if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: Number(ENV.SMTP_PORT),
    secure: Number(ENV.SMTP_PORT) === 465,
    auth: {
      user: ENV.SMTP_USERNAME,
      pass: ENV.SMTP_PASSWORD,
    },
  });
}

async function sendLoginNotification({ to, name }) {
  if (!isSmtpConfigured || !transporter) {
    logger.warn("SMTP not configured; skipping login notification email");
    return;
  }

  try {
    await transporter.sendMail({
      from: ENV.SMTP_FROM,
      to,
      subject: "You entered the Cursed Relics vault",
      text: `Hi ${name || "Seeker"},\n\nWe noticed a successful sign-in to Cursed Relics. If this wasn't you, please reset your password immediately.\n\nThe spirits are watching,\nCursed Relics`,
      html: `<p>Hi ${name || "Seeker"},</p>
        <p>We noticed a successful sign-in to <strong>Cursed Relics</strong>. If this wasn't you, please reset your password immediately.</p>
        <p>The spirits are watching,<br/>Cursed Relics</p>`,
    });
    logger.info("Login notification email sent", { to });
  } catch (err) {
    logger.error("Failed to send login notification email", { error: err.message, to });
  }
}

module.exports = {
  sendLoginNotification,
};

