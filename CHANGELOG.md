# Changelog

All notable changes to this project will be documented in this file.

## [v0.2.0] — 2026-07-15

### Added

- **backend**: WebSocket notification system with real-time updates
  - `NotificationsGateway` for WebSocket connections
  - `NotificationsController` for REST endpoints
  - `NotificationsService` for managing notifications
  - Support for bookmark share and collection notifications
- **extension**: New library modules with comprehensive test coverage
  - `bookmarklet.ts` — bookmarklet generation utility
  - `db.ts` — IndexedDB wrapper for local storage
  - `i18n.ts` — internationalization support
  - `shortcuts.ts` — keyboard shortcut management
  - `sync.ts` — cloud synchronization engine
  - 100% test coverage on all new modules
- **extension**: `UPDATE_BOOKMARK` message type for editing bookmarks
- **mobile**: Organization domain model and service
  - `Organization` model with multi-tenant support
  - `OrganizationService` for organization management
- **web**: Settings components (Profile, Appearance, Language, Notification, Security, Account)
- **web**: Test setup utilities for vitest

### Changed

- **mobile**: `BookmarkService` refactored — reduced from 130+ lines to cleaner implementation
- **mobile**: App initialization now uses `ProviderScope` for Riverpod
- **docs**: Updated all task documents with implementation progress

### Security

- **backend**: Enhanced notification access control
- **extension**: Secure sync with conflict resolution

## [v0.1.2] — 2026-01-19

### Security
- **backend**: Add CORS configuration for extension and web clients
- **backend**: Add timing attack protection in password validation
- **backend**: Add collection access control verification in bookmarks

### Fixed
- **backend**: Improve bookmark ownership verification
- **backend**: Add bookmark deletion authorization checks

### Changed
- **web**: Update vitest configuration for better test coverage
- **extension**: Improve popup and sidebar UI

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
