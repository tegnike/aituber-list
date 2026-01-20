# Quick Fixes（即時対応）

**難易度**: 低 | **優先度**: 高

このドキュメントは、すぐに実装できる小規模な修正項目をまとめています。

---

## 1. 非推奨アイコンの置き換え

### 問題
`lucide-react`の`Youtube`と`Twitter`アイコンが非推奨（deprecated）になっている。

### 影響箇所
| ファイル | 行番号 | 内容 |
|----------|--------|------|
| `components/aituber-list.tsx` | 7 | import文 |
| `components/aituber-list.tsx` | 845 | リスト表示のYouTubeリンク |
| `components/aituber-list.tsx` | 950 | グリッド表示のYouTubeボタン |
| `components/aituber-list.tsx` | 958 | グリッド表示のTwitterボタン |

### 対応方法
カスタムSVGアイコンコンポーネントを作成して置き換える。

```tsx
// components/icons/YoutubeIcon.tsx
export const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

// components/icons/XIcon.tsx (旧Twitter)
export const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
```

### 変更点
- `Youtube` → `YoutubeIcon`（カスタムSVG）
- `Twitter` → `XIcon`（カスタムSVG、Xロゴに更新）

---

## 2. 説明文検索の追加

### 現状
名前（`name`）のみで検索している（381行目）:
```tsx
(nameFilter === '' || aituber.name.toLowerCase().includes(nameFilter.toLowerCase()))
```

### 変更後
名前と説明文（`description`）の両方で検索:
```tsx
(nameFilter === '' ||
  aituber.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
  aituber.description.toLowerCase().includes(nameFilter.toLowerCase()))
```

### i18n対応
```typescript
// lib/i18n.ts に追加
'filter.searchByName': '名前・説明で検索',  // ja
'filter.searchByName': 'Search by name or description',  // en
'filter.searchPlaceholder': 'AITuber名または説明を入力...',  // ja
'filter.searchPlaceholder': 'Enter AITuber name or description...',  // en
```

---

## 3. フィルターリセットボタンの追加

### 実装場所
`FilterPanel`（またはフィルターセクション）のヘッダー部分

### UI設計
```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={resetAllFilters}
  disabled={activeFilterCount === 0}
>
  <RotateCcw className="w-4 h-4 mr-1" />
  {t('filter.reset')}
</Button>
```

### ロジック
```tsx
const resetAllFilters = () => {
  setSelectedTags([])
  setIsAndCondition(false)
  setSelectedDateFilter('all')
  setSelectedSubscriberFilter(null)
  setNameFilter('')
  setShowUpcomingOnly(false)
  setShowFavoritesOnly(false)
  setCurrentPage(1)
}
```

### i18n対応
```typescript
// lib/i18n.ts に追加
'filter.reset': 'リセット',  // ja
'filter.reset': 'Reset',  // en
```

---

## 実装優先順位

| 順番 | 項目 | 工数目安 |
|------|------|----------|
| 1 | 非推奨アイコン修正 | 小 |
| 2 | フィルターリセットボタン | 小 |
| 3 | 説明文検索 | 小 |

---

## テスト項目

- [ ] アイコンが正しく表示されること
- [ ] フィルターリセットが全項目をクリアすること
- [ ] 説明文での検索が機能すること
- [ ] ダークモードで表示が正しいこと
