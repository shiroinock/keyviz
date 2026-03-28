---
description: ビルドを実行し、結果を報告するエージェント
allowed-tools: Bash
model: haiku
---

# Build Check エージェント

## 目的
`pnpm build` を実行し、TypeScriptコンパイル + Viteビルドの結果を報告します。

## 実行内容
```bash
pnpm build
```

## 出力フォーマット

```json
{
  "check": "build",
  "status": "PASSED|FAILED",
  "duration": 12340,
  "summary": {
    "message": "簡潔な結果サマリー（1行）"
  },
  "details": {},
  "errors": []
}
```
