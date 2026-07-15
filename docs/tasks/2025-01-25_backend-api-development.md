# 後端 API 開發任務清單

**建立日期:** 2025-01-25  
**更新日期:** 2025-01-25  
**任務類型:** Phase 2 - 後端 API 基礎建設

---

## 任務概述

本次任務旨在建置 Xiaoxin 專案的後端 API，包含：
1. Prisma 資料庫連線模組
2. JWT 認證模組
3. 使用者管理 API
4. Redis/Valkey 快取模組
5. 基礎 CRUD API（Organization, Space, Collection, Bookmark）

---

## 已完成工作

1. ✅ **Prisma 資料庫連線模組** - `prisma.service.ts`, `prisma.module.ts`
2. ✅ **JWT 認證模組** - `auth.service.ts`, `auth.controller.ts`, `jwt.strategy.ts`, `jwt-auth.guard.ts`
3. ✅ **使用者管理 API** - `users.service.ts`, `users.controller.ts`
4. ✅ **Organization API** - `organizations.service.ts`, `organizations.controller.ts`
5. ✅ **Space & Collection API** - `spaces/`, `collections/` 模組
6. ✅ **Bookmark API** - `bookmarks.service.ts`, `bookmarks.controller.ts`
7. ✅ **其他模組** - Tags, Share, Metadata, Import-Export

## Task List

### Task 2.1: Prisma 資料庫連線模組 ✅
- [x] **目標:** 建立 Prisma 連線模組，供全系統使用
- [x] **驗證方式:** `pnpm --filter @xiaoxin/backend build` 成功
- [x] **期望輸出:** PrismaModule 和 PrismaService

### Task 2.2: JWT 認證模組 ✅
- [x] **目標:** 建立 JWT 認證機制
- [x] **驗證方式:** `pnpm --filter @xiaoxin/backend build` 成功
- [x] **期望輸出:** JWT 認證可正常運作

### Task 2.3: 使用者管理 API ✅
- [x] **目標:** 建立使用者 CRUD API
- [x] **驗證方式:** 程式碼已完成
- [x] **期望輸出:** `/api/v1/users` CRUD API

### Task 2.4: Organization API ✅
- [x] **目標:** 建立 Organization CRUD API
- [x] **驗證方式:** 程式碼已完成
- [x] **期望輸出:** `/api/v1/organizations` CRUD API

### Task 2.5: Space & Collection API ✅
- [x] **目標:** 建立 Space 和 Collection API
- [x] **驗證方式:** 程式碼已完成
- [x] **期望輸出:** `/api/v1/spaces` 和 `/api/v1/collections` API

### Task 2.6: Bookmark API ✅
- [x] **目標:** 建立 Bookmark CRUD API
- [x] **驗證方式:** 程式碼已完成
- [x] **期望輸出:** `/api/v1/bookmarks` CRUD API

---

## API 端點規劃

```
POST   /api/v1/auth/register     # 註冊
POST   /api/v1/auth/login        # 登入
GET    /api/v1/auth/me          # 當前用戶

GET    /api/v1/users            # 列出用戶
GET    /api/v1/users/:id        # 取得用戶
PATCH  /api/v1/users/:id        # 更新用戶
DELETE /api/v1/users/:id        # 刪除用戶

GET    /api/v1/organizations    # 列出組織
POST   /api/v1/organizations    # 建立組織
GET    /api/v1/organizations/:id # 取得組織
PATCH  /api/v1/organizations/:id # 更新組織
DELETE /api/v1/organizations/:id # 刪除組織

GET    /api/v1/spaces           # 列出空間
POST   /api/v1/spaces           # 建立空間
GET    /api/v1/spaces/:id       # 取得空間
PATCH  /api/v1/spaces/:id       # 更新空間
DELETE /api/v1/spaces/:id       # 刪除空間

GET    /api/v1/collections      # 列出集合
POST   /api/v1/collections      # 建立集合
GET    /api/v1/collections/:id  # 取得集合
PATCH  /api/v1/collections/:id  # 更新集合
DELETE /api/v1/collections/:id  # 刪除集合

GET    /api/v1/bookmarks        # 列出書籤
POST   /api/v1/bookmarks        # 建立書籤
GET    /api/v1/bookmarks/:id    # 取得書籤
PATCH  /api/v1/bookmarks/:id    # 更新書籤
DELETE /api/v1/bookmarks/:id    # 刪除書籤
```

---

## 相依性

```
Task 2.1 (Prisma) 
    └── Task 2.2 (JWT Auth) ─────────────┐
         └── Task 2.3 (Users)             │
              └── Task 2.4 (Organizations)│
                   └── Task 2.5 (Spaces/Collections)
                        └── Task 2.6 (Bookmarks)
```

---

## 下一步

完成後端 API 後，將進入：
- Phase 3: 前端 Web MVP
