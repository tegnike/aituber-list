# Performance Improvements（長期対応）

**難易度**: 中 | **優先度**: 低

このドキュメントは、パフォーマンス改善についてまとめています。

---

## 1. バーチャルスクロールの導入

### 目的
AITuber数が増加した際のレンダリングパフォーマンスを確保する。

### 推奨ライブラリ
- `@tanstack/react-virtual` (軽量、React 18対応)
- `react-virtuoso` (高機能、グリッド対応)

### 導入基準
- 現在260件 → 500件以上になった場合に本格導入を検討
- 現状はインフィニティスクロールで十分だが、将来に備えて準備

### 実装例（react-virtuoso）
```tsx
import { VirtuosoGrid } from 'react-virtuoso'

<VirtuosoGrid
  totalCount={sortedAITubers.length}
  itemContent={(index) => <AituberCard aituber={sortedAITubers[index]} />}
  listClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
/>
```

---

## 2. 画像最適化

### 現状の問題
- YouTube CDNの画像を直接使用している
- 一部のローカル画像は`/images/aitubers/`から読み込み

### 改善案

#### 2.1 Next.js Image最適化の活用強化
- `next.config.mjs`でYouTube CDNドメインを設定済み
- `priority`属性を最初の12件（1ページ目）に追加

#### 2.2 サムネイルサイズの最適化
- 現在: `hqdefault.jpg` (480x360)
- リスト表示では`mqdefault.jpg` (320x180)を使用して軽量化

```tsx
// サムネイルURL変換関数
const getOptimizedThumbnail = (url: string, size: 'hq' | 'mq' = 'hq') => {
  if (size === 'mq') {
    return url.replace('hqdefault', 'mqdefault')
  }
  return url
}
```

---

## 実装優先順位

| 順番 | 項目 | 工数目安 |
|------|------|----------|
| 1 | 画像最適化 | 小 |
| 2 | バーチャルスクロール準備 | 中 |

---

## テスト項目

- [ ] Lighthouse スコアを現状以上に維持（ブラウザで確認が必要）
- [x] 画像が正しく読み込まれること
- [x] スクロールパフォーマンスが維持されていること

## 実装完了内容

### 画像最適化（2024年実装済み）

1. **priority属性の追加**
   - `AITuberImage`コンポーネントにpriority属性を追加
   - `AituberCard`、`AituberListItem`経由で最初の12件に適用
   - LCP（Largest Contentful Paint）の改善に寄与

2. **サムネイルクリック式への変更**
   - `LazyVideo`をサムネイル表示 → クリックでiframe読み込みに変更
   - `mqdefault.jpg`（320x180）を使用して軽量化
   - iframeの遅延読み込みにより初期ロード時間を大幅改善

---

## 参考リンク

- [TanStack Virtual](https://tanstack.com/virtual/latest)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [lucide-react Icons](https://lucide.dev/icons/)
