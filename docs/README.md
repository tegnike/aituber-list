# AITuber List ドキュメント

このディレクトリには、AITuber Listの開発ドキュメントが含まれています。

---

## アップデート計画

アップデート計画は優先度と難易度に基づいて以下のドキュメントに分割されています。

| ドキュメント | 内容 | 難易度 | 優先度 |
|-------------|------|--------|--------|
| [Quick Fixes](./updates/quick-fixes.md) | 非推奨アイコン修正、説明文検索、リセットボタン | 低 | 高 |
| [Component Refactoring](./updates/component-refactoring.md) | コンポーネント分割、国際化拡張 | 中 | 中 |
| [Performance](./updates/performance.md) | バーチャルスクロール、画像最適化 | 中 | 低 |

---

## 実装の進め方

1. **Quick Fixes** から始める（即時対応可能）
2. **Component Refactoring** で保守性を改善
3. **Performance** は必要に応じて対応

---

## 注意事項

- **後方互換性**: URLパラメータの形式は変更しない
- **LocalStorage**: キー名は変更しない
- **SEO**: メタデータ、JSON-LDは既存のまま維持
- **パフォーマンス**: Lighthouse スコアを現状以上に維持
