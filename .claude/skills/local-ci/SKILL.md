---
name: local-ci
description: remote CI (GitHub Actions) 相当のチェックをローカルで実行。Biome check、テスト、ビルドを並列実行し、全てのチェックが成功したことを確認する。PR作成前の事前チェックに使用。
user-invocable: true
---

# Local CI スキル

**このスキルの役割**: remote CI (GitHub Actions) 相当のチェックを**ローカルマシン上**で実行するスキル。

## 実行手順

1. 開始メッセージを表示
2. 3つの sub agent（biome-check、test-check、build-check）を**並列起動**
3. 各 sub agent の出力を取得
4. 結果を集計してサマリーを表示

## 使い方

```bash
/local-ci
```

このコマンドを実行すると、3つのチェック（Biome check、Test、Build）が並列実行されます。
