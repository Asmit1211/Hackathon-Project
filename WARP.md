# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repo is a full-stack "Cursed Relics" shop built with:
- Frontend: Vite + React + TypeScript + shadcn-ui + Tailwind CSS in the repo root (`src/`)
- Backend: Node.js + Express + MongoDB in `backend/`

The two parts are developed and run independently but are coupled via HTTP APIs (notably payments) and shared environment configuration.

## Common commands

### Install dependencies

- Frontend (root):
  - `npm install`
- Backend API:
  - `cd backend`
  - `npm install`

### Frontend development

- Start Vite dev server (React app, default port 8080 as per `vite.config.ts`):
  - `npm run dev`
- Build production assets:
  - `npm run build`
- Preview production build locally:
  - `npm run preview`
- Lint the frontend codebase with ESLint:
  - `npm run lint`

### Frontend tests (Jest + Testing Library)

Jest is configured via `jest.config.cjs` to:
- Use `jsdom` test environment
- Transform `ts/tsx` with `ts-jest` using `tsconfig.app.json`
- Resolve the path alias `@/` to `src/`

Commands:
- Run all frontend tests:
  - `npm test`
- Run a single test file or pattern (Jest CLI passthrough):
  - `npm test -- auth-context.test.tsx`
  - `npm test -- src/__tests__/auth-context.test.tsx`

### Backend API development

From the `backend/` directory:
- Start API in watch mode (nodemon):
  - `npm run dev`
- Start API normally:
  - `npm start`
- Run backend Jest tests (unit/integration):
  - `npm test`
- Run a specific backend test file/pattern:
  - `npm test -- user.test.js`

The API listens on `ENV.PORT` (see `backend/src/config/env.js`), defaulting to `5000`.

### Frontend ↔ backend integration

By default the frontend checkout flow expects the API at:
- `VITE_API_BASE_URL` (default in code: `http://localhost:5000/api/v1`)

For local development you typically:
1. Run the backend: `cd backend && npm run dev`
2. In another shell, run the frontend from the repo root: `npm run dev`

Be aware that:
- Vite dev server is configured to run on `http://localhost:8080`
- The backend CORS default origin is `http://localhost:5173`

If you see CORS errors in the browser, align `CORS_ORIGIN` (backend) with the actual frontend origin.

## Frontend architecture

### Entry, routing, and providers

- `src/main.tsx` mounts `<App />` into `#root` and wires global providers:
  - `AuthProvider` (`src/context/AuthContext.tsx`) – Firebase authentication, auth modals, and a `requireAuth` helper
  - `CartProvider` (`src/context/CartContext.tsx`) – client-side cart state, persisted to `localStorage`
  - Global `<LoginModal />` and `<SignupModal />` are rendered once at the root so they can be opened from anywhere via context.
- `src/App.tsx` sets up the main React Router tree:
  - `/` → `Index` landing/catalog page
  - `/cart` → `Cart` page
  - `/checkout` → `Checkout` page
  - `*` → `NotFound` catch-all
- React Query is initialised here via `QueryClientProvider`, ready for API-backed features.

### State management and cross-cutting concerns

- **Auth context** (`src/context/AuthContext.tsx`):
  - Wraps Firebase Auth (`src/lib/firebase.ts`) to expose `login`, `signup`, `logout`, `loginWithGoogle`, `loginWithApple`.
  - Keeps track of auth modal visibility and mode (`login` vs `signup`).
  - Provides `requireAuth(action)` which queues an arbitrary callback, opens the login modal if the user is anonymous, then re-runs the callback once the user is authenticated.
  - `useRequireAuth` hook (`src/hooks/use-require-auth.ts`) wraps this into an easy click handler.
- **Cart context** (`src/context/CartContext.tsx`):
  - Normalized cart item shape (`CartItemInput`/`CartItem`).
  - Stores cart in `localStorage` under `cursed_relics_cart` and syncs across tabs using `storage` events.
  - Derived values: `itemCount` and `subtotal` are memoized.

These contexts are the main extension points for anything related to user identity or cart behavior.

### UI and page structure

- The UI is composed from shadcn-style primitives under `src/components/ui/` (buttons, inputs, dialogs, layout primitives, etc.), themed by Tailwind (`tailwind.config.ts`).
- Domain-specific components live in `src/components/` (e.g. `Navigation`, `Hero`, `CategorySection`, `ProductCard`, `AddToCartButton`).
- Screens:
  - `src/pages/Index.tsx`: landing/catalog page defining in-memory product collections (cursed dolls, charms, stones, artifacts) and rendering them via `CategorySection`.
  - `src/pages/Cart.tsx`: reads from `CartContext`, allows quantity updates and cart clearing, and shows an order summary.
  - `src/pages/Checkout.tsx`: orchestrates the Razorpay payment flow, collects contact/delivery info, and displays a price breakdown.

When modifying layout or navigation, start with `Navigation`, the page components under `src/pages/`, and the top-level router in `App.tsx`.

### Payments and external integrations

- **Razorpay checkout**:
  - `src/lib/razorpay.ts` lazily loads the Razorpay script and exposes types for the checkout options.
  - `src/pages/Checkout.tsx` calls `loadRazorpayScript()`, then POSTs to `${VITE_API_BASE_URL}/payments/razorpay/order` to obtain a Razorpay order and key ID, then opens `new window.Razorpay({...}).open()`.
  - Uses `VITE_RAZORPAY_KEY_ID` as a fallback if the backend does not return a key.
- **Email**:
  - `src/lib/email.ts` implements `sendWelcomeEmail`, which POSTs to `VITE_MAIL_WEBHOOK_URL` with a templated payload.
  - `AuthContext` calls `sendWelcomeEmail` after successful signup; missing configuration is tolerated (logs a warning in non-production).
- **Firebase**:
  - `src/lib/firebase.ts` initialises the Firebase app and exports `auth`. All front-end auth flows go through this layer.

Environment variables the frontend expects (via `import.meta.env` or `window.__APP_ENV__`):
- `VITE_API_BASE_URL` – base URL for the backend API (defaults to `http://localhost:5000/api/v1`).
- `VITE_RAZORPAY_KEY_ID` – public Razorpay key used by the checkout modal.
- `VITE_MAIL_WEBHOOK_URL` and `VITE_MAIL_FROM` – used by `sendWelcomeEmail`.

## Backend architecture

### Server bootstrap and configuration

- Entry point is `backend/src/server.js`:
  - Loads environment variables with `dotenv`.
  - Connects to MongoDB via `connectDB` (`backend/src/config/db.js`).
  - Starts an HTTP server on `ENV.PORT` (default `5000`).
  - Hooks `unhandledRejection` and `uncaughtException` to log and, in the latter case, exit.
- `backend/src/config/env.js` centralizes configuration and environment defaults:
  - Port, `MONGO_URI`, JWT secrets and expiries, `CORS_ORIGIN`, Stripe and Razorpay keys, SMTP details.
  - For production, override these via environment variables instead of using the in-code defaults.
- `backend/src/config/db.js` sets up the shared Mongoose connection and logs successful connection details.

### Express app and middleware pipeline

Defined in `backend/src/app.js`:
- Security: `helmet`, `express-mongo-sanitize`, `xss-clean`.
- CORS: `cors` with `origin: ENV.CORS_ORIGIN` and `credentials: true`.
- Logging: `morgan("dev")` in non-test environments.
- Parsing: JSON (1MB limit), URL-encoded bodies, and cookies.
- Rate limiting: `express-rate-limit` applied on `/api` (global limit window and max requests).
- Routing: mounts `backend/src/routes/index.js` under `/api/v1`.
- Health check endpoint: `GET /health` returning a small JSON payload.
- Error handling: `notFound` and `errorHandler` from `backend/src/middlewares/errorMiddleware.js`, which normalize errors through `failure()` in `backend/src/utils/apiResponse.js`.

When adding new API features, register their routers in `backend/src/routes/index.js` so they appear under `/api/v1/...`.

### Routing, controllers, services, and models

The backend follows a conventional layered structure:
- **Routes** (`backend/src/routes/*.js`): wire HTTP paths and methods to controllers, and attach middleware such as auth and validation.
- **Controllers** (`backend/src/controllers/*.js`): perform request-level orchestration, pull validated input from `req.validated`, call service functions, and serialize responses via `success()`.
- **Services** (`backend/src/services/*.js`): business logic and data access using Mongoose models.
- **Models** (`backend/src/models/*.js`): Mongoose schemas and indexes for domain entities like `User`, `Product`, `Cart`, `Order`, and `Payment`.

Example: products flow
- Model: `backend/src/models/Product.js` defines the product schema including category, price, stock, images, descriptions, and `hauntedLevel`, plus text and secondary indexes for search.
- Service: `backend/src/services/productService.js` implements CRUD and filtered listing (`listProductsWithFilters`) with pagination and sorting on `createdAt`, `totalSold`, and `hauntedLevel`.
- Controller: `backend/src/controllers/productController.js` adapts validated HTTP input into service calls and standardizes JSON responses.
- Routes: `backend/src/routes/productRoutes.js` (not shown above but follows the same pattern) connects URL paths to controller functions and applies validation or auth as needed.

This pattern (route → controller → service → model) is consistent across resources (auth, cart, orders, payments, admin) and is the preferred place to hook in new domain logic.

### Validation

- Request validation uses Zod via `backend/src/middlewares/validateRequest.js`.
- Each feature defines its own schema module under `backend/src/validations/` and passes schemas into the `validate(schema)` middleware.
- Example: `backend/src/validations/productValidation.js` defines:
  - `createProductSchema` / `updateProductSchema` for body and params.
  - `getProductsQuerySchema` for filtering and pagination query parameters.

On validation failure, the middleware responds with a `422` and a structured `errors` array via `failure()`.

### Authentication and authorization

- JWT-based auth is implemented via:
  - `backend/src/utils/token.js` – signing and verifying access/refresh tokens using secrets and expiries from `ENV`.
  - `backend/src/middlewares/authMiddleware.js` – `authenticate` extracts a token from the `Authorization: Bearer` header or `accessToken` cookie, verifies it, and attaches the user document as `req.user`; `authorizeAdmin` enforces admin-only access using `ROLES.ADMIN` from `backend/src/utils/constants.js`.
- Auth and user management endpoints are defined under the `authRoutes` and `userRoutes` routers.

Note: frontend user identity (Firebase) and backend JWT identity are separate systems; any integration between them would need explicit bridging logic.

### Payments (Stripe and Razorpay)

- Core services live in `backend/src/services/paymentService.js`:
  - Stripe: `createOrderPaymentIntent(userId, orderId)` validates ownership and status of an `Order`, creates a Stripe `PaymentIntent`, stores a `Payment` record, and persists the `paymentIntentId` on the order.
  - Razorpay: `createRazorpayOrder({ amount, currency, receipt, notes })` uses the configured Razorpay client (from `ENV.RAZORPAY_KEY_ID` and `ENV.RAZORPAY_KEY_SECRET`) to create an order and returns it.
- Controllers in `backend/src/controllers/paymentController.js`:
  - `createPaymentIntent` → Stripe flow, returns `clientSecret`.
  - `createRazorpayOrder` → Razorpay order flow, returns `{ order, keyId }` so the frontend can open the Razorpay checkout.
- Routes in `backend/src/routes/paymentRoutes.js`:
  - `POST /api/v1/payments/intent` – **protected** by `authenticate` and validated by `createPaymentIntentSchema`.
  - `POST /api/v1/payments/razorpay/order` – validated by `createRazorpayOrderSchema` but intentionally left unauthenticated for the current checkout design.

When adjusting payment behavior, update the service layer first, then the controllers, and finally ensure the frontend payloads in `Checkout.tsx` still match the validated shapes.

### Logging and error handling

- All logging goes through `backend/src/utils/logger.js`, which writes JSON objects to stdout/stderr with a `level` field (`info`, `warn`, `error`).
- API-level errors are normalized via `backend/src/middlewares/errorMiddleware.js` and `backend/src/utils/apiResponse.js` so the frontend can rely on a `{ success, message, data | errors }` envelope.

## Testing strategy summary

- **Frontend**:
  - Jest is configured to treat `src/` as the root and to support the `@/` alias.
  - React Testing Library and `@testing-library/jest-dom` are set up for DOM-focused tests (see the existing test under `src/__tests__/`).
- **Backend**:
  - Jest + Supertest are installed; tests can exercise Express routes and middleware against the in-memory app from `backend/src/app.js`.

When adding new functionality, mirror the existing patterns: place frontend tests under `src/__tests__/` and backend tests under `backend/src` or a tests directory colocated with the feature using Jest's default conventions.
