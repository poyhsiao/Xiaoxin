# Phase 1: 基礎架構建構 - 執行計劃

**建立日期:** 2025-01-20  
**Phase:** 1/9  
**預估時間:** 2-3 週  
**狀態:** 規劃中  

---

## 1. 任務目標

建立小新書籤管理平台的基礎架構，包括：
- 專案 workspace 結構
- NestJS 後端框架
- PostgreSQL 資料庫 Schema
- Logto 認證系統集成
- Vercel 部署配置

---

## 2. Task List

### 2.1 專案 Workspace 建立

- [ ] **1.1.1** 初始化 pnpm workspace
  - **目標**: 建立根目錄 workspace 配置
  - **開發步驟**:
    1. 創建 `package.json` (workspace root)
    2. 創建 `pnpm-workspace.yaml`
    3. 配置 `.npmrc`
  - **驗證方式**: `pnpm install` 成功
  - **期望輸出**: workspace 可正常運行

- [ ] **1.1.2** 建立 apps/ 目錄結構
  - **目標**: 建立 apps/web, apps/backend, apps/mobile, apps/extension 目錄
  - **開發步驟**:
    1. 建立 apps/ 目錄
    2. 建立 apps/web/, apps/backend/, apps/mobile/, apps/extension/
    3. 建立 packages/ shared/, packages/api-client/ 目錄
  - **驗證方式**: 目錄結構正確
  - **期望輸出**: 符合 `docs/planning/2025-01-20_project-plan.md` 中的目錄結構

- [ ] **1.1.3** 建立 infra/ 和 docs/ 目錄
  - **目標**: 建立基礎設施和文檔目錄
  - **開發步驟**:
    1. 建立 infra/docker/, infra/vercel/, infra/logto/
    2. 建立 docs/architecture/, docs/planning/, docs/tasks/, docs/api/, docs/guides/
  - **驗證方式**: 目錄結構正確
  - **期望輸出**: 符合規劃文檔

---

### 2.2 NestJS 後端框架搭建

- [ ] **1.2.1** 初始化 NestJS 項目
  - **目標**: 在 apps/backend/ 建立 NestJS 項目
  - **開發步驟**:
    1. `pnpm create nestjs-app apps/backend`
    2. 配置 TypeScript (strict mode)
    3. 配置 ESLint 和 Prettier
  - **驗證方式**: `pnpm build` 成功
  - **期望輸出**: NestJS 項目可正常編譯

- [ ] **1.2.2** 配置 TypeORM + PostgreSQL
  - **目標**: 建立資料庫連接配置
  - **開發步驟**:
    1. 安裝依賴：`pnpm add @nestjs/typeorm typeorm pg`
    2. 建立 database module
    3. 配置 `ormconfig.yaml`
  - **驗證方式**: 可連接到 PostgreSQL
  - **期望輸出**: 資料庫連接成功

- [ ] **1.2.3** 建立後端模組結構
  - **目標**: 建立 modules/ 目錄結構
  - **開發步驟**:
    1. 建立 `src/modules/` 目錄
    2. 建立 `src/common/` (decorators, filters, guards, interceptors, pipes, utils)
    3. 建立 `src/config/` (config.module.ts, database.config.ts, app.config.ts)
    4. 建立 `src/database/` (database.module.ts, migrations/)
  - **驗證方式**: 模組結構正確
  - **期望輸出**: 符合規劃文檔中的目錄結構

- [ ] **1.2.4** 配置環境變數
  - **目標**: 建立環境變數管理
  - **開發步驟**:
    1. 建立 `.env.example`
    2. 建立 `config/default.yaml`
    3. 配置 `@nestjs/config`
  - **驗證方式**: 環境變數可正常讀取
  - **期望輸出**: 無 hard-coded 配置值

---

### 2.3 PostgreSQL Schema 設計

- [ ] **1.3.1** 建立 Users 表
  - **目標**: 建立用戶資料表
  - **開發步驟**:
    1. 建立 `src/modules/user/entities/user.entity.ts`
    2. 建立遷移檔案 `M001_create_users_table.ts`
    3. 執行遷移
  - **驗證方式**: `SELECT * FROM users LIMIT 1` 成功
  - **期望輸出**: Users 表創建成功

- [ ] **1.3.2** 建立 Organizations 表
  - **目標**: 建立組織資料表
  - **開發步驟**:
    1. 建立 `organization.entity.ts`
    2. 建立 `user_org_role.entity.ts`
    3. 建立遷移檔案
    4. 執行遷移
  - **驗證方式**: Organizations 表創建成功
  - **期望輸出**: 表結構正確

- [ ] **1.3.3** 建立基本索引
  - **目標**: 建立效能優化索引
  - **開發步驟**:
    1. 建立 `idx_users_email`
    2. 建立 `idx_orgs_slug`
    3. 建立 `idx_uor_user_org`
  - **驗證方式**: 索引創建成功
  - **期望輸出**: `\d users` 可看到索引

- [ ] **1.3.4** 撰寫 CRUD 測試
  - **目標**: 確保基本 CRUD 功能正常
  - **開發步驟**:
    1. 撰寫 User module 的單元測試
    2. 撰寫 Organization module 的單元測試
    3. 確保測試覆蓋率達 80%
  - **驗證方式**: `pnpm test` 全部通過
  - **期望輸出**: 測試覆蓋率報告

---

### 2.4 Logto 認證系統集成

- [ ] **1.4.1** 建立 Logto Cloud 帳號
  - **目標**: 取得 Logto 認證服務
  - **開發步驟**:
    1. 註冊 Logto Cloud
    2. 建立 Application (Traditional Web)
    3. 取得 App ID 和 App Secret
  - **驗證方式**: 取得 credentials
  - **期望輸出**: App ID, App Secret, Endpoint

- [ ] **1.4.2** 集成 Logto SDK
  - **目標**: 在後端集成 Logto
  - **開發步驟**:
    1. 安裝：`pnpm add @logto/node`
    2. 建立 `auth.module.ts`
    3. 配置 Logto client
  - **驗證方式**: 可建立 Logto client
  - **期望輸出**: SDK 正常運行

- [ ] **1.4.3** 實現登入/註冊流程
  - **目標**: 提供用戶認證 API
  - **開發步驟**:
    1. 建立 `auth.controller.ts`
    2. 建立 `auth.service.ts`
    3. 實現 `/auth/register`, `/auth/login`, `/auth/logout`
    4. 實現 `/auth/me`
  - **驗證方式**: API 可正常運作
  - **期望輸出**: 可註冊、登入、取得當前用戶

- [ ] **1.4.4** 實現 OAuth2/OIDC 登入
  - **目標**: 支援第三方登入
  - **開發步驟**:
    1. 配置 Google connector
    2. 配置 GitHub connector
    3. 實現社交登入 API
  - **驗證方式**: 可使用 Google/GitHub 登入
  - **期望輸出**: OAuth 登入正常

---

### 2.5 Vercel 部署配置

- [ ] **1.5.1** 配置 vercel.json
  - **目標**: 建立 Vercel 部署配置
  - **開發步驟**:
    1. 建立 `vercel.json`
    2. 配置 build command 和 output directory
    3. 配置 environment variables
  - **驗證方式**: Vercel CLI 可正常部署
  - **期望輸出**: `vercel --prod` 成功

- [ ] **1.5.2** 配置 CI/CD 流程
  - **目標**: 建立自動化部署
  - **開發步驟**:
    1. 建立 `.github/workflows/deploy.yml`
    2. 配置 GitHub Actions
    3. 設定觸發條件 (push to main)
  - **驗證方式**: push 到 main 分支自動部署
  - **期望輸出**: CI/CD 正常運行

- [ ] **1.5.3** 撰寫部署文檔
  - **目標**: 提供部署指南
  - **開發步驟**:
    1. 建立 `docs/guides/deployment.md`
    2. 說明 Vercel 部署步驟
    3. 說明環境變數配置
  - **驗證方式**: 文檔完整
  - **期望輸出**: 工程師可按文檔部署

---

## 3. 環境變數配置

```bash
# .env.example
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/xiaoxin

# Redis
REDIS_URL=redis://localhost:6379

# Logto
LOGTO_ENDPOINT=http://localhost:3001
LOGTO_APP_ID=your_app_id
LOGTO_APP_SECRET=your_app_secret

# Vercel
VERCEL_TOKEN=your_vercel_token
```

---

## 4. 依賴清單

### Backend Dependencies

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "@nestjs/config": "^3.0.0",
  "@nestjs/passport": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "typeorm": "^0.3.0",
  "pg": "^8.11.0",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.0",
  "passport-local": "^1.0.0",
  "@logto/node": "^2.0.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0",
  "js-yaml": "^4.1.0"
}
```

### Dev Dependencies

```json
{
  "@nestjs/cli": "^10.0.0",
  "@nestjs/testing": "^10.0.0",
  "@types/node": "^20.0.0",
  "@types/passport-jwt": "^4.0.0",
  "@types/passport-local": "^1.0.0",
  "jest": "^29.0.0",
  "ts-jest": "^29.0.0",
  "eslint": "^8.0.0",
  "prettier": "^3.0.0",
  "supertest": "^6.3.0",
  "@types/supertest": "^6.0.0"
}
```

---

## 5. 驗收標準

### 功能驗收

| Task | 驗收標準 |
|------|----------|
| 1.1 | pnpm workspace 可正常運行 |
| 1.2 | NestJS 項目可正常編譯 |
| 1.3 | PostgreSQL 表創建成功，索引建立 |
| 1.4 | 用戶可註冊/登入（Email + OAuth） |
| 1.5 | Vercel 部署成功 |

### 測試覆蓋率

| 模組 | 最低覆蓋率 |
|------|------------|
| User Module | 80% |
| Organization Module | 80% |
| Auth Module | 80% |

---

## 6. 完成確認

- [ ] 所有 task 完成
- [ ] `pnpm build` 成功
- [ ] `pnpm test` 全部通過
- [ ] 測試覆蓋率達 80%
- [ ] Code review 通過
- [ ] Vercel 部署成功
- [ ] 文檔更新完成

---

## 7. 風險與緩解

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| Logto 集成複雜度 | 中 | 先用基本的 email/password 登入，之後再集成 OAuth |
| Vercel 部署問題 | 低 | 先用 Docker Compose 本地部署驗證 |

---

## 8. 文檔更新記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-01-20 | v1.0 | 初始版本 |
