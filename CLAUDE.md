# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to database (no migration history)
npm run db:migrate   # Create and run Prisma migrations
npm run db:seed      # Seed default categories (uses tsx prisma/seed.ts)
npm run db:studio    # Prisma Studio GUI
npm run db:generate  # Regenerate Prisma client after schema changes
```

## Architecture

Next.js 16 App Router with PostgreSQL/Prisma. Two route groups under `src/app/`:

- `(auth)/` — login page (credential-based auth via NextAuth.js v5 beta)
- `(dashboard)/` — main app behind sidebar layout: dashboard, transactions, budgets, settings

**API routes** at `src/app/api/` handle CRUD (transactions, budgets, categories). All API routes use `getAuthUserId()` from `src/lib/get-user-id.ts` to read the authenticated user from the NextAuth session. Unauthenticated requests throw "Unauthorized" and return 401.

**Auth** is configured in `src/lib/auth.ts` using `@auth/prisma-adapter` with JWT strategy. Passwords are hashed with bcrypt (via `bcryptjs`). Auth middleware at `src/middleware.ts` protects all dashboard and API routes, redirecting unauthenticated users to `/login`.

**Database** — Prisma client singleton in `src/lib/db.ts` (exported as `db`). Schema in `prisma/schema.prisma` defines: User, Account, Session, VerificationToken (NextAuth models) + Category, Transaction, Budget (finance models). `TransactionType` enum: `INCOME | EXPENSE`.

## Branding & Currency

- **Brand name**: Blueprint Books — Personal Finance Tracker
- **Logo**: Custom SVG component at `src/components/ui/logo.tsx` (`BlueprintBookIcon`). Use this instead of any Lucide icon for branding.
- **Currency**: Indian Rupee (INR / ₹). All monetary formatting uses `en-IN` locale and `INR` currency via `formatCurrency()` in `src/lib/utils.ts`. Use `₹` in labels (e.g., "Amount (₹)"). Use the `IndianRupee` icon from Lucide where a currency icon is needed — never `DollarSign`.
- **Locale**: All `toLocaleString` / `Intl.NumberFormat` / `Intl.DateTimeFormat` calls use `en-IN`. Numbers follow Indian grouping (lakhs/crores).

## Key Conventions

- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss` plugin. Design tokens defined as CSS custom properties in `src/app/globals.css` (colors, typography, shadows, animations). Dark mode via `.dark` class on `<html>`.
- **UI components**: Custom components in `src/components/ui/` (not shadcn/ui — hand-rolled with `cn()` utility from `clsx` + `tailwind-merge`). Use variant/size props pattern (see Button).
- **Validation**: Zod schemas defined inline in API routes.
- **Charts**: Recharts for dashboard visualizations.
- **Icons**: Lucide React.
- **Fonts**: Outfit (display), DM Sans (body), JetBrains Mono (mono) — loaded via `next/font` in root layout.
- **Finance colors**: Use `--color-income` / `--color-expense` semantic tokens (green/red).
- **Env vars**: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` required. `DIRECT_URL` optional (for Prisma). Plaid vars are placeholder for future bank integration.
