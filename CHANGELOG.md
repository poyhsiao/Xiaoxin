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
- **backend**: NestJS API with Prisma ORM, JWT auth, Redis
- **web**: Next.js 14 app with Tailwind CSS, React Query, Zustand
- **extension**: Browser extension scaffold
- **mobile**: Mobile app scaffold
- GitHub Actions CI pipeline (`ci.yml`)
- GitHub Actions release pipeline (`release.yml`)
- Codebase-memory artifact for AI-assisted development
