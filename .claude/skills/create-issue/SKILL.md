---
name: create-issue
description: GitHub Issue を作成する。ユーザーの要望からタイトル・概要を構成し、適切なラベルを付与してパイプラインに乗せる。「Issue 作ろう」「機能追加したい」「バグ見つけた」といった場面で使用。
user-invocable: true
---

# Issue 作成スキル

ユーザーの要望を聞き取り、適切なラベル付きの GitHub Issue を作成します。
作成した Issue は `issue-enrichment` → `tdd-next` パイプラインの起点になります。

## ラベル体系

| ラベル | 用途 | 付与タイミング |
|--------|------|--------------|
| `enhancement` | 機能追加・改善 | Issue 作成時 |
| `bug` | バグ報告 | Issue 作成時 |
| `future` | 将来の改善案 | Issue 作成時（該当時） |
| `keybinding-edit` | キーバインド編集機能関連 | Issue 作成時（該当時） |
| `status:ready` | 実装着手可能 | `issue-enrichment` が付与（このスキルでは付与しない） |

## 実行フロー

### 1. ヒアリング

ユーザーが何をしたいかを確認します。以下を把握する:
- **何をしたいか**（概要）
- **種別**: 機能追加（enhancement）か バグ修正（bug）か
- **追加ラベル**: `future`、`keybinding-edit` に該当するか

ユーザーが十分な情報を既に伝えている場合は、確認なしで次へ進んでよい。

### 2. Issue 本文の構成

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

### 3. Issue 作成

```bash
gh issue create \
  --title "{タイトル}" \
  --body "{本文}" \
  --label "{ラベル1}" \
  --label "{ラベル2}"
```

### 4. 報告と次のアクション提案

作成した Issue の URL を報告し、以下を提案:
- 「続けて `issue-enrichment` で詳細化しますか？」
- 複数 Issue を作成する場合は繰り返し実行

## 注意事項

- `status:ready` ラベルは付与しない（`issue-enrichment` の役割）
- タイトルは簡潔に（30文字程度を目安）
- 概要は `issue-enrichment` が拡充するので、最小限でよい
- 既存 Issue と重複しないか `gh issue list` で事前確認する
