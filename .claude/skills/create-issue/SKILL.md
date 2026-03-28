---
name: create-issue
description: GitHub Project に draft item を作成する。ユーザーの要望からタイトル・概要を構成し、パイプラインに乗せる。「Issue 作ろう」「機能追加したい」「バグ見つけた」といった場面で使用。
user-invocable: true
---

# Issue 作成スキル

ユーザーの要望を聞き取り、GitHub Project（KeyViz #6）に draft item を作成します。
draft は `issue-enrichment` で実 Issue に変換され、`tdd-next` で実装されます。

## GitHub Project 情報

- **Project**: `shiroinock` owner, number `6`（KeyViz）

## 実行フロー

### 1. ヒアリング

ユーザーが何をしたいかを確認します。以下を把握する:
- **何をしたいか**（概要）
- **種別**: 機能追加か バグ修正か

ユーザーが十分な情報を既に伝えている場合は、確認なしで次へ進んでよい。

### 2. Draft 本文の構成

種別に応じたフォーマットで本文を組み立てます。

**機能追加の場合**:
```markdown
## 概要
{1-2文の説明}

## やること
- {タスク1}
- {タスク2}
（具体的なタスクが不明な場合は省略 — issue-enrichment で補完される）

## 関連
{関連する既存コード・Issue 等があれば}
```

**バグ報告の場合**:
```markdown
## 概要
{何が起きているか}

## 再現手順
1. {手順1}
2. {手順2}

## 期待される動作
{本来どうあるべきか}
```

### 3. Draft item 作成

```bash
gh project item-create 6 --owner shiroinock \
  --title "{タイトル}" \
  --body "{本文}"
```

### 4. 報告と次のアクション提案

作成した draft の情報を報告し、以下を提案:
- 「続けて `/issue-enrichment` で詳細化しますか？」
- 複数 draft を作成する場合は繰り返し実行

## 注意事項

- この段階では GitHub Issue は作成しない（draft item のみ）
- 実 Issue への変換は `issue-enrichment` が行う
- タイトルは簡潔に（30文字程度を目安）
- 概要は `issue-enrichment` が拡充するので、最小限でよい
