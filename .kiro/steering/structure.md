# Project Structure

## Monorepo Layout

```
/                    # Frontend (React + Vite)
├── src/             # Frontend source
├── public/          # Static assets
└── backend/         # Backend API (Express)
    └── src/         # Backend source
```

## Frontend Structure (`src/`)

```
src/
├── components/      # React components
│   ├── ui/         # shadcn/ui components (auto-generated)
│   └── auth/       # Auth-related components (modals, protected routes)
├── pages/          # Route pages (Index, Cart, Checkout, ProductDetail, NotFound)
├── context/        # React Context providers (AuthContext, CartContext)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and integrations (firebase, razorpay, email, utils)
├── __tests__/      # Jest tests
├── App.tsx         # Main app with routing
└── main.tsx        # Entry point with providers
```

## Backend Structure (`backend/src/`)

```
backend/src/
├── config/         # Configuration (db, env)
├── controllers/    # Request handlers (thin layer)
├── services/       # Business logic (thick layer)
├── models/         # Mongoose schemas (User, Product, Order, Cart, Payment)
├── routes/         # Express route definitions
├── middlewares/    # Auth, validation, error handling
├── validations/    # Zod schemas for request validation
├── utils/          # Helpers (apiResponse, constants, logger, token)
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## Architecture Patterns

### Frontend
- **Component Organization**: UI components in `components/ui/`, feature components at top level
- **State Management**: Context for global state (auth, cart), TanStack Query for server data
- **Routing**: All routes defined in `App.tsx`, custom routes above catch-all `*`
- **Auth Flow**: Firebase handles authentication, backend JWT for API authorization

### Backend
- **Layered Architecture**: Routes → Controllers → Services → Models
- **Controllers**: Thin, handle request/response, call services
- **Services**: Thick, contain business logic, reusable across controllers
- **Error Handling**: Centralized error middleware, consistent API responses
- **Validation**: Zod schemas in `validations/`, applied via `validateRequest` middleware
- **Security**: Rate limiting, sanitization, helmet, CORS configured in `app.js`

## Key Conventions

- **API Responses**: Use `success()` and `failure()` from `utils/apiResponse.js`
- **Error Handling**: All async routes wrapped with try/catch, errors passed to `next()`
- **Authentication**: `authenticate` middleware for protected routes, `authorizeAdmin` for admin-only
- **Models**: Mongoose schemas with pre-save hooks, instance methods for common operations
- **Environment**: All config centralized in `backend/src/config/env.js`
- **Logging**: Use logger utility, not console.log

## File Naming

- Frontend: PascalCase for components (`ProductCard.tsx`), camelCase for utilities
- Backend: camelCase for all files (`authController.js`, `userService.js`)
- Models: PascalCase (`User.js`, `Product.js`)
