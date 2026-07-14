# Xiaoxin

A monorepo powering the 小信 (Xiaoxin) messaging and automation platform.

## Apps

| App | Stack | Description |
|-----|-------|-------------|
| **backend** | NestJS + Prisma | REST/GraphQL API server |
| **web** | Next.js + Tailwind | User-facing web client |
| **extension** | — | Browser/extension module |
| **mobile** | — | Mobile app module |

## Stack

- **Runtime**: Node.js ≥ 20
- **Package Manager**: pnpm ≥ 8
- **Monorepo**: pnpm workspaces

## Getting Started

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm dev

# Start only web
pnpm dev:web

# Build all apps
pnpm build

# Lint all apps
pnpm lint

# Test all apps
pnpm test

# Database
pnpm db:migrate   # Run Prisma migrations
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to DB (dev)
```

## Architecture

```
apps/
  backend/        # NestJS API (port 3001)
  web/           # Next.js frontend
  extension/     # Browser extension
  mobile/        # Mobile app
```

## License

Private.
