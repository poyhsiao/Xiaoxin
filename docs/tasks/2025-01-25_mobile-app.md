# 移動端 App 開發任務清單

**建立日期:** 2025-01-25  
**更新日期:** 2025-01-25  
**任務類型:** Phase 5 - 移動端 App

---

## 任務概述

本次任務旨在建置 Xiaoxin 專案的 Flutter 移動端應用（iOS/Android）。

---

## Task List

### Task 5.1: Flutter 專案初始化 ✅
- [x] **目標:** 確認 Flutter 專案設定正確
- [x] **驗證方式:** `flutter pub get` 成功
- [x] **期望輸出:** Flutter 專案可正常運行

### Task 5.2: 登入/註冊介面 ⏳
- [ ] **目標:** 建立登入和註冊頁面
- [ ] **待完成:** 登入頁面

### Task 5.3: 書籤列表介面 ⏳
- [ ] **目標:** 建立書籤列表頁面
- [ ] **待完成:** 書籤列表 UI

### Task 5.4: 書籤同步功能 ⏳
- [ ] **目標:** 建立書籤同步機制
- [ ] **待完成:** Drift 程式碼生成

## 已完成結構

- ✅ `core/api/api_client.dart` - Dio API 客戶端
- ✅ `core/db/database.dart` - Drift 資料庫
- ✅ `domain/models/bookmark.dart` - Bookmark 模型
- ✅ `domain/services/bookmark_service.dart` - 書籤服務
- ✅ `app.dart` - go_router 路由設定

---

## 技術架構

```
apps/mobile/lib/
├── core/           # 核心功能
│   ├── api/        # API 客戶端
│   ├── db/         # Drift 資料庫
│   └── sync/       # 同步邏輯
├── domain/         # 業務邏輯
│   ├── models/     # 資料模型
│   └── services/   # 服務層
└── presentation/   # UI 層
    ├── screens/    # 頁面
    └── widgets/    # 組件
```

---

## 相依性

```
Task 5.1 (Flutter 設定)
    ├── Task 5.2 (登入/註冊)
    └── Task 5.3 (書籤列表)
         └── Task 5.4 (同步功能)
```

---

## 下一步

完成移動端 App 後，將進入：
- Phase 6: 進階功能（通知系統、分享功能、匯入/匯出）
