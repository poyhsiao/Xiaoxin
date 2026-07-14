# 書籤管理平台 - 初始專案規劃

**建立日期:** 2025-01-20  
**專案名稱:** Xiaoxin (類似 Toby 的書籤管理平台)  
**需求來源:** `.prompt.md`

---

## 專案概述

一個 SaaS 書籤管理平台，支援多組織、多空間、多集合的書籤管理，提供瀏覽器擴充套件、iOS/Android App 和 Web 界面。

---

## 主要功能需求摘要

| 層級 | 功能 |
|------|------|
| 組織 (Organization) | 建立多個 organization，可訂閱/分享，設定公開/被邀請/私人 |
| 空間 (Space) | 每個 org 可有多個 spaces |
| 集合 (Collection) | 每個 space 可加入多個 collections，包含書籤 |
| 書籤 (Bookmark) | 收集、整理書籤 |
| 權限 | Org 層級的公開/私人/邀請設定，共用管理權限 |
| 用戶端 | Chrome/Safari/Firefox 擴充套件，iOS/Android App，Web |
| 部署 | Docker SaaS 架構，RESTful API (OpenAPI) |

---

## 建議的技術棧

### 後端
- **框架:** Node.js + Fastify (高效能 REST API)
- **資料庫:** PostgreSQL (主要) + Redis (快取/工作階段)
- **ORM:** Prisma
- **認證:** JWT + OAuth2 (Google, GitHub 等)
- **API:** OpenAPI 3.0 (Swagger)
- **部署:** Docker + Docker Compose

### 前端 Web
- **框架:** React 18 + TypeScript
- **UI 庫:** TailwindCSS + shadcn/ui
- **狀態管理:** Zustand / TanStack Query
- **路由:** React Router v6

### 瀏覽器擴充套件
- **格式:** WebExtension (相容 Chrome/Safari/Firefox)
- **框架:** WXT (現代 WebExtension 框架)

### 行動端
- **框架:** React Native (iOS/Android)
- **或:** Capacitor + React

### 基礎設施
- **容器化:** Docker
- **CI/CD:** GitHub Actions
- **雲端:** 建議 (Vercel frontend, Railway/Render backend)

---

## Phase 1: 基礎建設 (MVP 優先)

### Task 1.1: 專案結構與代碼倉庫設置
- [ ] 初始化 Monorepo 結構 (pnpm workspaces)
- [ ] 設定 Git 配置與 branch 策略
- [ ] 建立基礎資料夾結構
- [ ] 設定 ESLint, Prettier, TypeScript 配置

**驗證方式:** `pnpm install && pnpm lint` 無錯誤

### Task 1.2: 後端 API 基礎建設
- [ ] Fastify 專案初始化
- [ ] Prisma + PostgreSQL 設定
- [ ] OpenAPI/Swagger 文件設定
- [ ] 基礎認證系統 (JWT)
- [ ] 環境變數配置 (.env.example)

**驗證方式:** `pnpm dev` 成功啟動，API 文件可訪問

### Task 1.3: 資料模型設計
- [ ] User 模型
- [ ] Organization 模型 (含 visibility 設定)
- [ ] Space 模型
- [ ] Collection 模型
- [ ] Bookmark 模型
- [ ] 關聯關係與許可權設計

**驗證方式:** `pnpm db:migrate` 成功執行

### Task 1.4: API 端點實現 (MVP)
- [ ] 使用者註冊/登入 API
- [ ] Organization CRUD
- [ ] Space CRUD
- [ ] Collection CRUD
- [ ] Bookmark CRUD

**驗證方式:** API 測試通過 (使用 Swagger 或 Postman)

---

## Phase 2: 前端 Web MVP

### Task 2.1: React 專案初始化
- [ ] Vite + React + TypeScript 設定
- [ ] TailwindCSS + shadcn/ui 設定
- [ ] React Router 設定
- [ ] TanStack Query 設定
- [ ] 登入/註冊頁面

**驗證方式:** 開發伺服器運行，`pnpm dev` 成功

### Task 2.2: 主要介面實現
- [ ] Dashboard 介面
- [ ] Organization 管理介面
- [ ] Space/Collection/Bookmark 管理介面
- [ ] 書籤列表與搜尋

**驗證方式:** 手動測試各頁面功能正常

### Task 2.3: 與 API 整合
- [ ] API 服務層封裝
- [ ] 認證流程整合
- [ ] CRUD 功能完整串接

**驗證方式:** 所有 CRUD 操作正常運作

---

## Phase 3: 瀏覽器擴充套件

### Task 3.1: 瀏覽器擴充套件基礎
- [ ] WXT 專案初始化
- [ ] 跨瀏覽器設定 (Chrome/Safari/Firefox)
- [ ] 擴充套件 popup 介面
- [ ] 背景腳本設定

**驗證方式:** `pnpm build` 成功，擴充套件可載入

### Task 3.2: 書籤功能實現
- [ ] 書籤儲存功能
- [ ] 書籤列表檢視
- [ ] 快速搜尋
- [ ] 與後端 API 同步

**驗證方式:** 書籤可正常儲存並出現在 Web 介面

---

## Phase 4: 行動端 (可選 Phase 3 後執行)

### Task 4.1: React Native 專案初始化
- [ ] Expo 專案設定
- [ ] iOS/Android 環境設定
- [ ] 基礎介面框架

### Task 4.2: 行動端核心功能
- [ ] 登入/註冊
- [ ] 書籤列表
- [ ] 書籤新增/編輯
- [ ] 離線支援 (可選)

---

## Phase 5: 進階功能

### Task 5.1: 進階權限系統
- [ ] Organization 邀請系統
- [ ] 成員角色管理 (Owner/Admin/Member)
- [ ] 訂閱/分享功能

### Task 5.2: 搜尋與標籤
- [ ] 全文搜尋 (Elasticsearch/Meilisearch)
- [ ] 書籤標籤系統
- [ ] 智慧分類建議

### Task 5.3: 同步與離線
- [ ] WebDAV 同步
- [ ] 瀏覽器擴充套件離線支援
- [ ] 衝突解決策略

### Task 5.4: 部署與 DevOps
- [ ] Docker 配置
- [ ] CI/CD Pipeline
- [ ] 監控與日誌

---

## 優先順序建議

```
Phase 1 (MVP)    ──────────────────────────────────────────────────────►
                  Task 1.1 → 1.2 → 1.3 → 1.4

Phase 2 (Web)     ──────────────────────────────────────────────────────►
                            Task 2.1 → 2.2 → 2.3

Phase 3 (Extension) ──────────────────────────────────────────────────►
                                      Task 3.1 → 3.2

Phase 4 (Mobile)   ────────────────────────────────────────────────►
                                                      Task 4.1 → 4.2

Phase 5 (Advanced)  ─────────────────────────────────────────►
                                                          Task 5.1 → 5.2 → 5.3 → 5.4
```

---

## 設計文檔

詳細的技術架構和專案計劃已更新，請參考：

- [系統架構設計文檔](../../architecture/2025-01-20_system-architecture.md)
- [專案建構計劃](../../planning/2025-01-20_project-plan.md)

## 下一步行動

1. **確認技術棧選擇** - 上述建議是否符合你的偏好？
2. **決定部署目標** - 打算部署到哪個雲端平台？
3. **授權模式** - 預計採用免費/付費訂閱模式？
4. **確認設計文檔** - 查看上述架構和計劃文檔

---

## 文件更新記錄

| 日期 | 內容 |
|------|------|
| 2025-01-20 | 初始版本創建 |
