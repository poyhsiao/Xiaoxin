# Changelog

All notable changes to this project will be documented in this file.

## [v0.1.0] — 2026-07-14

### Fixed
- **backend**: Add `--passWithNoTests` to jest (no test files yet)
- **web**: Add ESLint config for next lint
- **backend**: Add ESLint config to resolve CI lint failure
- **backend**: Run prisma generate before nest build
- **common**: Add missing tags module, fix Prisma enums, regenerate client

### Added
- Monorepo setup with pnpm workspaces
- **backend**: NestJS API with Prisma ORM, JWT auth, Redis, 57 unit tests (98% coverage)
- **web**: Next.js 14 app with Tailwind CSS, React Query, Zustand, 56 unit tests (82% coverage)
- **extension**: WXT browser extension with 60 Playwright tests (100% coverage)
- **mobile**: Flutter app with Riverpod state management, 8 unit tests
- GitHub Actions CI pipeline (`ci.yml`)
- GitHub Actions release pipeline (`release.yml`)
- Codebase-memory artifact for AI-assisted development

### Testing
- All 181 tests passing across backend, web, extension, and mobile
- Test coverage: backend 98%, extension 100%, web 82%
