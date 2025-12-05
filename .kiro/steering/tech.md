# Tech Stack

## Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (SWC for fast compilation)
- **Routing**: React Router v6
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with tailwindcss-animate
- **State Management**: 
  - React Context (Auth, Cart)
  - TanStack Query for server state
- **Forms**: React Hook Form + Zod validation
- **Auth**: Firebase Authentication
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT (access + refresh tokens) + bcryptjs
- **Payment**: Razorpay SDK, Stripe SDK
- **Email**: Nodemailer
- **Security**: helmet, cors, express-rate-limit, xss-clean, express-mongo-sanitize
- **Validation**: Zod schemas
- **Logging**: Custom logger utility

## Development Tools

- **Testing**: Jest with Testing Library
- **Linting**: ESLint with TypeScript support
- **Package Manager**: npm (frontend and backend)

## Common Commands

### Frontend
```bash
npm run dev          # Start Vite dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run Jest tests
```

### Backend
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Production start
npm test             # Run Jest tests
```

## Path Aliases

- Frontend: `@/` maps to `src/`
- Use absolute imports for cleaner code: `import { Button } from "@/components/ui/button"`

## Environment Variables

- Frontend: `.env` at root (Vite uses `VITE_` prefix)
- Backend: `.env` in `backend/` directory
- Always use `.env.example` as template
