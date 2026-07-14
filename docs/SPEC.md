# 小新 (Xiaoxin) - 專案規格文檔

**版本:** v1.0  
**建立日期:** 2025-01-20  
**更新日期:** 2025-01-20  

---

## 1. 專案概述

### 1.1 專案背景

小新是一個現代化的書籤管理平台，類似 [Toby](https://www.gettoby.com/)，支援多組織架構、多平台用戶端，提供完整的分享協作功能和即時同步能力。

**專案目標：**
- 為個人和團隊提供直覺的書籤管理體驗
- 支援多設備、多平台的無縫書籤同步
- 提供靈活的分享和協作功能
- 確保用戶資料的隱私和安全

### 1.2 技術棧

| 層面 | 技術 | 備註 |
|------|------|------|
| **Web 前端** | Next.js (React) | SSR 支援、良好 SEO |
| **移動端** | Flutter + Drift | 離線優先、跨平台 |
| **瀏覽器擴充** | WXT | 跨 Chrome/Firefox/Safari/Edge |
| **後端框架** | NestJS (TypeScript) | 模組化、IoC |
| **資料庫** | PostgreSQL | 可靠、full-text search、RLS |
| **認證** | Logto | 開源、multi-tenancy、OAuth2/OIDC |
| **即時通訊** | WebSocket | 雙向通訊、低延遲 |
| **快取/佇列** | Redis | 快取、Pub/Sub、佇列 |
| **API 文件** | Scalar | 現代化 API 文件 |
| **部署 (雲端)** | Vercel | Serverless、CDN |
| **部署 (自host)** | Docker Compose | 隔離、簡易部署 |

### 1.3 專案目錄結構

```
xiaoxin/
├── apps/
│   ├── web/                    # Next.js Web 前端
│   │   ├── src/
│   │   │   ├── app/           # App Router
│   │   │   ├── components/    # React 組件
│   │   │   ├── hooks/         # 自定義 Hooks
│   │   │   ├── lib/           # 工具函數
│   │   │   ├── stores/        # 狀態管理 (Zustand)
│   │   │   ├── services/      # API 服務
│   │   │   └── styles/        # 全域樣式
│   │   └── i18n/              # 國際化 (zh-TW, zh-CN, en)
│   │
│   ├── mobile/                # Flutter 移動端
│   │   ├── lib/
│   │   │   ├── core/          # 核心功能
│   │   │   ├── data/          # Drift 資料庫
│   │   │   ├── domain/        # 業務邏輯
│   │   │   └── presentation/  # UI 層
│   │   └── pubspec.yaml
│   │
│   ├── extension/             # WXT 瀏覽器擴充
│   │   ├── entrypoints/       # Popup, Sidebar, Background
│   │   └── components/
│   │
│   └── backend/               # NestJS 後端
│       └── src/
│           ├── modules/       # 功能模組
│           ├── common/       # 公共模組
│           ├── config/       # 配置
│           └── database/      # 資料庫
│
├── packages/
│   ├── shared/                # 共享類型定義
│   └── api-client/            # API 客戶端庫
│
├── infra/
│   ├── docker/                # Docker Compose 配置
│   ├── vercel/                # Vercel 部署配置
│   └── logto/                 # Logto 配置
│
├── docs/
│   └── tasks/                 # Phase Task Lists
│
├── .env.example
├── pnpm-workspace.yaml
└── package.json
```

---

## 2. 功能規格

### 2.1 組織架構

| 實體 | 說明 |
|------|------|
| **Organization** | 頂層組織，可設定公開/邀請制/私人 |
| **Space** | 組織下的空間，用於分組 |
| **Collection** | 空間下的集合，包含書籤 |
| **Bookmark** | 書籤實體 |

### 2.2 書籤功能

**添加方式：**
- 直接點擊瀏覽器擴充保存
- URL 輸入添加
- 手動輸入 URL

**自動抓取：**
- 標題 (title)
- 描述 (description)
- OG 圖 (og_image)
- Favicon

**書籤元資料：**
| 欄位 | 說明 |
|------|------|
| URL | 書籤連結 |
| 標題 | 網頁標題 |
| 描述 | 網頁描述 |
| OG 圖 | 社交分享圖 |
| Favicon | 網站圖示 |
| 標籤 | 分類標籤 |
| 狀態 | 已讀/未讀/封存 |
| 排序 | 自訂排序 |
| 建立者 | 使用者名稱 |
| 裝置資訊 | 建立的裝置 |
| 建立時間 | 建立時間 |
| 修改時間 | 修改時間 |

**視圖：** 清單/卡片可切換

**搜尋：** 全文搜尋（標題、描述、URL、標籤）

### 2.3 分享與權限

**分享顆粒度：** Organization、Space、Collection、單個書籤

**角色權限：**
| 角色 | 說明 |
|------|------|
| Owner | 擁有者，可刪除組織 |
| Admin | 管理者，可管理成員 |
| Editor | 編輯者，可新增/編輯書籤 |
| Viewer | 檢視者，僅可查看 |

**Organization 可發現性：**
- 公開：任何人都可見
- 邀請制：需邀請才能加入
- 私人：僅成員可見

**訂閱/關注：** 用戶可訂閱其他 Organization 的公開內容

### 2.4 通知系統

**通知類型：**
- 新書籤加入
- 被邀請加入
- 訂閱更新
- 書籤被編輯/刪除

**觸達方式：**
- 站內通知
- Email 通知
- 推播通知（移動端）

**用戶設定：** 各類型通知可獨立開關

### 2.5 匯入/匯出

**格式：** HTML、JSON、CSV、RSS

### 2.6 瀏覽器擴充

**介面類型：**
- Popup 彈出視窗
- Sidebar 側邊欄
- 全螢幕首頁（新標籤頁）

**支援瀏覽器：** Chrome、Firefox、Safari、Edge

**Bookmarklet：** 一鍵保存當前頁面

### 2.7 國際化

**支援語言：**
- 繁體中文 (zh-TW)
- 簡體中文 (zh-CN)
- 英文 (en)

---

## 3. 資料模型

### 3.1 ER 關係

```
User
  │ 1:N
  ▼
Organization ←──── UserOrgRole (N:M with Role)
  │ 1:N
  ▼
Space ────── 1:N ────── Collection ────── 1:N ────── Bookmark
                                                    │ N:M
                                                    ▼
                                                  Tag
```

### 3.2 主要資料表

| 表名 | 用途 |
|------|------|
| `users` | 用戶基本資料 |
| `organizations` | 組織 |
| `user_org_roles` | 用戶在組織中的角色 |
| `spaces` | 空間 |
| `collections` | 集合 |
| `bookmarks` | 書籤 |
| `tags` | 標籤 |
| `bookmark_tags` | 書籤-標籤關聯 |
| `share_links` | 分享連結 |
| `subscriptions` | 訂閱 |
| `notifications` | 通知 |
| `sync_events` | 同步事件（移動端） |

---

## 4. API 設計

### 4.1 REST API 端點

```
/api/v1/
├── auth/          # 認證
├── users/         # 用戶
├── organizations/  # 組織
├── spaces/        # 空間
├── collections/   # 集合
├── bookmarks/     # 書籤
├── tags/          # 標籤
├── share/         # 分享
├── subscriptions/ # 訂閱
├── notifications/ # 通知
├── sync/          # 同步
├── import-export/ # 匯入/匯出
└── metadata/      # 元資料抓取
```

### 4.2 WebSocket 事件

```typescript
// 訂閱
'subscribe:org' | 'subscribe:space' | 'subscribe:collection'

// 事件
'bookmark:created' | 'bookmark:updated' | 'bookmark:deleted'
'space:updated' | 'collection:updated'
'member:joined' | 'member:left'
'notification:new'
```

---

## 5. 開發規則（遵循 AGENTS.md）

### 5.1 BDD/TDD 開發流程

1. 確認規格需求
2. 撰寫 BDD 測試案例（.feature 文件）
3. 撰寫單元測試
4. 實作功能
5. 驗證所有測試通過

**工具：**
- 後端：Jest + Supertest
- 前端：Vitest + Playwright (E2E)
- Flutter：flutter_test + integration_test

### 5.2 提示詞規則

所有開發提示詞都必須附加：`use context7`

### 5.3 Code Review 規則

每次開發完成後：`/code-review max --fix`

### 5.4 Task List 規範

- 使用 checkbox 格式
- 每個 task 包含：目標、開發步驟、驗證方式、期望輸出
- 儲存在 `docs/tasks/YYYY-MM-DD_{task_name}.md`

### 5.5 環境變數管理

所有配置放在 `.env` 或 `config/*.yaml`，**嚴禁 hard coding**。

### 5.6 套件管理

- Node.js：`pnpm`
- Python：`uv`

### 5.7 Test Coverage 要求

| 層面 | 最低覆蓋率 |
|------|------------|
| 業務邏輯 | 80% |
| API Endpoints | 80% |
| 關鍵路徑 | 90% |

### 5.8 版本管理

每次完成後：
1. 更新 `CHANGELOG.md`
2. `git tag -a v{x.y.z} -m "Release {version}"`
3. 更新 `README.md`

---

## 6. 開發階段

| Phase | 名稱 | 預估時間 | 累計 |
|-------|------|----------|------|
| 1 | 基礎架構 | 2-3 週 | 2-3 週 |
| 2 | 核心書籤功能 | 3-4 週 | 5-7 週 |
| 3 | Web 前端 MVP | 3-4 週 | 8-11 週 |
| 4 | 分享與權限 | 2-3 週 | 10-14 週 |
| 5 | 瀏覽器擴充 | 2-3 週 | 12-17 週 |
| 6 | 通知系統 | 2 週 | 14-19 週 |
| 7 | 移動端 App | 3-4 週 | 17-23 週 |
| 8 | 匯入/匯出 | 1-2 週 | 18-25 週 |
| 9 | Docker 部署 | 1-2 週 | 19-27 週 |

---

## 7. 環境變數配置

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

## 8. 關鍵技術決策

### 8.1 書籤元資料抓取

- 使用 Bull Queue + Redis 快取
- 避免重複抓取（TTL: 7 天）

### 8.2 即時同步

- Web 端：WebSocket + Redis Pub/Sub
- 移動端：Drift 離線優先 + LWW 衝突處理

### 8.3 全文搜尋

- 初期：PostgreSQL full-text search
- 未來：可遷移到 Meilisearch（中文分詞）

### 8.4 跨瀏覽器擴充

- 使用 WXT 框架
- 單一程式碼，編譯到各瀏覽器

---

## 9. 風險與緩解

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| 書籤 URL 唯一性 | 中 | URL canonicalization |
| 即時同步延遲 | 中 | WebSocket < 100ms |
| 移動端離線衝突 | 中 | LWW + 用戶確認 |
| 跨瀏覽器擴充相容性 | 高 | WXT 統一處理 |
| 多租戶資料隔離 | 高 | PostgreSQL RLS |

---

## 10. 文檔更新記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-01-20 | v1.0 | 初始版本 |
