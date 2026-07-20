# 瀏覽器擴充核心任務清單

**建立日期:** 2025-01-28  
**更新日期:** 2025-01-30  
**任務類型:** Phase 5 - 瀏覽器擴充  
**優先級:** P0

---

## 1. 任務概述

實現瀏覽器擴充的核心書籤功能。

---

## 2. Task List

### 2.1 Popup UI - 書籤列表 ✅

- [x] **目標:** 完成書籤列表顯示**
- **開發步驟:**
  1. [x] 設計 Popup 佈局
  2. [x] 實現書籤列表渲染
  3. [x] 實現書籤搜尋
  4. [x] 實現集合選擇器
  5. [x] 實現書籤點擊開啟

- **驗證方式:** 
  - Popup 可正常開啟
  - 書籤列表正確顯示

- **期望輸出:**
  - `entrypoints/PopupApp.tsx` ✅
  - `src/lib/api.ts` ✅
  - `src/lib/metadata.ts` ✅

---

### 2.2 書籤快速新增 ✅

- [x] **目標:** 實現一鍵儲存書籤**

- **開發步驟:**
  1. [x] 實現 content script 注入
  2. [x] 抓取當前頁面 metadata
  3. [x] 實現快速選擇目標集合
  4. [x] 實現保存成功/失敗提示

- **驗證方式:**
  - 點擊擴充圖標可保存當前頁面
  - metadata 正確抓取

- **期望輸出:**
  - `entrypoints/SidebarApp.tsx` ✅
  - `src/content.ts` ✅

---

### 2.3 Bookmarklet 書籤工具

- [ ] **目標:** 實現 Bookmarklet 一鍵保存**

- **開發步驟:**
  1. [ ] 建立 bookmarklet URL 生成腳本
  2. [ ] 實現便攜式 bookmarklet HTML 頁面
  3. [ ] 實現 URL 编码的安全處理
  4. [ ] 實現跨瀏覽器相容性測試

- **驗收標準:**
  - ✅ Bookmarklet 點擊後彈出書籤保存確認視窗
  - ✅ 支援 Chrome、Firefox、Safari、Edge
  - ✅ URL 超过 2000 字元時使用 POST 方式
  - ✅ Bookmarklet 工具頁面可在任何設備上存取

- **期望輸出:**
  - `src/bookmarklet.ts` - bookmarklet 生成腳本
  - `bookmarklet.html` - 可嵌入的 bookmarklet 頁面

---

### 2.4 快捷鍵設定

- [ ] **目標:** 實現自訂快捷鍵功能**

- **開發步驟:**
  1. [ ] 建立快捷鍵設定頁面（options page）
  2. [ ] 實現快捷鍵錄製功能
  3. [ ] 實現快捷鍵衝突檢測（與系統/瀏覽器快捷鍵衝突）
  4. [ ] 實現快捷鍵本地存儲和同步
  5. [ ] 實現預設快捷鍵建議（Alt+Shift+B / Ctrl+Shift+B）

- **驗收標準:**
  - ✅ 使用者可自訂快捷鍵（支援 Modifier + Key 組合）
  - ✅ 衝突時顯示警告提示
  - ✅ 快捷鍵設定在不同設備間同步
  - ✅ 預設快捷鍵在所有支援瀏覽器可用

- **期望輸出:**
  - `entrypoints/OptionsApp.tsx` - 設定頁面
  - `src/lib/shortcuts.ts` - 快捷鍵管理

---

### 2.5 書籤同步管理

- [ ] **目標:** 實現書籤的本地緩存和同步**

- **開發步驟:**
  1. [ ] 實現 IndexedDB 本地書籤緩存
  2. [ ] 實現書籤同步鎖機制（避免衝突）
  3. [ ] 實現離線書籤保存佇列
  4. [ ] 實現網絡恢復後自動同步
  5. [ ] 實現同步狀態指示器（同步中/已同步/離線）

- **驗收標準:**
  - ✅ 離線時可正常添加書籤到本地佇列
  - ✅ 網絡恢復後自動同步，無需手動操作
  - ✅ 多人同時編輯同一書籤時有衝突提示
  - ✅ 同步狀態正確顯示

- **期望輸出:**
  - `src/lib/sync.ts` - 同步管理模組
  - `src/lib/db.ts` - IndexedDB 操作封裝

---

### 2.6 側邊欄書籤編輯

- [ ] **目標:** 實現側邊欄書籤編輯功能**

- **開發步驟:**
  1. [ ] 實現側邊欄書籤列表編輯模式
  2. [ ] 實現書籤標題、URL、描述編輯
  3. [ ] 實現書籤標籤編輯（新增/移除）
  4. [ ] 實現書籤刪除（支援還原）
  5. [ ] 實現書籤移動到其他集合

- **驗收標準:**
  - ✅ 可在側邊欄直接編輯書籤所有欄位
  - ✅ 編輯時即時保存（debounce 500ms）
  - ✅ 刪除後 10 秒內可點擊還原
  - ✅ 書籤移動後清單正確更新

- **期望輸出:**
  - `components/BookmarkEditPanel.tsx`
  - `components/TagEditor.tsx`

---

### 2.7 多語言支援 (i18n)

- [ ] **目標:** 實現擴充多語言支援**

- **開發步驟:**
  1. [ ] 建立 i18n 翻譯檔案結構（en / zh-TW / zh-CN）
  2. [ ] 實作 _locales 目錄和 messages.json
  3. [ ] 實作 Popup 和 Options 的動態語言切換
  4. [ ] 實作中文（繁/簡）的完整翻譯
  5. [ ] 實作語言自動偵測（根據瀏覽器設定）

- **驗收標準:**
  - ✅ 擴充根據瀏覽器語言自動切換顯示
  - ✅ 使用者可在 Options 頁面手動選擇語言
  - ✅ 所有 UI 文字都有翻譯（無 hardcoded 文字）
  - ✅ 翻譯檔案可輕鬆擴展新語言

- **期望輸出:**
  - `_locales/en/messages.json`
  - `_locales/zh-TW/messages.json`
  - `_locales/zh-CN/messages.json`
  - `src/lib/i18n.ts`

---

### 2.8 Chrome Web Store 發布

- [ ] **目標:** 完成 Chrome Web Store 發布準備**

- **開發步驟:**
  1. [ ] 建立擴充功能截圖（4-8 張）
  2. [ ] 撰寫擴充功能描述（50-300 字）
  3. [ ] 設計推廣圖示（16px / 48px / 128px）
  4. [ ] 填寫隱私權政策聲明
  5. [ ] 申請開發者帳號（如需要）
  6. [ ] 上傳 ZIP 檔案並填寫相關資訊
  7. [ ] 提交審核

- **驗收標準:**
  - ✅ 擴充截圖清晰展示主要功能
  - ✅ 描述文案包含關鍵字（bookmark、save、sync）
  - ✅ 圖示符合 Chrome Web Store 規範
  - ✅ 隱私權政策頁面可公開存取
  - ✅ 審核通過並上架

- **期望輸出:**
  - `assets/screenshots/` - 截圖檔案
  - `assets/icons/` - 各尺寸圖示
  - `privacy-policy.html` - 隱私權政策頁面

---

### 2.9 跨瀏覽器支援 (Firefox / Safari / Edge)

- [ ] **目標:** 實現跨瀏覽器支援**

- **開發步驟:**
  1. [ ] 使用 WXT 構建 Firefox 版本（`wxt build -b firefox`）
  2. [ ] 使用 WXT 構建 Safari 版本（`wxt build -b safari`）
  3. [ ] 使用 WXT 構建 Edge 版本（`wxt build -b edge`）
  4. [ ] 處理各瀏覽器 API 差異（如有）
  5. [ ] 提交 Firefox Add-ons 審核
  6. [ ] 提交 Microsoft Edge Add-ons 審核
  7. [ ] 提交 Safari Web Extensions 審核

- **驗收標準:**
  - ✅ 四個瀏覽器版本功能一致
  - ✅ 書籤同步在不同瀏覽器間正常運作
  - ✅ 各瀏覽器商店審核通過

- **期望輸出:**
  - `.output/firefox/` - Firefox 版本
  - `.output/safari/` - Safari 版本
  - `.output/edge/` - Edge 版本

---

## 3. 驗證標準

- [x] 可成功保存書籤
- [x] Popup 正常運作
- [ ] Bookmarklet 功能正常
- [ ] 快捷鍵設定完整
- [ ] 離線/同步功能正常
- [ ] 多語言支援完整
- [ ] 通過 Chrome Web Store 審核（最終）
- [ ] 跨瀏覽器支援完整

---

## 4. 相依性

```
Task 2.1 (Popup UI) ✅ ────┐
Task 2.2 (快速新增) ✅ ────┼── Task 2.5 (同步管理)
                            │
Bookmarklet 2.3 ────────────┼── Task 2.6 (編輯功能)
                            │
快捷鍵設定 2.4 ─────────────┼── Task 2.7 (i18n)
                            │
                     Task 2.8 (Chrome 發布)
                     Task 2.9 (跨瀏覽器)
```

---

## 5. 文檔更新記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-01-28 | v1.0 | 初始版本 |
| 2025-01-30 | v1.1 | 新增 Bookmarklet、快捷鍵、同步、編輯、i18n、發布任務 |
