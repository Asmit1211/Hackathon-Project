export interface WelcomeEmailPayload {
  email: string;
  name?: string;
}

/**
 * Sends a welcome email via a backend SMTP bridge or email service.
 * Configure VITE_MAIL_WEBHOOK_URL and VITE_MAIL_FROM in your env.
 */
export async function sendWelcomeEmail({ email, name }: WelcomeEmailPayload) {
  const env =
    (typeof window !== "undefined" ? window.__APP_ENV__ : undefined) ||
    (typeof process !== "undefined" ? process.env : undefined);
  const endpoint = env?.VITE_MAIL_WEBHOOK_URL;
  const from = env?.VITE_MAIL_FROM || "noreply@cursedrelics.shop";

  if (!endpoint) {
    const inDev = Boolean(env?.DEV) || env?.NODE_ENV !== "production";
    if (inDev) {
      // eslint-disable-next-line no-console
      console.warn("VITE_MAIL_WEBHOOK_URL not set; skipping welcome email for", email);
    }
    return;
  }

  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      from,
      subject: "Welcome to Cursed Relics",
      template: "welcome",
      variables: {
        name: name || "Seeker of Curses",
      },
    }),
  });
}
