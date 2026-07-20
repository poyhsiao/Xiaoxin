# 小新 (Xiaoxin)

書籤管理平台，類似 Toby，支援多組織架構、多平台用戶端，提供完整的分享協作功能和即時同步能力。

## Apps

| App | Stack | Coverage | Description |
|-----|-------|---------|-------------|
| **backend** | NestJS + Prisma + PostgreSQL + WebSocket | 98% | REST API server with JWT auth, Redis, real-time notifications |
| **web** | Next.js + Tailwind + React Query | 82% | User-facing web client |
| **extension** | WXT + TypeScript | 100% | Cross-browser extension (Chrome/Firefox/Safari/Edge) |
| **mobile** | Flutter + Drift + Riverpod | — | iOS/Android mobile app |

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
  backend/        # NestJS API (port 3001) + WebSocket gateway
  web/           # Next.js frontend
  extension/     # Browser extension (WXT)
  mobile/        # Flutter mobile app
```

## Features

- 🔐 **Authentication**: JWT-based auth with timing-attack protection
- 📁 **Bookmarks**: Full CRUD with collection organization
- 🔔 **Real-time**: WebSocket notifications for updates
- 🌐 **i18n**: Multi-language support
- ⌨️ **Shortcuts**: Keyboard shortcut management
- 🔄 **Sync**: Cloud synchronization with conflict resolution
- 🏢 **Multi-tenant**: Organization-based access control

## License

Private.
