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

function buildSpookyWelcomeHtml(name, context) {
  const safeName = name || "Seeker of Shadows";
  const actionLine =
    context === "signup"
      ? "Your soul has been etched into our cursed ledger."
      : "The wards shuddered as you stepped once more into our vault.";

  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to Cursed Relics</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: #050308;
          color: #f5efe7;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .wrapper {
          width: 100%;
          padding: 40px 0;
          background: radial-gradient(circle at top, #2b0b0e 0, #050308 55%, #000000 100%);
        }
        .card {
          max-width: 560px;
          margin: 0 auto;
          background: linear-gradient(145deg, #09040d, #140805);
          border-radius: 16px;
          border: 1px solid rgba(255, 85, 85, 0.35);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.9);
          overflow: hidden;
        }
        .header {
          padding: 24px 28px 16px;
          background: radial-gradient(circle at top left, #6b1a1a 0, #050308 55%);
          border-bottom: 1px solid rgba(255, 85, 85, 0.4);
        }
        .title {
          font-family: "Cinzel", "Times New Roman", serif;
          letter-spacing: 0.18em;
          font-size: 13px;
          text-transform: uppercase;
          color: rgba(255, 210, 170, 0.8);
        }
        .headline {
          margin-top: 8px;
          font-family: "Cinzel", "Times New Roman", serif;
          font-size: 26px;
          letter-spacing: 0.08em;
          color: #f9f4ec;
        }
        .body {
          padding: 22px 28px 28px;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(245, 239, 231, 0.9);
        }
        .body p {
          margin: 0 0 14px;
        }
        .tagline {
          margin-top: 18px;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255, 84, 84, 0.06);
          border: 1px dashed rgba(255, 84, 84, 0.45);
          font-size: 12px;
          color: rgba(255, 210, 170, 0.9);
          font-style: italic;
        }
        .sig {
          margin-top: 16px;
        }
        .sig-name {
          font-family: "Cinzel", "Times New Roman", serif;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 11px;
        }
        .footer {
          padding: 14px 20px 18px;
          font-size: 11px;
          color: rgba(180, 168, 160, 0.8);
          text-align: center;
          background: #050308;
        }
        .seal {
          display: inline-block;
          margin-bottom: 10px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 84, 84, 0.6);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(255, 214, 185, 0.9);
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="card">
          <div class="header">
            <div class="title">cursed relics occult emporium</div>
            <div class="headline">Welcome, ${safeName}</div>
          </div>
          <div class="body">
            <p>In the hush between heartbeats, our shop felt your presence.</p>
            <p>${actionLine}</p>
            <p>
              From this moment on, every doll, charm, stone and artifact you claim may
              whisper back to you in the dark. Keep this message close &mdash; it is the
              only warning you'll receive.
            </p>
            <p>
              Should you awaken anything that refuses to sleep again, please do not
              reply to this email. Some doors only open one way.
            </p>
            <div class="tagline">
              ⚰️  Beware: once an artifact chooses you, it rarely lets go.
            </div>
            <div class="sig">
              <div class="sig-name">the curators of cursed relics</div>
              <div>Guardians of the vault and its very patient inhabitants.</div>
            </div>
          </div>
          <div class="footer">
            <div class="seal">bound in shadow</div>
            <div>
              If this was not you, burn this message under a waning moon and reset
              your credentials at once.
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
}

async function sendWelcomeEmail({ to, name, context = "login" }) {
  if (!isSmtpConfigured || !transporter) {
    logger.warn("SMTP not configured; skipping welcome email", { to, context });
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: ENV.SMTP_FROM,
      to,
      subject: context === "signup" ? "Your name just appeared in our ledger" : "The vault stirs at your return",
      html: buildSpookyWelcomeHtml(name, context),
    });

    logger.info("Welcome Email Sent Successfully", { to, context, messageId: info.messageId });
    // Explicit console log per requirements
    // eslint-disable-next-line no-console
    console.log("Welcome Email Sent Successfully");
    return true;
  } catch (err) {
    logger.error("Failed to send welcome email", {
      error: err.message,
      to,
      context,
    });
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
};

