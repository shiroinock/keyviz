# テストパターン: React コンポーネントのテスト

## 対象
- `src/components/` 配下の UI コンポーネント

## 特徴
- **テスト容易性**: 中〜高（React Testing Library使用）
- **TDD方式**: テストレイター（実装後にテスト）
- **配置**: colocated（`Component.tsx` と `Component.test.tsx` を同階層）

## テストの構造

```typescript
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component } from './Component';

describe('Component', () => {
  test('レンダリングされる', () => {
    render(<Component />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  test('ユーザー操作で状態が変わる', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

## クエリの優先順位
1. `getByRole()` (最優先)
2. `getByLabelText()`
3. `getByPlaceholderText()`
4. `getByText()`
5. `getByTestId()` (最終手段)

## カバーすべきシナリオ
1. **レンダリング**: 初期表示が正しいか
2. **ユーザー操作**: クリック、入力、フォーカスなど
3. **条件付きレンダリング**: props や state に応じた表示切り替え
4. **イベントハンドラ**: コールバック関数の呼び出し
