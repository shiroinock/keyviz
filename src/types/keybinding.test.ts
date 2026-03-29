import { describe, expect, test } from "vitest";
import type { AppMode } from "./keybinding";
import { APP_MODE_LABELS, APP_MODES } from "./keybinding";

describe("APP_MODES", () => {
  test("4つの要素を持つ", () => {
    expect(APP_MODES).toHaveLength(4);
  });

  describe("全ての AppMode 値を含む", () => {
    const cases: AppMode[] = ["visualize", "practice", "reference", "edit"];

    test.each(cases)('"%s" を含む', (mode) => {
      expect(APP_MODES).toContain(mode);
    });
  });

  test("重複がない", () => {
    const unique = new Set<string>(APP_MODES);
    expect(unique.size).toBe(APP_MODES.length);
  });
});

describe("APP_MODE_LABELS", () => {
  test("全ての APP_MODES のキーを持つ", () => {
    for (const mode of APP_MODES) {
      expect(APP_MODE_LABELS).toHaveProperty(mode);
    }
  });

  describe("各モードのラベルが期待通りの日本語文字列であること", () => {
    const cases: [AppMode, string][] = [
      ["visualize", "可視化"],
      ["practice", "練習"],
      ["reference", "辞書"],
      ["edit", "編集"],
    ];

    test.each(cases)('"%s" のラベルは "%s"', (mode, expected) => {
      expect(APP_MODE_LABELS[mode]).toBe(expected);
    });
  });
});
