# 移動端 App 核心任務清單

**建立日期:** 2025-01-28  
**更新日期:** 2025-01-28  
**任務類型:** Phase 7 - 移動端 App  
**優先級:** P0

---

## 1. 任務概述

實現 Flutter 移動端的核心書籤功能。

---

## 2. Task List

### 2.1 Drift Database 完整定義

- [ ] **目標:** 完成本地資料庫 Schema**

- **開發步驟:**
  1. 定義 Users table
  2. 定義 Organizations table
  3. 定義 Spaces table
  4. 定義 Collections table
  5. 定義 Bookmarks table
  6. 定義 Tags table
  7. 實現數據遷移

- **驗證方式:**
  - `dart run build_runner build` 成功
  - 數據庫正確創建

- **期望輸出:**
  - `lib/core/db/database.dart` - 完整 schema

---

### 2.2 認證流程

- [ ] **目標:** 實現登入/註冊功能**

- **開發步驟:**
  1. 建立登入頁面 UI
  2. 建立註冊頁面 UI
  3. 實現 JWT token 存儲
  4. 實現自動登入
  5. 實現登出功能

- **驗證方式:**
  - 可正常登入/註冊
  - Token 正確保存

- **期望輸出:**
  - `lib/presentation/pages/login_page.dart`
  - `lib/presentation/pages/register_page.dart`

---

### 2.3 書籤列表頁面

- [ ] **目標:** 實現書籤列表顯示**

- **開發步驟:**
  1. 建立書籤列表頁面
  2. 實現書籤卡片 UI
  3. 實現下拉刷新
  4. 實現上拉加載更多
  5. 實現書籤狀態篩選

- **驗證方式:**
  - 書籤列表正確顯示
  - 刷新/加載功能正常

- **期望輸出:**
  - `lib/presentation/pages/bookmarks_page.dart`

---

### 2.4 書籤新增/編輯

- [ ] **目標:** 實現書籤新增/編輯**

- **開發步驟:**
  1. 建立書籤表單頁面
  2. 實現 URL 輸入/黏貼
  3. 實現自動元資料抓取
  4. 實現空間/集合選擇
  5. 實現標籤管理

- **驗證方式:**
  - 可成功新增/編輯書籤
  - 元資料自動填充

- **期望輸出:**
  - `lib/presentation/pages/bookmark_form_page.dart`

---

### 2.5 組織/空間選擇

- [ ] **目標:** 實現導航和選擇功能**

- **開發步驟:**
  1. 建立組織列表頁面
  2. 建立空間列表頁面
  3. 建立集合列表頁面
  4. 實現快速切換
  5. 實現麵包屑導航

- **驗證方式:**
  - 可正確切換組織/空間/集合
  - 顯示當前位置

- **期望輸出:**
  - `lib/presentation/pages/spaces_page.dart`
  - `lib/presentation/widgets/navigation_breadcrumb.dart`

---

### 2.6 搜尋功能

- [ ] **目標:** 實現書籤搜尋**

- **開發步驟:**
  1. 建立搜尋頁面
  2. 實現即時搜尋
  3. 實現搜尋歷史
  4. 實現熱門搜尋
  5. 實現結果高亮

- **驗證方式:**
  - 搜尋結果準確
  - 回應速度 < 300ms

- **期望輸出:**
  - `lib/presentation/pages/search_page.dart`

---

### 2.7 離線支援

- [ ] **目標:** 實現離線書籤存取**

- **開發步驟:**
  1. 實現本地緩存策略
  2. 實現離線書籤列表
  3. 實現離線書籤新增（佇列）
  4. 實現同步狀態指示
  5. 實現衝突檢測（LWW）

- **驗證方式:**
  - 離線時可查看書籤
  - 網路恢復後正確同步

- **期望輸出:**
  - `lib/core/sync/sync_service.dart`
  - `lib/core/sync/offline_queue.dart`

---

### 2.8 iOS/Android 構建設定

- [ ] **目標:** 完成雙平台構建配置**

- **開發步驟:**
  1. 配置 iOS Bundle ID
  2. 配置 Android Application ID
  3. 設置版本號和名稱
  4. 配置圖標和啟動畫面
  5. 生成 release keystore

- **驗證方式:**
  - `flutter build ios` 成功
  - `flutter build apk` 成功

- **期望輸出:**
  - 可上架的 iOS/Android App

---

## 3. 驗證標準

- [ ] `flutter analyze` 無錯誤
- [ ] `flutter test` 全部通過
- [ ] iOS/Android 構建成功

---

## 4. 文檔更新記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-01-28 | v1.0 | 初始版本 |
