# 瀏覽器擴充套件開發任務清單

**建立日期:** 2025-01-25  
**更新日期:** 2025-01-25  
**任務類型:** Phase 4 - 瀏覽器擴充套件

---

## 任務概述

本次任務旨在建置 Xiaoxin 專案的瀏覽器擴充套件，支援 Chrome、Firefox、Safari、Edge。

---

## Task List

### Task 4.1: WXT 專案初始化與設定 ✅
- [x] **目標:** 確認 WXT 擴充套件專案設定正確
- [x] **驗證方式:** `pnpm --filter @xiaoxin/extension build` 成功
- [x] **期望輸出:** WXT 專案可正常運行

### Task 4.2: Popup 介面 ✅
- [x] **目標:** 建立擴充套件 Popup 彈出視窗
- [x] **驗證方式:** `PopupApp.tsx` 已建立
- [x] **期望輸出:** Popup 功能完成

### Task 4.3: Sidebar 側邊欄 ✅
- [x] **目標:** 建立 Sidebar 側邊欄介面
- [x] **驗證方式:** `SidebarApp.tsx` 已建立
- [x] **期望輸出:** Sidebar 功能完成

### Task 4.4: Background Script ✅
- [x] **目標:** 建立 Background Service Worker
- [x] **驗證方式:** `background.ts` 已建立
- [x] **期望輸出:** Background 功能完成

### Task 4.5: Bookmarklet 一鍵保存 ⏳
- [ ] **目標:** 建立 Bookmarklet 書籤工具
- [ ] **待完成:** 生成 bookmarklet script

## 已完成 Entrypoints

- ✅ `popup.html` + `PopupApp.tsx` - Popup 介面
- ✅ `sidepanel.html` + `SidebarApp.tsx` - Sidebar 側邊欄
- ✅ `background.ts` - Background Service Worker

---

## Entrypoints 結構

```
apps/extension/entrypoints/
├── popup/           # Popup 彈出視窗
├── sidebar/         # Sidebar 側邊欄
├── background.ts     # Background Service Worker
└── content.ts       # Content Script
```

---

## 相依性

```
Task 4.1 (WXT 設定)
    ├── Task 4.2 (Popup)
    └── Task 4.3 (Sidebar)
         │
         ├── Task 4.4 (Background)
         └── Task 4.5 (Bookmarklet)
```

---

## 下一步

完成瀏覽器擴充套件後，將進入：
- Phase 5: 移動端 App
- Phase 6: 進階功能（通知系統、分享功能）
