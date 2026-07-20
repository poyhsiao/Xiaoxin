# 移動端 App 核心任務清單

**建立日期:** 2025-01-28  
**更新日期:** 2025-01-30  
**任務類型:** Phase 7 - 移動端 App  
**優先級:** P0

---

## 1. 任務概述

實現 Flutter 移動端的核心書籤功能。

---

## 2. Task List

### 2.1 Drift Database 完整定義

- [ ] **目標:** 完成本地資料庫 Schema**

#### 2.1.1 Database Schema 設計

- [ ] **子任務:** 定義所有資料表
- **開發步驟:**
  1. [ ] 定義 `Users` table：id、name、email、avatarUrl、createdAt、updatedAt
  2. [ ] 定義 `Organizations` table：id、name、description、visibility、ownerId、createdAt、updatedAt
  3. [ ] 定義 `UserOrgRoles` table：userId、orgId、role（M:1 用戶、M:1 組織）
  4. [ ] 定義 `Spaces` table：id、name、orgId、createdAt、updatedAt
  5. [ ] 定義 `Collections` table：id、name、spaceId、createdAt、updatedAt
  6. [ ] 定義 `Bookmarks` table：id、url、title、description、ogImage、favicon、collectionId、createdBy、status（M:1 Collection、M:1 User）
  7. [ ] 定義 `Tags` table：id、name、color、createdAt
  8. [ ] 定義 `BookmarkTags` table：bookmarkId、tagId（M:N Bookmarks:Tags）
  9. [ ] 定義 `SyncEvents` table：id、entityType、entityId、operation、timestamp、synced（離線同步事件）
  10. [ ] 執行 `dart run build_runner build` 生成程式碼

- **驗收標準:**
  - ✅ `dart run build_runner build` 成功，無錯誤
  - ✅ 所有 table 定義符合 Flutter 命名規範（snake_case）
  - ✅ 關聯關係正確配置
  - ✅ 遷移檔案自動生成

- **期望輸出:**
  - `lib/core/db/database.dart` - 完整 schema
  - `lib/core/db/tables/` - 各 table 定義

#### 2.1.2 DAO / Repository 封裝

- [ ] **子任務:** 建立資料存取層
- **開發步驟:**
  1. [ ] 建立 `UserDao` - 用戶資料操作
  2. [ ] 建立 `OrganizationDao` - 組織資料操作
  3. [ ] 建立 `SpaceDao` - 空間資料操作
  4. [ ] 建立 `CollectionDao` - 集合資料操作
  5. [ ] 建立 `BookmarkDao` - 書籤 CRUD、搜尋、批量操作
  6. [ ] 建立 `TagDao` - 標籤 CRUD
  7. [ ] 建立 `SyncEventDao` - 同步事件記錄
  8. [ ] 實現 `watchBookmarks()` 書籤監聽（Stream）

- **驗收標準:**
  - ✅ 所有 DAO 方法通過 unit test
  - ✅ watchBookmarks() 在資料變更時正確觸發更新
  - ✅ DAO 方法正確處理 null 和空結果

- **期望輸出:**
  - `lib/core/db/dao/user_dao.dart`
  - `lib/core/db/dao/organization_dao.dart`
  - `lib/core/db/dao/space_dao.dart`
  - `lib/core/db/dao/collection_dao.dart`
  - `lib/core/db/dao/bookmark_dao.dart`
  - `lib/core/db/dao/tag_dao.dart`
  - `lib/core/db/dao/sync_event_dao.dart`

---

### 2.2 認證流程

- [ ] **目標:** 實現登入/註冊功能**

#### 2.2.1 Logto SDK 整合

- [ ] **子任務:** 整合 Logto 認證 SDK
- **開發步驟:**
  1. [ ] 在 `pubspec.yaml` 添加 `logto` 依賴
  2. [ ] 建立 `LogtoService` 封裝登入/登出/令牌管理
  3. [ ] 實現 `signIn()` 方法（開啟系統瀏覽器進行 OIDC 流程）
  4. [ ] 實現 `signOut()` 方法
  5. [ ] 實現 `getAccessToken()` 方法
  6. [ ] 實現 `refreshAccessToken()` 方法（自動刷新即將過期令牌）
  7. [ ] 實現令牌本地持久化存儲
  8. [ ] 實現启动時自動恢復登入狀態

- **驗收標準:**
  - ✅ 首次啟動顯示登入頁面
  - ✅ 點擊登入按鈕後開啟系統瀏覽器
  - ✅ 認證成功後自動返回 App
  - ✅ 關閉 App 再打開無需重新登入（令牌未過期）
  - ✅ 令牌過期後自動刷新
  - ✅ 刷新失敗後正確引導重新登入

- **期望輸出:**
  - `lib/core/services/logto_service.dart`

#### 2.2.2 登入/註冊 UI

- [ ] **子任務:** 建立登入/註冊頁面
- **開發步驟:**
  1. [ ] 建立 `LoginScreen` 頁面
  2. [ ] 實現「使用 Google 登入」按鈕
  3. [ ] 實現「使用 GitHub 登入」按鈕
  4. [ ] 實現「使用 Email 登入」表單
  5. [ ] 實現首次登入後引導設定用戶名
  6. [ ] 實現登入狀態載入指示器
  7. [ ] 實現網絡錯誤提示

- **驗收標準:**
  - ✅ 支援 Google / GitHub / Email 三種登入方式
  - ✅ 社交登入按鈕點擊無反應時顯示錯誤
  - ✅ Email 登入表單驗證（有效的 email 格式）
  - ✅ 首次使用 Email 登入時自動創建帳戶

- **期望輸出:**
  - `lib/presentation/screens/login_screen.dart`
  - `lib/presentation/screens/onboarding_screen.dart`

---

### 2.3 書籤列表功能

- [ ] **目標:** 實現書籤列表顯示和管理**

#### 2.3.1 書籤列表 UI

- [ ] **子任務:** 建立書籤列表頁面
- **開發步驟:**
  1. [ ] 建立 `BookmarkListScreen` 頁面
  2. [ ] 實現書籤列表（支援清單視圖和網格視圖切換）
  3. [ ] 實現下拉刷新書籤列表
  4. [ ] 實現上拉加載更多（分頁）
  5. [ ] 實現書籤排序（時間/字母/自訂）
  6. [ ] 實現書籤篩選（狀態：全部/未讀/已讀/封存）
  7. [ ] 實現空狀態顯示

- **驗收標準:**
  - ✅ 書籤列表正確顯示所有書籤
  - ✅ 書籤圖片、標題、URL 正確顯示
  - ✅ 下拉刷新正確更新列表
  - ✅ 分頁滑動到底部自動加載下一頁
  - ✅ 空狀態顯示友好提示

- **期望輸出:**
  - `lib/presentation/screens/bookmark_list_screen.dart`
  - `lib/presentation/widgets/bookmark_card.dart`
  - `lib/presentation/widgets/bookmark_tile.dart`

#### 2.3.2 書籤詳情頁

- [ ] **子任務:** 建立書籤詳情頁面
- **開發步驟:**
  1. [ ] 建立 `BookmarkDetailScreen` 頁面
  2. [ ] 實現書籤完整資訊顯示（標題、URL、描述、標籤、圖片）
  3. [ ] 實現書籤編輯功能
  4. [ ] 實現「在瀏覽器開啟」按鈕
  5. [ ] 實現「分享書籤」功能（系統分享選單）
  6. [ ] 實現「刪除書籤」功能（帶確認對話框）

- **驗收標準:**
  - ✅ 點擊書籤正確打開詳情頁
  - ✅ 編輯書籤後正確保存並返回列表
  - ✅ 刪除書籤前顯示確認對話框
  - ✅ 刪除後顯示成功提示並返回列表

- **期望輸出:**
  - `lib/presentation/screens/bookmark_detail_screen.dart`

#### 2.3.3 書籤搜尋

- [ ] **子任務:** 實現書籤搜尋功能
- **開發步驟:**
  1. [ ] 建立 `SearchScreen` 頁面
  2. [ ] 實現搜尋框（自動聚焦、清除按鈕）
  3. [ ] 實現即時搜尋（debounce 300ms）
  4. [ ] 實現搜尋歷史記錄（本地存儲最近 10 筆）
  5. [ ] 實現熱門搜尋推薦
  6. [ ] 實現無搜尋結果頁面

- **驗收標準:**
  - ✅ 搜尋書籤標題/URL/描述/標籤正確匹配
  - ✅ 搜尋結果即時更新
  - ✅ 搜尋歷史可清除
  - ✅ 無結果時顯示建議

- **期望輸出:**
  - `lib/presentation/screens/search_screen.dart`

---

### 2.4 新增書籤功能

- [ ] **目標:** 實現書籤新增功能**

#### 2.4.1 URL 輸入新增

- [ ] **子任務:** 實現 URL 輸入新增書籤
- **開發步驟:**
  1. [ ] 建立 `AddBookmarkScreen` 頁面
  2. [ ] 實現 URL 輸入框（自動識別 URL 格式）
  3. [ ] 實現書籤 metadata 抓取（標題、描述、OG 圖）
  4. [ ] 實現 metadata 顯示預覽
  5. [ ] 實現目標集合選擇器
  6. [ ] 實現標籤選擇/新增
  7. [ ] 實現儲存按鈕（禁用雙擊）

- **驗收標準:**
  - ✅ 輸入 URL 後自動抓取 metadata（loading 指示器）
  - ✅ 抓取失敗時顯示手動輸入標題/描述選項
  - ✅ 選擇集合後正確保存
  - ✅ 儲存成功後返回書籤列表並顯示新書籤

- **期望輸出:**
  - `lib/presentation/screens/add_bookmark_screen.dart`

#### 2.4.2 Clipboard URL 檢測

- [ ] **子任務:** 實現剪貼簿 URL 檢測
- **開發步驟:**
  1. [ ] 在 App 啟動時檢測剪貼簿內容
  2. [ ] 如果是 URL，顯示「檢測到 URL，是否儲存？」提示
  3. [ ] 實現提示卡片 UI（可滑動關閉）
  4. [ ] 用戶點擊後跳轉到新增書籤頁並預填 URL
  5. [ ] 實現用戶偏好開關（可在設定中關閉此功能）

- **驗收標準:**
  - ✅ App 回到前台時重新檢測剪貼簿
  - ✅ 提示使用者選擇「儲存」或「略過」
  - ✅ 略過後不再提示直到新的 URL

- **期望輸出:**
  - `lib/presentation/widgets/clipboard_url_detector.dart`

#### 2.4.3 QR Code 掃描新增

- [ ] **子任務:** 實現 QR Code 掃描新增書籤
- **開發步驟:**
  1. [ ] 添加 `mobile_scanner` 依賴
  2. [ ] 建立 `ScanQRBookmarkScreen` 頁面
  3. [ ] 實現相機權限請求
  4. [ ] 實現 QR Code 掃描和識別
  5. [ ] 識別到 URL 後跳轉到新增書籤頁

- **驗收標準:**
  - ✅ 第一次使用時請求相機權限
  - ✅ 拒絕權限時顯示說明引導用戶去設定開啟
  - ✅ 掃描成功後自動跳轉

- **期望輸出:**
  - `lib/presentation/screens/scan_qr_bookmark_screen.dart`

---

### 2.5 組織架構功能

- [ ] **目標:** 實現組織/空間/集合管理**

#### 2.5.1 組織列表

- [ ] **子任務:** 實現組織列表頁面
- **開發步驟:**
  1. [ ] 建立 `OrganizationListScreen` 頁面
  2. [ ] 實現組織卡片顯示（名稱、成員數、圖示）
  3. [ ] 實現建立新組織按鈕
  4. [ ] 實現組織詳情頁面入口
  5. [ ] 實現公開組織探索功能

- **驗收標準:**
  - ✅ 正確顯示用戶所有組織
  - ✅ 點擊進入組織詳情
  - ✅ 建立組織後正確出現在列表

- **期望輸出:**
  - `lib/presentation/screens/organization_list_screen.dart`

#### 2.5.2 組織詳情

- [ ] **子任務:** 實現組織詳情頁面
- **開發步驟:**
  1. [ ] 建立 `OrganizationDetailScreen` 頁面
  2. [ ] 實現空間列表顯示
  3. [ ] 實現成員管理入口
  4. [ ] 實現組織設定入口（僅管理員/擁有者）
  5. [ ] 實現「複製邀請連結」功能

- **驗收標準:**
  - ✅ 正確顯示組織所有空間
  - ✅ 非成員無法看到組織詳情（權限控制）
  - ✅ 邀請連結可正常複製

- **期望輸出:**
  - `lib/presentation/screens/organization_detail_screen.dart`

#### 2.5.3 成員管理

- [ ] **子任務:** 實現成員管理頁面
- **開發步驟:**
  1. [ ] 建立 `MemberManagementScreen` 頁面
  2. [ ] 實現成員列表顯示（頭像、名稱、角色）
  3. [ ] 實現角色變更（Owner -> Admin -> Editor -> Viewer）
  4. [ ] 實現成員移除（需確認）
  5. [ ] 實現邀請新成員（輸入 Email）

- **驗收標準:**
  - ✅ 成員列表正確顯示
  - ✅ 角色變更後即時更新
  - ✅ 移除成員後該成員無法再訪問組織
  - ✅ 邀請 Email 格式驗證

- **期望輸出:**
  - `lib/presentation/screens/member_management_screen.dart`

---

### 2.6 同步功能

- [ ] **目標:** 實現本地與伺服器同步**

#### 2.6.1 同步引擎

- [ ] **子任務:** 實現離線優先同步引擎
- **開發步驟:**
  1. [ ] 建立 `SyncEngine` 類
  2. [ ] 實現 `sync()` 方法（觸發同步）
  3. [ ] 實現 `resolveConflicts()` LWW（Last-Write-Wins）衝突處理
  4. [ ] 實現同步佇列管理（離線操作排隊）
  5. [ ] 實現同步鎖（避免同時多個同步）
  6. [ ] 實現 `watchSyncStatus()` 同步狀態監聽

- **驗收標準:**
  - ✅ 離線添加書籤，恢復網絡後自動同步
  - ✅ 同步衝突時自動使用 LWW 策略
  - ✅ 同步中顯示進度指示器
  - ✅ 同步失敗顯示錯誤並可重試

- **期望輸出:**
  - `lib/core/sync/sync_engine.dart`

#### 2.6.2 背景同步

- [ ] **子任務:** 實現背景同步
- **開發步驟:**
  1. [ ] 實現 `workmanager` 背景任務配置
  2. [ ] 實現每 15 分鐘自動同步
  3. [ ] 實現 App 回到前台時同步
  4. [ ] 實現電量優化（休眠狀態不同步）

- **驗收標準:**
  - ✅ App 在背景時也會定期同步
  - ✅ 關閉 App 再打開後資料已同步
  - ✅ 電量低於 20% 時不執行背景同步

- **期望輸出:**
  - `lib/core/sync/background_sync.dart`

#### 2.6.3 衝突解決 UI

- [ ] **子任務:** 實現衝突解決介面
- **開發步驟:**
  1. [ ] 建立 `ConflictResolutionDialog` 對話框
  2. [ ] 實現衝突書籤並排顯示（本地 vs 伺服器）
  3. [ ] 實現「保留本地」「保留伺服器」「合併」選項
  4. [ ] 實現合併編輯功能
  5. [ ] 實現「全部保留本地」「全部保留伺服器」批量選項

- **驗收標準:**
  - ✅ 衝突發生時正確提示用戶
  - ✅ 用戶可選擇解決策略
  - ✅ 解決後正確同步

- **期望輸出:**
  - `lib/presentation/widgets/conflict_resolution_dialog.dart`

---

### 2.7 設定頁面

- [ ] **目標:** 實現設定頁面**

#### 2.7.1 設定首頁

- [ ] **子任務:** 實現設定首頁
- **開發步驟:**
  1. [ ] 建立 `SettingsScreen` 頁面
  2. [ ] 實現個人資料卡片（頭像、名稱、Email）
  3. [ ] 實現各設定分類入口
  4. [ ] 實現「關於」頁面入口
  5. [ ] 實現「登出」按鈕

- **驗收標準:**
  - ✅ 正確顯示當前用戶資訊
  - ✅ 點擊各入口正確跳轉
  - ✅ 登出後正確清除本地資料並返回登入頁

- **期望輸出:**
  - `lib/presentation/screens/settings_screen.dart`

#### 2.7.2 外觀設定

- [ ] **子任務:** 實現外觀設定
- **開發步驟:**
  1. [ ] 建立 `AppearanceSettingsScreen` 頁面
  2. [ ] 實現主題切換（亮色/暗色/系統）
  3. [ ] 實現主題即時預覽
  4. [ ] 實現書籤列表檢視切換（清單/網格）

- **驗收標準:**
  - ✅ 主題切換立即生效
  - ✅ 設定正確保存到本地

- **期望輸出:**
  - `lib/presentation/screens/appearance_settings_screen.dart`

#### 2.7.3 同步設定

- [ ] **子任務:** 實現同步設定
- **開發步驟:**
  1. [ ] 建立 `SyncSettingsScreen` 頁面
  2. [ ] 實現「最後同步時間」顯示
  3. [ ] 實現「立即同步」按鈕
  4. [ ] 實現「Wi-Fi 專用同步」開關
  5. [ ] 實現「背景同步」開關

- **驗收標準:**
  - ✅ 最後同步時間正確顯示
  - ✅ 立即同步按鈕觸發同步
  - ✅ Wi-Fi 專用時行動網絡不同步

- **期望輸出:**
  - `lib/presentation/screens/sync_settings_screen.dart`

---

### 2.8 構建與發布

- [ ] **目標:** 完成 iOS/Android 構建**

#### 2.8.1 Android 構建

- [ ] **子任務:** 完成 Android APK 構建
- **開發步驟:**
  1. [ ] 配置 `android/app/build.gradle`（minSdkVersion、targetSdkVersion）
  2. [ ] 配置 ProGuard（R8 混淆）
  3. [ ] 生成 keystore 並配置 signing
  4. [ ] 執行 `flutter build apk --release`
  5. [ ] 驗證 APK 可正常安裝和運行

- **驗收標準:**
  - ✅ `flutter build apk --release` 成功
  - ✅ APK 可在 Android 10+ 設備正常安裝
  - ✅ APK 大小合理（< 50MB）

- **期望輸出:**
  - `build/app/outputs/flutter-apk/app-release.apk`

#### 2.8.2 iOS 構建

- [ ] **子任務:** 完成 iOS App 構建
- **開發步驟:**
  1. [ ] 配置 `ios/Runner/Info.plist`（Bundle ID、版本）
  2. [ ] 配置 Code Signing（Development / Distribution）
  3. [ ] 執行 `flutter build ios --release --no-codesign`
  4. [ ] 驗證 Xcode 專案可正常 Archive

- **驗收標準:**
  - ✅ `flutter build ios --release` 成功
  - ✅ Xcode Archive 成功
  - ✅ App 可提交至 App Store Connect

- **期望輸出:**
  - `build/ios/iphoneos/Runner.app`

---

## 3. 驗證標準

- [ ] `flutter analyze` 無錯誤
- [ ] `flutter test` 全部通過
- [ ] iOS 構建成功
- [ ] Android 構建成功

---

## 4. 相依性

```
Task 2.1 (Drift Database)
    │
    ├── 2.1.1 Database Schema
    │        └── 2.1.2 DAO 封裝
    │                 │
    └── Task 2.2 (認證) ── 2.2.1 Logto 整合 ── 2.2.2 登入 UI
              │
Task 2.3 (書籤列表) ── 2.3.1 列表 UI ── 2.3.2 詳情頁 ── 2.3.3 搜尋
              │
Task 2.4 (新增書籤) ── 2.4.1 URL 新增 ── 2.4.2 Clipboard ── 2.4.3 QR
              │
Task 2.5 (組織功能) ── 2.5.1 列表 ── 2.5.2 詳情 ── 2.5.3 成員管理
              │
Task 2.6 (同步) ── 2.6.1 引擎 ── 2.6.2 背景同步 ── 2.6.3 衝突 UI
              │
Task 2.7 (設定) ── 2.7.1 首頁 ── 2.7.2 外觀 ── 2.7.3 同步
              │
Task 2.8 (構建發布) ── 2.8.1 Android ── 2.8.2 iOS
```

---

## 5. 文檔更新記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-01-28 | v1.0 | 初始版本 |
| 2025-01-30 | v1.1 | 全面細化每個子任務，增加驗收標準和 DAO 層設計 |
