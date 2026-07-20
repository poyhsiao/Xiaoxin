# 部署與 DevOps 任務清單

**建立日期:** 2025-01-28  
**更新日期:** 2025-01-30  
**任務類型:** Phase 9 - Docker 部署  
**優先級:** P2

---

## 1. 任務概述

實現生產環境部署和 CI/CD 自動化。

---

## 2. Task List

### 2.1 完整 Docker Compose 配置

- [ ] **目標:** 完善 Docker 部署配置**

#### 2.1.1 Docker Compose 基礎架構

- [ ] **子任務:** 建立 Docker Compose 基礎配置
- **開發步驟:**
  1. [ ] 建立 `infra/docker/docker-compose.yml`
  2. [ ] 配置 `postgres` service（image: postgres:16-alpine，port: 5432）
  3. [ ] 配置 `redis` service（image: redis:7-alpine，port: 6379）
  4. [ ] 配置 `backend` service（build context: apps/backend，port: 3000）
  5. [ ] 配置 `frontend` service（build context: apps/web，port: 3000）
  6. [ ] 配置 `nginx` service（image: nginx:alpine，port: 80/443）
  7. [ ] 配置網絡 `xiaoxin-network`（bridge driver）

- **驗收標準:**
  - ✅ `docker-compose config` 驗證通過
  - ✅ `docker-compose up -d` 所有服務正常啟動
  - ✅ 服務間正確通信（backend 可訪問 postgres/redis，frontend 通過 nginx 訪問 backend）

- **期望輸出:**
  - `infra/docker/docker-compose.yml`
  - `infra/docker/.env.example`

#### 2.1.2 資料持久化配置

- [ ] **子任務:** 配置資料持久化
- **開發步驟:**
  1. [ ] 配置 PostgreSQL volume（`postgres_data:/var/lib/postgresql/data`）
  2. [ ] 配置 Redis volume（`redis_data:/data`）
  3. [ ] 配置上傳檔案 volume（`uploads:/app/uploads`）
  4. [ ] 配置 Nginx logs volume（`nginx_logs:/var/log/nginx`）
  5. [ ] 實現資料備份脚本（每日凌晨 3 點執行）

- **驗收標準:**
  - ✅ `docker-compose down -v` 後重新啟動資料未丢失（因為有 volume mount）
  - ✅ 備份脚本正確執行並生成備份檔案
  - ✅ 備份檔案命名格式正確（`backup_YYYYMMDD_HHMMSS.sql`）

- **期望輸出:**
  - `infra/docker/scripts/backup.sh`
  - `infra/docker/scripts/restore.sh`

#### 2.1.3 環境變數配置

- [ ] **子任務:** 配置環境變數
- **開發步驟:**
  1. [ ] 建立 `infra/docker/.env.production.template`
  2. [ ] 配置資料庫連接變數（`DATABASE_URL`、`POSTGRES_USER`、`POSTGRES_PASSWORD`）
  3. [ ] 配置 Redis 連接變數（`REDIS_URL`）
  4. [ ] 配置 Logto 變數（`LOGTO_ENDPOINT`、`LOGTO_APP_ID`、`LOGTO_APP_SECRET`）
  5. [ ] 配置 JWT 密鑰（`JWT_SECRET`）
  6. [ ] 配置 CORS 允許清單（`ALLOWED_ORIGINS`）

- **驗收標準:**
  - ✅ 所有敏感資訊通過環境變數注入，不 hardcode
  - ✅ `.env.production.template` 包含所有必要變數並有註解說明
  - ✅ 服務啟動時正確讀取環境變數

- **期望輸出:**
  - `infra/docker/.env.production.template`

#### 2.1.4 Nginx 反向代理配置

- [ ] **子任務:** 配置 Nginx 反向代理
- **開發步驟:**
  1. [ ] 建立 `infra/docker/nginx/default.conf`
  2. [ ] 配置 `/api` 路由到 backend（`http://backend:3000`）
  3. [ ] 配置 `/socket.io` WebSocket 升級代理
  4. [ ] 配置靜態檔案緩存（`/next`、`/_next` 緩存 1 年）
  5. [ ] 配置 Gzip 壓縮
  6. [ ] 配置安全 header（X-Frame-Options、X-Content-Type-Options 等）

- **驗收標準:**
  - ✅ `curl -I http://localhost/api/health` 返回 200
  - ✅ WebSocket 連接通過 `/socket.io` 正確建立
  - ✅ 靜態資源正確緩存（檢查 Response Header `Cache-Control`）
  - ✅ Gzip 壓縮正確啟用（檢查 Response Header `Content-Encoding: gzip`）

- **期望輸出:**
  - `infra/docker/nginx/default.conf`

---

### 2.2 生產環境配置

- [ ] **目標:** 完成生產環境設定**

#### 2.2.1 SSL/TLS 憑證配置

- [ ] **子任務:** 配置 HTTPS
- **開發步驟:**
  1. [ ] 配置 Nginx SSL 監聽（port 443）
  2. [ ] 配置 Let's Encrypt 自動申請憑證（使用 certbot）
  3. [ ] 配置 HTTP 到 HTTPS 強制重定向
  4. [ ] 配置 TLS 版本（1.2、1.3）
  5. [ ] 配置安全加密套件
  6. [ ] 配置 OCSP Stapling

- **驗收標準:**
  - ✅ 使用 SSL Labs 測試評級 A+
  - ✅ `curl -L http://localhost` 自動重定向到 HTTPS
  - ✅ 憑證過期前自動續期

- **期望輸出:**
  - `infra/docker/docker-compose.yml`（新增 certbot service）
  - `infra/docker/nginx/ssl.conf`

#### 2.2.2 CORS 配置

- [ ] **子任務:** 配置 CORS
- **開發步驟:**
  1. [ ] 在 Nginx 配置允許的 origin清單
  2. [ ] 配置允許的 HTTP 方法（GET、POST、PUT、PATCH、DELETE、OPTIONS）
  3. [ ] 配置允許的 header（Content-Type、Authorization 等）
  4. [ ] 配置 credentials 支援
  5. [ ] 配置預檢請求緩存時間

- **驗收標準:**
  - ✅ 從允許的域名發起的請求正常處理
  - ✅ 從不允許的域名發起的請求返回 403
  - ✅ 預檢請求（OPTIONS）正確處理

- **期望輸出:**
  - `infra/docker/nginx/default.conf`（CORS 部分）

#### 2.2.3 Rate Limiting 配置

- [ ] **子任務:** 配置請求頻率限制
- **開發步驟:**
  1. [ ] 配置 Nginx rate limiting zone（100 requests/minute per IP）
  2. [ ] 配置 API 端點更嚴格限制（20 requests/minute per IP）
  3. [ ] 配置連接數限制（每 IP 最多 50 個連接）
  4. [ ] 配置 429 Too Many Requests 回應
  5. [ ] 配置白名單 IP 不受限制

- **驗收標準:**
  - ✅ 正常請求正常處理
  - ✅ 超過限制返回 429 狀態碼
  - ✅ 白名單 IP 無限制

- **期望輸出:**
  - `infra/docker/nginx/default.conf`（rate limiting 部分）

#### 2.2.4 日誌管理配置

- [ ] **子任務:** 配置日誌管理
- **開發步驟:**
  1. [ ] 配置 Nginx JSON 格式日誌
  2. [ ] 配置 NestJS 结构化日誌（JSON 格式）
  3. [ ] 配置日誌輪轉（logrotate，保留 30 天）
  4. [ ] 配置集中式日誌收集（可選：ELK stack）
  5. [ ] 配置錯誤日誌單獨輸出

- **驗收標準:**
  - ✅ 日誌檔案正確生成
  - ✅ 日誌內容為有效的 JSON 格式
  - ✅ logrotate 正確輪轉日誌
  - ✅ 錯誤日誌包含完整的 stack trace

- **期望輸出:**
  - `infra/docker/nginx/default.conf`
  - `infra/docker/logrotate.conf`

---

### 2.3 CI/CD Pipeline

- [ ] **目標:** 實現自動化部署流程**

#### 2.3.1 GitHub Actions Workflow 建立

- [ ] **子任務:** 建立 GitHub Actions Workflow
- **開發步驟:**
  1. [ ] 建立 `.github/workflows/ci.yml` - PR/push 時的 CI workflow
  2. [ ] 配置 Node.js 20 環境
  3. [ ] 配置 pnpm 安裝和緩存
  4. [ ] 配置 `pnpm install`
  5. [ ] 配置 `pnpm lint`
  6. [ ] 配置 `pnpm build`
  7. [ ] 配置 `pnpm test`
  8. [ ] 配置 `pnpm test:e2e`（E2E 測試）

- **驗收標準:**
  - ✅ PR 創建時 workflow 自動觸發
  - ✅ lint 失敗阻止 merge
  - ✅ build 失敗阻止 merge
  - ✅ test 失敗阻止 merge
  - ✅ workflow 狀態正確顯示在 PR 頁面

- **期望輸出:**
  - `.github/workflows/ci.yml`

#### 2.3.2 自動化測試配置

- [ ] **子任務:** 配置自動化測試
- **開發步驟:**
  1. [ ] 配置 unit test workflow
  2. [ ] 配置 integration test workflow（使用 test database）
  3. [ ] 配置 E2E test workflow（使用 Docker Compose 完整環境）
  4. [ ] 配置測試覆蓋率報告生成
  5. [ ] 配置測試結果上傳（作為 artifact）

- **驗收標準:**
  - ✅ unit test 在 5 分鐘內完成
  - ✅ integration test 使用隔離的測試資料庫
  - ✅ E2E test 在 CI 環境完整運行
  - ✅ 覆蓋率報告生成並上傳

- **期望輸出:**
  - `.github/workflows/ci.yml`（測試部分）

#### 2.3.3 自動化構建配置

- [ ] **子任務:** 配置自動化構建
- **開發步驟:**
  1. [ ] 配置 Docker image build workflow
  2. [ ] 配置 multi-platform build（linux/amd64、linux/arm64）
  3. [ ] 配置 image tag（`latest` + commit SHA）
  4. [ ] 配置 Docker Layer Caching
  5. [ ] 配置 image 推送至 Registry（Docker Hub / GHCR）

- **驗收標準:**
  - ✅ image build 時間 < 10 分鐘（有 cache）
  - ✅ image tag 正確包含 SHA
  - ✅ image 成功推送到 Registry
  - ✅ multi-platform image 可在不同架構運行

- **期望輸出:**
  - `.github/workflows/build.yml`

#### 2.3.4 自動化部署配置

- [ ] **子任務:** 配置自動化部署
- **開發步驟:**
  1. [ ] 建立 `.github/workflows/deploy.yml`
  2. [ ] 配置部署到 Staging 環境（push 到 `staging` branch）
  3. [ ] 配置部署到 Production 環境（push tag 或 release）
  4. [ ] 配置 SSH 部署到伺服器
  5. [ ] 配置部署前確認（需要人工 approve）

- **驗收標準:**
  - ✅ push 到 staging branch 時自動部署到 staging 環境
  - ✅ push tag `v*` 時自動部署到 production 環境
  - ✅ 生產部署需要手動 approve
  - ✅ 部署成功/失敗通知（Email 或 Slack）

- **期望輸出:**
  - `.github/workflows/deploy.yml`
  - `infra/docker/scripts/deploy.sh`

#### 2.3.5 Rollback 策略配置

- [ ] **子任務:** 配置回滾策略
- **開發步驟:**
  1. [ ] 建立 `.github/workflows/rollback.yml`
  2. [ ] 配置從上一個成功的 deployment rollback
  3. [ ] 配置 Docker image rollback
  4. [ ] 配置資料庫 migration rollback
  5. [ ] 配置 rollback 通知

- **驗收標準:**
  - ✅ rollback workflow 可手動觸發
  - ✅ rollback 完成時間 < 5 分鐘
  - ✅ rollback 後系統正常運行

- **期望輸出:**
  - `.github/workflows/rollback.yml`
  - `infra/docker/scripts/rollback.sh`

---

### 2.4 監控與日誌

- [ ] **目標:** 建立監控和日誌系統**

#### 2.4.1 日誌收集配置

- [ ] **子任務:** 配置日誌收集
- **開發步驟:**
  1. [ ] 配置 Loki 作為日誌收集系統
  2. [ ] 配置 Promtail 作為日誌蒐集代理
  3. [ ] 配置 Docker logging driver（json-file + Loki）
  4. [ ] 配置日誌保留策略（30 天）
  5. [ ] 配置日誌索引

- **驗收標準:**
  - ✅ 所有服務日誌集中到 Loki
  - ✅ 日誌查詢正確（按時間、服務、level 篩選）
  - ✅ 日誌保留 30 天

- **期望輸出:**
  - `infra/docker/docker-compose.monitoring.yml`
  - `infra/docker/loki-config.yml`

#### 2.4.2 Grafana 儀表板配置

- [ ] **子任務:** 配置 Grafana 儀表板
- **開發步驟:**
  1. [ ] 配置 Grafana container（port 3001）
  2. [ ] 配置 Prometheus 作為資料來源
  3. [ ] 建立 Backend API Dashboard（請求率、延遲、錯誤率）
  4. [ ] 建立 Database Dashboard（連接數、查詢延遲）
  5. [ ] 建立 System Dashboard（CPU、Memory、Network）
  6. [ ] 建立 Alert Dashboard（Alert 歷史）

- **驗收標準:**
  - ✅ Grafana 可正常訪問（`http://localhost:3001`）
  - ✅ 所有 dashboard 正確顯示數據
  - ✅ Alert 規則正確觸發

- **期望輸出:**
  - `infra/docker/grafana/dashboards/` - Dashboard JSON
  - `infra/docker/grafana/provisioning/` - 自動配置

#### 2.4.3 錯誤追蹤配置

- [ ] **子任務:** 配置 Sentry 錯誤追蹤
- **開發步驟:**
  1. [ ] 在 NestJS 安裝 `@sentry/node`
  2. [ ] 配置 Sentry DSN
  3. [ ] 配置 Source Maps 上傳
  4. [ ] 配置自訂錯誤分類
  5. [ ] 配置 Alert 規則（新錯誤、錯誤暴增）

- **驗收標準:**
  - ✅ 錯誤自動上傳到 Sentry
  - ✅ Sentry 正確顯示錯誤 stack trace
  - ✅ Source Maps 正確解析
  - ✅ Alert 正確發送

- **期望輸出:**
  - `apps/backend/src/main.ts`（Sentry 配置）
  - `.github/workflows/sentry.yml`（Source Maps 上傳）

#### 2.4.4 健康檢查端點

- [ ] **子任務:** 配置健康檢查端點
- **開發步驟:**
  1. [ ] 建立 `/health` 端點（basic liveness check）
  2. [ ] 建立 `/health/ready` 端點（readiness check，包含 DB/Redis 連接）
  3. [ ] 配置 Nginx health check
  4. [ ] 配置 Docker HEALTHCHECK
  5. [ ] 配置負載均衡器 health check

- **驗收標準:**
  - ✅ `curl http://localhost/health` 返回 200
  - ✅ DB/Redis 斷開時 `/health/ready` 返回 503
  - ✅ Docker container 正確顯示 health status

- **期望輸出:**
  - `apps/backend/src/health/` - Health check modules

#### 2.4.5 Alert 系統配置

- [ ] **子任務:** 配置 Alert 系統
- **開發步驟:**
  1. [ ] 配置 Alertmanager 处理 Prometheus alerts
  2. [ ] 配置 Alert 頻道（Email、Slack）
  3. [ ] 配置 Alert 規則（CPU > 80%、Memory > 85%、API 錯誤率 > 1%）
  4. [ ] 配置 Alert 冷卻時間（避免 alert 風暴）
  5. [ ] 配置 Alert 升級（未回應則升級）

- **驗收標準:**
  - ✅ Alert 正確�發
  - ✅ Alert 正確發送到設定的頻道
  - ✅ Alert 恢復後正確發送 resolved 通知

- **期望輸出:**
  - `infra/docker/alertmanager.yml`
  - `infra/docker/prometheus/alerts.yml`

---

## 3. 驗證標準

- [ ] Docker Compose 正常運作
- [ ] CI/CD pipeline 正常
- [ ] 監控系統正常
- [ ] Alert 系統正常

---

## 4. 相依性

```
Phase 1-8 完成後開始
    │
    └── Task 2.1 (Docker Compose)
         ├── 2.1.1 基礎架構
         ├── 2.1.2 持久化
         ├── 2.1.3 環境變數
         └── 2.1.4 Nginx
              │
              └── Task 2.2 (生產環境)
                   ├── 2.2.1 SSL/TLS
                   ├── 2.2.2 CORS
                   ├── 2.2.3 Rate Limiting
                   └── 2.2.4 日誌
                        │
                        └── Task 2.3 (CI/CD)
                             ├── 2.3.1 Workflow
                             ├── 2.3.2 測試
                             ├── 2.3.3 構建
                             ├── 2.3.4 部署
                             └── 2.3.5 Rollback
                                  │
                                  └── Task 2.4 (監控)
                                       ├── 2.4.1 Loki
                                       ├── 2.4.2 Grafana
                                       ├── 2.4.3 Sentry
                                       ├── 2.4.4 Health
                                       └── 2.4.5 Alert
```

---

## 5. 文檔更新記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-01-28 | v1.0 | 初始版本 |
| 2025-01-30 | v1.1 | 全面細化每個子任務，增加驗收標準 |
