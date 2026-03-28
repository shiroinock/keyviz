# テストパターン: 純粋関数のユニットテスト

## 対象
- `src/utils/` 配下の純粋関数
- `src/data/` 配下のデータ変換関数
- 副作用がなく、同じ入力に対して常に同じ出力を返す関数

## 特徴
- **テスト容易性**: 高（モック不要）
- **TDD方式**: テストファースト
- **配置**: colocated（`xxx.ts` と `xxx.test.ts` を同階層）

## テストの構造

```typescript
import { describe, test, expect } from 'vitest';
import { targetFunction } from './targetFunction';

describe('targetFunction', () => {
  describe('正常系', () => {
    test('基本的な入力で正しい出力を返す', () => {
      // Arrange
      const input = ...;
      const expected = ...;
      // Act
      const result = targetFunction(input);
      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('境界値', () => {
    test('最小値で正しく動作する', () => { ... });
    test('最大値で正しく動作する', () => { ... });
  });

  describe('エッジケース', () => {
    test('空入力で正しく動作する', () => { ... });
  });

  describe('異常系', () => {
    test('無効な入力でエラーをスローする', () => {
      expect(() => targetFunction(invalidInput)).toThrow();
    });
  });
});
```

## カバーすべきシナリオ
1. **正常系**: 典型的な入力パターン
2. **境界値**: 範囲の最小値、最大値、境界ちょうど
3. **エッジケース**: 空入力、null、undefined
4. **異常系**: 無効な入力

## ベストプラクティス
- テストケースの独立性を保つ
- 明確なテスト名（何をテストしているかが一目で分かる）
- Arrange-Act-Assert の分離
