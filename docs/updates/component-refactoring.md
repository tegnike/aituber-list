# Component Refactoring（中期対応）

**難易度**: 中 | **優先度**: 中

このドキュメントは、コンポーネント分割と国際化拡張についてまとめています。

---

## 1. コンポーネント分割

### 現状の問題
`aituber-list.tsx`が1,039行と肥大化しており、保守性が低下している。

### 分割計画

#### 1.1 新規ファイル構成
```
components/
├── aituber-list/
│   ├── index.tsx              # メインコンポーネント（エントリーポイント）
│   ├── AituberCard.tsx        # グリッド表示用カード
│   ├── AituberListItem.tsx    # リスト表示用アイテム
│   ├── FilterPanel.tsx        # フィルターパネル
│   ├── SortControls.tsx       # ソート・表示モード切替
│   ├── AITuberImage.tsx       # 画像コンポーネント（フォールバック付き）
│   ├── LazyVideo.tsx          # 遅延読み込み動画
│   └── types.ts               # 型定義
├── icons/
│   ├── YoutubeIcon.tsx
│   └── XIcon.tsx
└── ui/                        # 既存のshadcn/uiコンポーネント
```

#### 1.2 カスタムフック抽出
```
hooks/
├── useAituberFilters.ts       # フィルタリングロジック
├── useAituberSort.ts          # ソートロジック
├── useFavorites.ts            # お気に入り管理
├── useUrlState.ts             # URL同期ステート
└── useInfiniteScroll.ts       # インフィニティスクロール
```

#### 1.3 各ファイルの責務

| ファイル | 責務 | 行数目安 |
|----------|------|----------|
| `index.tsx` | 状態管理、レイアウト | ~200行 |
| `AituberCard.tsx` | グリッド表示のカード | ~120行 |
| `AituberListItem.tsx` | リスト表示のアイテム | ~80行 |
| `FilterPanel.tsx` | フィルターUI全体 | ~200行 |
| `SortControls.tsx` | ソート・表示モード | ~60行 |
| `AITuberImage.tsx` | 画像（現状維持） | ~50行 |
| `LazyVideo.tsx` | 動画遅延読み込み（現状維持） | ~50行 |
| `types.ts` | 型定義 | ~30行 |

---

## 2. 国際化拡張

### 追加言語
- 韓国語 (ko)
- 中国語簡体字 (zh-CN)
- 中国語繁体字 (zh-TW)

### 実装計画

#### 2.1 型定義の更新
```typescript
// lib/i18n.ts
export type Locale = 'ja' | 'en' | 'ko' | 'zh-CN' | 'zh-TW'
```

#### 2.2 翻訳ファイルの構造変更
現在の`lib/i18n.ts`を分割して管理しやすくする:

```
lib/
├── i18n/
│   ├── index.ts           # エクスポート、ユーティリティ関数
│   ├── types.ts           # 型定義
│   ├── ja.ts              # 日本語
│   ├── en.ts              # 英語
│   ├── ko.ts              # 韓国語
│   ├── zh-CN.ts           # 中国語簡体字
│   └── zh-TW.ts           # 中国語繁体字
```

#### 2.3 翻訳内容（韓国語例）
```typescript
// lib/i18n/ko.ts
export const ko = {
  'site.title': 'AITuberList',
  'site.count': '({count}명)',
  'site.lastUpdated': '최종 업데이트: {date}',
  'overview.title': '개요',
  'filter.title': '필터',
  'filter.searchByName': '이름으로 검색',
  // ... 以下省略
}
```

#### 2.4 言語切替UIの更新
現在のトグル（2言語）をドロップダウン（5言語）に変更:

```tsx
// components/ui/language-toggle.tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <Globe className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => setLocale('ja')}>日本語</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setLocale('en')}>English</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setLocale('ko')}>한국어</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setLocale('zh-CN')}>简体中文</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setLocale('zh-TW')}>繁體中文</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### 2.5 日付・数値フォーマットの対応
```typescript
// formatDate関数の拡張
const localeMap: Record<Locale, string> = {
  'ja': 'ja-JP',
  'en': 'en-US',
  'ko': 'ko-KR',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW'
}

// formatSubscriberCount関数の拡張
// 韓国語: 만 (万)
// 中国語: 万
```

---

## 実装優先順位

| 順番 | 項目 | 工数目安 |
|------|------|----------|
| 1 | コンポーネント分割 | 大 |
| 2 | カスタムフック抽出 | 中 |
| 3 | 国際化拡張（韓国語） | 中 |
| 4 | 国際化拡張（中国語） | 中 |

---

## テスト項目

- [ ] 各言語での表示が崩れないこと
- [ ] レスポンシブデザインが維持されていること
- [ ] URL同期が正しく機能すること
- [ ] お気に入り機能が正常に動作すること

---

## 注意事項

1. **後方互換性**: URLパラメータの形式は変更しない
2. **LocalStorage**: キー名（`aituber-favorites`, `aituber-view-mode`, `preferred-locale`）は変更しない
3. **SEO**: メタデータ、JSON-LDは既存のまま維持
