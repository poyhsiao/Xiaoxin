# 即時通知系統任務清單

**建立日期:** 2025-01-28  
**更新日期:** 2025-01-30  
**任務類型:** Phase 6 - 通知系統  
**優先級:** P1

---

## 1. 任務概述

實現完整的即時通知系統。

---

## 2. Task List

### 2.1 後端通知 API

- [ ] **目標:** 完成通知 REST API**

#### 2.1.1 Notification Model 定義

- [ ] **子任務:** 建立通知資料模型
- **開發步驟:**
  1. [ ] 建立 `modules/notifications/entities/notification.entity.ts`
  2. [ ] 定義欄位：`id`、`userId`、`type`、`title`、`content`、`data`、`isRead`、`createdAt`
  3. [ ] 定義通知類型 enum：`BOOKMARK_CREATED`、`BOOKMARK_UPDATED`、`BOOKMARK_DELETED`、`MEMBER_INVITED`、`MEMBER_REMOVED`、`SPACE_UPDATED`、`COLLECTION_UPDATED`、`SUBSCRIPTION_UPDATE`
  4. [ ] 建立與 User 的 ManyToOne 關係
  5. [ ] 建立資料庫遷移檔案

- **驗收標準:**
  - ✅ Entity 定義符合 TypeORM 規範
  - ✅ 遷移執行後資料表正確創建
  - ✅ `npx jest notifications --testPathPattern=notification.entity` 通過

#### 2.1.2 NotificationsModule 建立

- [ ] **子任務:** 建立通知模組
- **開發步驟:**
  1. [ ] 建立 `modules/notifications/notifications.module.ts`
  2. [ ] 建立 `modules/notifications/notifications.controller.ts`
  3. [ ] 建立 `modules/notifications/notifications.service.ts`
  4. [ ] 實現 `create()` 方法（建立通知）
  5. [ ] 實現 `findAllByUser()` 方法（查詢用戶所有通知）
  6. [ ] 實現 `findOne()` 方法（查詢單一通知）
  7. [ ] 實現 `markAsRead()` 方法（標記已讀）
  8. [ ] 實現 `markAllAsRead()` 方法（全部標記已讀）
  9. [ ] 實現 `delete()` 方法（刪除通知）
  10. [ ] 實現 `deleteOld()` 方法（刪除 30 天前通知）

- **驗收標準:**
  - ✅ `GET /api/v1/notifications` 返回用戶通知列表（分頁）
  - ✅ `GET /api/v1/notifications/:id` 返回單一通知詳情
  - ✅ `PATCH /api/v1/notifications/:id/read` 標記已讀成功
  - ✅ `PATCH /api/v1/notifications/read-all` 全部標記已讀
  - ✅ `DELETE /api/v1/notifications/:id` 刪除成功
  - ✅ `DELETE /api/v1/notifications/cleanup` 清理 30 天前通知
  - ✅ 單元測試覆蓋率達 80%

- **期望輸出:**
  - `modules/notifications/entities/notification.entity.ts`
  - `modules/notifications/notifications.module.ts`
  - `modules/notifications/notifications.controller.ts`
  - `modules/notifications/notifications.service.ts`
  - `modules/notifications/notifications.service.spec.ts`

#### 2.1.3 觸發通知時機整合

- [ ] **子任務:** 在各業務邏輯中觸發通知
- **開發步驟:**
  1. [ ] 在書籤 created 事件中觸發 `BOOKMARK_CREATED` 通知
  2. [ ] 在書籤 updated 事件中觸發 `BOOKMARK_UPDATED` 通知
  3. [ ] 在書籤 deleted 事件中觸發 `BOOKMARK_DELETED` 通知
  4. [ ] 在成員邀請事件中觸發 `MEMBER_INVITED` 通知
  5. [ ] 在成員移除事件中觸發 `MEMBER_REMOVED` 通知
  6. [ ] 在空間/集合更新中觸發 `SPACE_UPDATED` / `COLLECTION_UPDATED` 通知
  7. [ ] 實現通知冷卻機制（同一事件 5 分鐘內不重複通知）

- **驗收標準:**
  - ✅ 新增書籤後，相關用戶收到通知
  - ✅ 被邀請成員收到邀請通知
  - ✅ 被移除成員收到移除通知
  - ✅ 5 分鐘內同一事件不重複通知

- **期望輸出:**
  - 修改各 service 檔案整合通知觸發

---

### 2.2 WebSocket 通知通道

- [ ] **目標:** 實現 WebSocket 即時推送**

#### 2.2.1 WebSocket Gateway 建立

- [ ] **子任務:** 建立 WebSocket Gateway
- **開發步驟:**
  1. [ ] 建立 `modules/notifications/notifications.gateway.ts`
  2. [ ] 實現 `@WebSocketGateway()` decorator（namespace: `/notifications`）
  3. [ ] 實現 `handleConnection()` 連接處理（驗證 JWT）
  4. [ ] 實現 `handleDisconnect()` 斷連處理
  5. [ ] 實現 `subscribeToUserNotifications()` 訂閱用戶通知頻道
  6. [ ] 實現 `unsubscribeFromUserNotifications()` 取消訂閱
  7. [ ] 實現 `sendToUser()` 發送通知給特定用戶

- **驗收標準:**
  - ✅ 連接時需提供有效 JWT，無效則拒絕連接
  - ✅ 連接成功後用戶自動訂閱自己的通知頻道
  - ✅ 斷連後自動清理訂閱

- **期望輸出:**
  - `modules/notifications/notifications.gateway.ts`

#### 2.2.2 心跳檢測和自動重連

- [ ] **子任務:** 實現心跳檢測和自動重連
- **開發步驟:**
  1. [ ] 實現心跳機制（每 30 秒發送 ping）
  2. [ ] 實現心跳超時處理（60 秒無響應則斷連）
  3. [ ] 實現自動重連（指數退避，最長 30 秒）
  4. [ ] 實現重連上限（最多 10 次）

- **驗收標準:**
  - ✅ 網絡中斷後自動嘗試重連
  - ✅ 重連成功後恢復通知接收
  - ✅ 重連超過 10 次後顯示連接失敗提示

- **期望輸出:**
  - 心跳和重連邏輯整合進 Gateway

#### 2.2.3 Redis Pub/Sub 整合

- [ ] **子任務:** 實現 Redis Pub/Sub 通知分發
- **開發步驟:**
  1. [ ] 建立 Redis Pub/Sub 連接
  2. [ ] 實現 `NotificationPublisher` 發布通知到 Redis
  3. [ ] 實現 `NotificationSubscriber` 從 Redis 訂閱通知
  4. [ ] 實現跨實例通知分發（多 NestJS 实例部署）
  5. [ ] 實現通知事件橋接（Redis -> WebSocket Client）

- **驗收標準:**
  - ✅ 多實例部署時通知正確分發
  - ✅ Redis 連接失敗時有降級處理
  - ✅ 通知延遲 < 100ms

- **期望輸出:**
  - `modules/notifications/notification-publisher.service.ts`
  - `modules/notifications/notification-subscriber.service.ts`

---

### 2.3 Email 通知

- [ ] **目標:** 實現 Email 通知**

#### 2.3.1 Email Service 建立

- [ ] **子任務:** 建立 Email 服務
- **開發步驟:**
  1. [ ] 安裝 `nodemailer` 和 `@types/nodemailer`
  2. [ ] 建立 `modules/notifications/email.service.ts`
  3. [ ] 實現 SMTP 配置（從環境變數讀取）
  4. [ ] 實現 `sendEmail()` 方法
  5. [ ] 實現 HTML 模板渲染（使用 Handlebars）
  6. [ ] 實現純文字版本生成（Email 客戶端相容性）

- **驗收標準:**
  - ✅ 使用 Gmail SMTP 可正常發送
  - ✅ 使用 SendGrid 可正常發送
  - ✅ HTML Email 在主流客戶端正確顯示
  - ✅ 無 SMTP 配置時有明確錯誤提示

- **期望輸出:**
  - `modules/notifications/email.service.ts`
  - `modules/notifications/templates/` - Email 模板

#### 2.3.2 Email 模板建立

- [ ] **子任務:** 建立各類型通知 Email 模板
- **開發步驟:**
  1. [ ] 建立 `new-bookmark.hbs` 新書籤通知模板
  2. [ ] 建立 `member-invited.hbs` 成員邀請模板
  3. [ ] 建立 `bookmark-updated.hbs` 書籤更新模板
  4. [ ] 建立 `account-security.hbs` 帳戶安全模板
  5. [ ] 實現模板變數注入（用戶名、書籤標題等）
  6. [ ] 實現 Email 底部取消訂閱連結

- **驗收標準:**
  - ✅ 所有模板在 Gmail / Outlook / Apple Mail 正確顯示
  - ✅ 模板變數正確替換
  - ✅ 取消訂閱連結有效

- **期望輸出:**
  - `modules/notifications/templates/new-bookmark.hbs`
  - `modules/notifications/templates/member-invited.hbs`
  - `modules/notifications/templates/bookmark-updated.hbs`
  - `modules/notifications/templates/account-security.hbs`
  - `modules/notifications/templates/layout.hbs`

#### 2.3.3 Email Queue 實現

- [ ] **子任務:** 實現 Email 發送佇列
- **開發步驟:**
  1. [ ] 使用 Bull Queue 管理 Email 任務
  2. [ ] 實現 `EmailQueue` 服務
  3. [ ] 實現郵件發送重試機制（最多 3 次）
  4. [ ] 實現失敗郵件記錄和告警
  5. [ ] 實現 Email 頻率限制（每用戶每小時最多 10 封）

- **驗收標準:**
  - ✅ 高峰期 Email 不阻塞 API 響應
  - ✅ 發送失敗自動重試
  - ✅ 頻率限制正確執行

- **期望輸出:**
  - `modules/notifications/email-queue.service.ts`

#### 2.3.4 取消訂閱功能

- [ ] **子任務:** 實現 Email 取消訂閱功能
- **開發步驟:**
  1. [ ] 建立取消訂閱 API 端點 `/api/v1/notifications/unsubscribe`
  2. [ ] 實現基於 Token 的取消訂閱驗證
  3. [ ] 實現用戶 Email 通知總開關
  4. [ ] 實現特定通知類型取消訂閱
  5. [ ] 建立取消訂閱頁面（無需登入）

- **驗收標準:**
  - ✅ Email 底部連結可取消訂閱
  - ✅ 取消訂閱後不再收到該類型 Email
  - ✅ 用戶可在設定頁面重新訂閱

- **期望輸出:**
  - `modules/notifications/unsubscribe.controller.ts`

---

### 2.4 通知設定

- [ ] **目標:** 實現用戶通知偏好設定**

#### 2.4.1 NotificationSettings Model

- [ ] **子任務:** 建立通知設定資料模型
- **開發步驟:**
  1. [ ] 建立 `modules/notifications/entities/notification-settings.entity.ts`
  2. [ ] 定義欄位：`userId`、`emailEnabled`、`pushEnabled`、`bookmarkCreated`、`bookmarkUpdated`、`bookmarkDeleted`、`memberInvited`、`memberRemoved`、`spaceUpdated`、`collectionUpdated`、`mutedUntil`
  3. [ ] 建立與 User 的 OneToOne 關係
  4. [ ] 建立預設設定工廠方法

- **驗收標準:**
  - ✅ Entity 正確建立
  - ✅ 新用戶自動創建預設設定
  - ✅ 設定正確與用戶關聯

- **期望輸出:**
  - `modules/notifications/entities/notification-settings.entity.ts`

#### 2.4.2 設定 API 實現

- [ ] **子任務:** 實現通知設定 API
- **開發步驟:**
  1. [ ] 實現 `getSettings()` 獲取當前設定
  2. [ ] 實現 `updateSettings()` 更新設定
  3. [ ] 實現靜音時段設定（`mutedUntil`）
  4. [ ] 實現批量更新開關

- **驗收標準:**
  - ✅ `GET /api/v1/notifications/settings` 返回當前設定
  - ✅ `PATCH /api/v1/notifications/settings` 更新設定
  - ✅ 靜音時段正確儲存

- **期望輸出:**
  - `modules/notifications/settings.controller.ts`
  - `modules/notifications/settings.service.ts`

#### 2.4.3 設定檢查整合

- [ ] **子任務:** 在通知發送時檢查用戶設定
- **開發步驟:**
  1. [ ] 在 `NotificationsService.create()` 中檢查用戶設定
  2. [ ] 實現 `shouldNotify()` 判斷邏輯
  3. [ ] 實現靜音時段檢查
  4. [ ] 實現頻率限制檢查

- **驗收標準:**
  - ✅ 用戶關閉通知後不發送
  - ✅ 靜音時段內不發送即時通知
  - ✅ 超過頻率限制的通知被跳過

- **期望輸出:**
  - 修改 `notifications.service.ts`

---

### 2.5 推播通知 (Web Push)

- [ ] **目標:** 實現 Web Push 推播通知**

#### 2.5.1 Web Push 設定

- [ ] **子任務:** 設定 Web Push
- **開發步驟:**
  1. [ ] 生成 VAPID 金鑰對
  2. [ ] 建立 `modules/notifications/push.service.ts`
  3. [ ] 實現 Push Manager 整合
  4. [ ] 實現推播權限請求流程

- **驗收標準:**
  - ✅ VAPID 金鑰正確配置
  - ✅ 用戶可授予/拒絕推播權限
  - ✅ 權限狀態正確顯示

- **期望輸出:**
  - `modules/notifications/push.service.ts`

#### 2.5.2 推播通知發送

- [ ] **子任務:** 實現推播通知發送
- **開發步驟:**
  1. [ ] 實現 `sendPush()` 方法
  2. [ ] 實現 `sendPushToUser()` 發送給特定用戶
  3. [ ] 實現 `sendPushToUsers()` 批量發送
  4. [ ] 實現 Service Worker 推播處理

- **驗收標準:**
  - ✅ 推播通知正確送達
  - ✅ 點擊通知可開啟相關頁面
  - ✅ 離線時通知排隊，恢復後發送

- **期望輸出:**
  - `modules/notifications/push.service.ts`
  - `entrypoints/background.ts` (Service Worker)

---

## 3. 驗證標準

- [ ] WebSocket 即時推送正常
- [ ] Email 通知正確發送
- [ ] 用戶可自訂通知偏好
- [ ] 推播通知正常運作
- [ ] 單元測試覆蓋率達 80%

---

## 4. 相依性

```
Phase 1-2 (後端核心) ✅
    │
    └── Task 2.1 (後端通知 API)
         ├── 2.1.1 Notification Model
         ├── 2.1.2 NotificationsModule
         └── 2.1.3 觸發時機整合
              │
              └── Task 2.2 (WebSocket 通道)
                   ├── 2.2.1 WebSocket Gateway
                   ├── 2.2.2 心跳檢測
                   └── 2.2.3 Redis Pub/Sub
                        │
                        └── Task 2.3 (Email 通知)
                             ├── 2.3.1 Email Service
                             ├── 2.3.2 Email 模板
                             ├── 2.3.3 Email Queue
                             └── 2.3.4 取消訂閱
                                  │
                                  └── Task 2.4 (通知設定)
                                       ├── 2.4.1 Settings Model
                                       ├── 2.4.2 設定 API
                                       └── 2.4.3 設定檢查整合
                                            │
                                            └── Task 2.5 (Web Push)
```

---

## 5. 文檔更新記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-01-28 | v1.0 | 初始版本 |
| 2025-01-30 | v1.1 | 全面細化每個子任務，增加驗收標準 |
