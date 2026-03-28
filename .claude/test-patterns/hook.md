# テストパターン: React カスタムフックのテスト

## 対象
- `src/hooks/` 配下のカスタムフック

## 特徴
- **テスト容易性**: 中（renderHook が必要）
- **TDD方式**: テストファースト
- **配置**: colocated（`useXxx.ts` と `useXxx.test.ts` を同階層）

## テストの構造

```typescript
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  test('初期状態が正しい', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(initialValue);
  });

  test('アクションで状態が更新される', () => {
    const { result } = renderHook(() => useCustomHook());
    act(() => {
      result.current.action();
    });
    expect(result.current.value).toBe(updatedValue);
  });
});
```

## カバーすべきシナリオ
1. **初期状態**: フックの初期値
2. **状態更新**: setState などの動作
3. **副作用**: useEffect, タイマー, イベントリスナー
4. **クリーンアップ**: アンマウント時の処理
