# Personal Finance Tracker

A full-stack personal finance application built with Next.js, Prisma, and PostgreSQL. Track your income, expenses, and budgets with visual charts and analytics.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted via [Neon](https://neon.tech) / [Supabase](https://supabase.com))

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your PostgreSQL connection string and auth secret:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/personal_finance"
   AUTH_SECRET="run: openssl rand -base64 32"
   ```

3. **Push schema to database & seed**:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

   Login with `dev@example.com` (no password required in dev mode).

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # Dashboard layout with sidebar
│   │   ├── dashboard/         # Overview with charts
│   │   ├── transactions/      # Add/manage transactions
│   │   ├── budgets/           # Set/track budgets
│   │   └── settings/          # Account settings (placeholder)
│   └── api/                   # API routes
│       ├── auth/              # NextAuth endpoints
│       ├── transactions/      # CRUD for transactions
│       ├── budgets/           # CRUD for budgets
│       └── categories/        # Read categories
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── layout/                # Sidebar navigation
│   ├── dashboard/             # Dashboard charts & cards
│   ├── transactions/          # Transaction form & list
│   └── budgets/               # Budget form & list
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── db.ts                  # Prisma client singleton
│   └── utils.ts               # Utility functions
└── types/                     # TypeScript type augmentations
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database with default categories |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## Features

- **Dashboard**: Summary cards, income vs expense bar chart, spending by category pie chart, recent transactions
- **Transactions**: Add income/expenses with categories, date, and descriptions. View and delete transactions.
- **Budgets**: Set monthly budgets per category with progress bars showing spending vs budget
- **Categories**: Pre-seeded income and expense categories with colors and icons
- **Auth**: Credential-based authentication with NextAuth.js
