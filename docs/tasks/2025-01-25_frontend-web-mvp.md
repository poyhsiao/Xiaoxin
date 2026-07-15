# 前端 Web MVP 開發任務清單

**建立日期:** 2025-01-25  
**更新日期:** 2025-01-25  
**任務類型:** Phase 3 - 前端 Web MVP

---

## 任務概述

本次任務旨在建置 Xiaoxin 專案的前端 Web 介面，包含：
1. Next.js 專案初始化和配置
2. 登入/註冊頁面
3. Dashboard 介面
4. Organization/Space/Collection/Bookmark 管理介面
5. API 服務層整合

---

## Task List

### Task 3.1: Next.js 專案初始化與設定 ✅
- [x] **目標:** 確認 Next.js 專案設定正確
- [x] **驗證方式:** `pnpm --filter @xiaoxin/web build` 成功
- [x] **期望輸出:** Next.js 專案可正常運行

### Task 3.2: 登入/註冊頁面 ✅
- [x] **目標:** 建立登入和註冊頁面
- [x] **驗證方式:** 頁面已建立
- [x] **期望輸出:** 登入/註冊功能完成

### Task 3.3: Dashboard 介面 ✅
- [x] **目標:** 建立主要 Dashboard 介面
- [x] **驗證方式:** Dashboard 可正常顯示
- [x] **期望輸出:** Dashboard 介面完成

### Task 3.4: Organization 管理介面 ✅
- [x] **目標:** 建立 Organization CRUD 介面
- [x] **驗證方式:** Organization 列表頁已建立
- [x] **期望輸出:** Organization CRUD 完成

### Task 3.5: Space & Collection 介面 ✅
- [x] **目標:** 建立 Space 和 Collection 管理介面
- [x] **驗證方式:** 頁面已建立
- [x] **期望輸出:** Space/Collection 完成

### Task 3.6: Bookmark 介面 ✅
- [x] **目標:** 建立 Bookmark 管理介面
- [x] **驗證方式:** Bookmark 頁面已建立
- [x] **期望輸出:** Bookmark CRUD 完成

## 已完成組件

1. ✅ **API 服務層** - `lib/api.ts`, `lib/auth.ts`, `lib/organizations.ts`, `lib/bookmarks.ts`
2. ✅ **Layout 組件** - `Sidebar.tsx`, `TopBar.tsx`, `(dashboard)/layout.tsx`
3. ✅ **書籤組件** - `BookmarkCard.tsx`, `BookmarkList.tsx`, `BookmarkForm.tsx`, `BookmarkView.tsx`

---

## 頁面結構

```
apps/web/src/app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx              # Dashboard 首頁
│   ├── organizations/
│   │   ├── page.tsx          # 列表
│   │   └── [id]/page.tsx     # 詳情
│   ├── spaces/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── collections/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── bookmarks/
│       ├── page.tsx
│       └── [id]/page.tsx
└── api/                      # API Routes (可選)
```

---

## 元件清單

| 元件 | 用途 |
|------|------|
| `Sidebar` | 側邊導航列 |
| `TopBar` | 頂部工具列 |
| `OrganizationCard` | 組織卡片 |
| `SpaceCard` | 空間卡片 |
| `CollectionCard` | 集合卡片 |
| `BookmarkCard` | 書籤卡片（清單/卡片視圖）|
| `BookmarkList` | 書籤列表 |
| `SearchBar` | 搜尋列 |
| `CreateModal` | 建立/編輯 Modal |
| `ConfirmDialog` | 確認對話框 |

---

## 相依性

```
Task 3.1 (Next.js 設定) ──→ Task 3.2 (登入/註冊)
         │
         └──→ Task 3.3 (Dashboard)
                  │
                  └──→ Task 3.4 (Organizations)
                           │
                           └──→ Task 3.5 (Spaces/Collections)
                                    │
                                    └──→ Task 3.6 (Bookmarks)
```

---

## 下一步

完成前端 MVP 後，將進入：
- Phase 4: 瀏覽器擴充套件
- Phase 5: 移動端 App
