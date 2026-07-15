# 基礎架構建置任務清單

**建立日期:** 2025-01-25  
**更新日期:** 2025-01-25  
**任務類型:** Phase 1 - 基礎架構

---

## 任務概述

本次任務旨在建置 Xiaoxin 專案的基礎架構，包括：
1. Docker Compose 設定（PostgreSQL、Valkey、Logto）
2. Prisma 資料庫 Schema 設計
3. JWT 認證機制
4. 環境變數配置

---

## Task List

### Task 1.1: 更新 Docker Compose 配置（使用 Valkey 替代 Redis） ✅
- [x] **目標:** 將 docker-compose.yml 中的 Redis 改為 Valkey，並完善配置
- [x] **開發步驟:**
  1. 修改 `infra/docker/docker-compose.yml`，將 `redis` 服務替換為 `valkey`
  2. 確保 PostgreSQL 配置正確（已有）
  3. 確保 Logto 配置正確（已有），但改為連接共享的 PostgreSQL
  4. 添加必要的環境變數和網路配置
- [x] **驗證方式:** `docker compose config` 無錯誤
- [x] **期望輸出:** `infra/docker/docker-compose.yml` 更新完成

### Task 1.2: 更新 .env.example 環境變數配置 ✅
- [x] **目標:** 更新環境變數以反映新的架構配置
- [x] **開發步驟:**
  1. 更新 Redis 為 Valkey 相關變數
  2. 添加 Logto 所需的所有環境變數
  3. 添加 JWT 相關環境變數
  4. 添加 PostgreSQL 連線池相關設定
- [x] **驗證方式:** 環境變數格式正確，無 hardcoded 值
- [x] **期望輸出:** `.env.example` 更新完成

### Task 1.3: 完成 Prisma Schema 設計 ✅
- [x] **目標:** 完成 Prisma Schema 的詳細設計，確保所有實體和關係正確
- [x] **開發步驟:**
  1. 檢視現有 `apps/backend/prisma/schema.prisma`
  2. 確保所有 Model（User, Organization, Space, Collection, Bookmark, Tag, ShareLink, Subscription, Notification, SyncEvent）正確
  3. 添加必要的索引和關係
  4. 確保與 SPEC.md 中的資料模型一致
- [x] **驗證方式:** `pnpm --filter @xiaoxin/backend prisma:generate` 成功
- [x] **期望輸出:** `apps/backend/prisma/schema.prisma` 完成（已存在，無需修改）

### Task 1.4: 建立 Docker Compose 快速啟動腳本 ✅
- [x] **目標:** 建立便捷的開發環境啟動腳本
- [x] **開發步驟:**
  1. 建立 `infra/docker/start-dev.sh` 腳本
  2. 腳本應包含：docker compose up -d、等待服務就緒檢查
  3. 建立 `infra/docker/stop-dev.sh` 停止腳本
- [x] **驗證方式:** 腳本已建立並設定執行權限
- [x] **期望輸出:** `infra/docker/start-dev.sh` 和 `infra/docker/stop-dev.sh`

---

## 已完成工作

1. ✅ **Docker Compose 更新** - 將 Redis 替換為 Valkey，新增健康檢查和網路配置
2. ✅ **.env.example 更新** - 添加 Valkey、JWT、Logto 環境變數
3. ✅ **Prisma Schema** - 已存在並正確配置
4. ✅ **啟動腳本** - 建立 `start-dev.sh` 和 `stop-dev.sh`

---

## 相依性

```
Task 1.1 (Docker Compose) ✅
    ├── Task 1.2 (.env.example) ✅
    └── Task 1.3 (Prisma Schema) ✅
            └── Task 1.4 (啟動腳本) ✅
```

---

## 下一步

完成基礎架構後，將進入：
- Phase 2: 後端 API 基礎建設（JWT 認證）
- Phase 3: 前端 Web MVP

---

## 變更記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-01-25 | v1.1 | 更新 Docker Compose 使用 Valkey，新增啟動腳本，更新 .env.example |
