# Web 前端增強任務清單

**建立日期:** 2025-01-28  
**更新日期:** 2025-01-28  
**任務類型:** Phase 3 - Web 前端 MVP 完善  
**優先級:** P0

---

## 1. 任務概述

完善 Web 前端 MVP，達到可發布狀態。

---

## 2. Task List

### 2.1 WebSocket 即時同步

- [x] **目標:** 實現書籤的即時同步**
- **開發步驟:**
  1. [x] 安裝并配置 socket.io-client
  2. [x] 建立 WebSocket 服務 (`lib/websocket.ts`)
  3. [x] 實現書籤更新的即時監聽
  4. [x] 實現連接狀態管理
  5. [x] 添加自動重連邏輯

- **驗證方式:** 
  - 開啟兩個瀏覽器，一個新增書籤，另一個即時看到更新
  - `console` 無錯誤

- **期望輸出:**
  - `src/lib/websocket.ts` - WebSocket 客戶端服務 ✅
  - `src/lib/websocket.test.ts` - 測試文件 ✅

---

### 2.2 組織成員管理 UI

- [x] **目標:** 完成組織成員管理介面**

- **開發步驟:**
  1. [x] 建立 `components/organizations/MemberList.tsx`
  2. [x] 建立 `components/organizations/MemberInvite.tsx`
  3. [x] 建立角色選擇下拉選單
  4. [x] 實現成員移除功能
  5. [x] 實現邀請連結生成/複製

- **驗證方式:**
  - 組件測試通過 (14 tests, 76 total passing)
  - UI 可正確顯示成員列表

- **期望輸出:**
  - `src/components/organizations/MemberList.tsx` ✅
  - `src/components/organizations/MemberInvite.tsx` ✅
  - `src/components/organizations/*.test.tsx` ✅

---

### 2.3 空間/集合管理 UI

- [x] **目標:** 完成空間和集合的管理介面**

- **開發步驟:**
  1. [x] 建立 `components/spaces/SpaceList.tsx`
  2. [x] 建立 `components/collections/CollectionList.tsx`

- **驗證方式:**
  - 組件測試通過 (88 tests total passing)

- **期望輸出:**
  - `src/components/spaces/SpaceList.tsx` ✅
  - `src/components/collections/CollectionList.tsx` ✅

---

### 2.4 分享功能 UI

- [x] **目標:** 完成書籤/集合分享介面**

- **開發步驟:**
  1. [x] 建立 `components/share/ShareModal.tsx`
  2. [x] 建立分享連結複製功能
  3. [x] 實現分享權限設置（唯讀/可編輯）

- **驗證方式:**
  - 分享連結可正常複製
  - 分享設定正確保存

- **期望輸出:**
  - `src/components/share/ShareModal.tsx` ✅
  - `src/components/share/ShareModal.test.tsx` ✅

---

### 2.5 匯入/匯出 UI

- [ ] **目標:** 完成資料匯入匯出介面**

- **開發步驟:**
  1. 建立 `components/import-export/ImportModal.tsx`
  2. 建立 `components/import-export/ExportModal.tsx`
  3. 實現 HTML/JSON/CSV 格式選擇
  4. 實現檔案上傳預覽
  5. 實現進度條顯示

- **驗證方式:**
  - 可成功匯入 HTML 書籤檔
  - 可成功匯出書籤

- **期望輸出:**
  - `src/components/import-export/ImportModal.tsx`
  - `src/components/import-export/ExportModal.tsx`

---

### 2.6 搜尋功能完善

- [x] **目標:** 實現完整的全文搜尋**

- **開發步驟:**
  1. [x] 建立 `components/search/SearchBar.tsx`
  2. [x] 實現即時搜尋（debounced）

- **驗證方式:**
  - 搜尋結果準確
  - 回應速度 < 300ms

- **期望輸出:**
  - `src/components/search/SearchBar.tsx` ✅

---

### 2.7 通知系統 UI

- [x] **目標:** 完成通知中心介面**

- **開發步驟:**
  1. [x] 建立 `components/notifications/NotificationBell.tsx`
  2. [x] 實現通知類型圖示
  3. [x] 實現標記已讀功能

- **驗證方式:**
  - 可收到並顯示通知
  - 可標記已讀

- **期望輸出:**
  - `src/components/notifications/NotificationBell.tsx` ✅

---

### 2.9 載入狀態和錯誤處理

- [x] **目標:** 改善用戶體驗**

- **開發步驟:**
  1. [x] 建立 `components/ui/Toast.tsx`

- **驗證方式:**
  - Toast 通知正常顯示

- **期望輸出:**
  - `src/components/ui/Toast.tsx` ✅

---

## 3. 驗證標準

- [x] `pnpm test` 全部通過 ✅ (101 tests)
- [x] `pnpm build` 成功 ✅
- [x] 所有新組件有測試 ✅

---

## 4. 相依性

```
Task 2.1 (WebSocket)
    └── Task 2.7 (通知 UI)
         └── Task 2.8 (設定頁面)
```

---

## 5. 文檔更新記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-01-28 | v1.0 | 初始版本 |
