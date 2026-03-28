---
name: review-perspective-selector
description: 実装ファイルの種別に応じて適切なレビュー観点を自動選択するスキル。
---

# Review Perspective Selector Skill

このskillは、実装ファイルの種別に応じて適切なレビュー観点デッキを自動選択します。

## ファイル分類と観点マッピング

### 1. ユーティリティ / データ定義
- `src/utils/*.ts`, `src/data/*.ts`
- 適用観点: `typescript.md`

### 2. React コンポーネント
- `src/components/**/*.tsx`
- 適用観点: `typescript.md`, `react-component.md`, `project-structure.md`

### 3. カスタムフック
- `src/hooks/*.ts`, `src/hooks/*.tsx`
- 適用観点: `typescript.md`, `react-component.md`

### 4. テストファイル
- `src/**/*.test.ts`, `src/**/*.test.tsx`
- 適用観点: `test-quality.md`, `typescript.md`, 対応する実装ファイルの観点を継承

### 5. 設定ファイル
- `vite.config.ts`, `tsconfig.json`, `package.json`, `biome.json`
- 適用観点: `project-structure.md`
