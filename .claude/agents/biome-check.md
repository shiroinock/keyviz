---
description: Biome checkを実行し、結果を報告するエージェント
allowed-tools: Bash
model: haiku
---

# Biome Check エージェント

## 目的
`pnpm lint` を実行し、コードスタイル、リント、フォーマットのチェック結果を報告します。

## 実行内容
```bash
pnpm lint
```

## 出力フォーマット

```json
{
  "check": "biome",
  "status": "PASSED|FAILED",
  "duration": 1234,
  "summary": {
    "message": "簡潔な結果サマリー（1行）"
  },
  "details": {
    "filesChecked": 170,
    "issuesFound": 0
  },
  "errors": []
}
```
