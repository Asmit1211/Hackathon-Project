const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

// Lightweight schema used when Firebase-only auth is in charge of authentication
// and we just want the backend to send a login/ signup notification email.
const firebaseLoginNotifySchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(1).optional(),
  }),
});

const firebaseSignupNotifySchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(1).optional(),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  firebaseLoginNotifySchema,
  firebaseSignupNotifySchema,
};
