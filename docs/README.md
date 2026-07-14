# 小新 (Xiaoxin) - 文檔目錄

## 文檔結構

```
docs/
├── README.md           # 本文件 - 文檔總覽
├── SPEC.md            # 專案規格文檔（整合所有規格）
└── tasks/             # Phase Task Lists
    └── 2025-01-20_phase-1-infrastructure.md
```

## 快速導覽

| 文檔 | 內容 |
|------|------|
| **SPEC.md** | 完整的專案規格，包含技術棧、功能、資料模型、API 設計、開發規則、階段規劃 |
| **tasks/*.md** | 各 Phase 的詳細執行計劃（Task List） |

## 專案概覽

小新是一個書籤管理平台，類似 Toby，支援：

- 📱 **多平台**：Web (Next.js)、Mobile (Flutter)、瀏覽器擴充 (WXT)
- 🔐 **認證**：Logto (Email/Password + OAuth)
- 📊 **組織架構**：Organization > Space > Collection > Bookmark
- 🔄 **同步**：WebSocket 即時同步 + 移動端離線優先
- 🌐 **分享**：4 層級分享 + 4 種角色
- 🔔 **通知**：站內/Email/推播
- 📥 **匯入/匯出**：HTML、JSON、CSV、RSS

## 開發規則

遵循 AGENTS.md 中的規則：

1. **BDD/TDD**：先寫測試，再實作
2. **Code Review**：每次完成後運行 `/code-review max --fix`
3. **Task List**：每個任務寫在 `docs/tasks/` 目錄
4. **80% Coverage**：測試覆蓋率達 80%
5. **pnpm**：Node.js 套件管理

詳細規則請見 [SPEC.md](./SPEC.md#5-開發規則遵循-agentsmd)

## 開始開發

1. 閱讀 [SPEC.md](./SPEC.md) 了解完整規格
2. 查看 [Phase 1 Task List](./tasks/2025-01-20_phase-1-infrastructure.md)
3. 開始執行

---

*最後更新：2025-01-20*
