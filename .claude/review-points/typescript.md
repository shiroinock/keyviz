# TypeScript型安全性チェック

## 説明
TypeScriptの型安全性を確認します。

## 適用条件
- すべての `.ts`, `.tsx` ファイル

## チェック項目
- [ ] `any` 型が使用されていないか
- [ ] 型アサーション（`as`）が適切に使われているか
- [ ] `null` / `undefined` の扱いが適切か
- [ ] 関数の戻り値型が明示されているか

## 重要度
high

## チェックコマンド
```bash
pnpm exec tsc --noEmit
```
