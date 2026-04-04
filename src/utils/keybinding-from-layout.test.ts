import { describe, expect, it } from "vitest";
import type { VimMode } from "../types/keybinding";
import { KEYBINDING_SOURCE_LAYOUT_DERIVED } from "../types/keybinding";
import { deriveFromLayout } from "./keybinding-from-layout";

describe("deriveFromLayout", () => {
  // テスト用のシンプルなカスタムキーマップ: QWERTY の q が x を出力
  const customKeymap: Record<string, string> = {
    q: "x",
    w: "d",
    e: "j",
    r: "k",
  };

  const config = deriveFromLayout(customKeymap);

  it("正しい KeybindingConfig 構造を持つ（name, bindings, createdAt, updatedAt）", () => {
    expect(config).toHaveProperty("name");
    expect(config).toHaveProperty("bindings");
    expect(config).toHaveProperty("createdAt");
    expect(config).toHaveProperty("updatedAt");
    expect(config.name).toBe("Layout Derived");

    const expectedModes: VimMode[] = ["n", "v", "x", "o", "i", "s", "c", "t"];
    for (const mode of expectedModes) {
      expect(config.bindings).toHaveProperty(mode);
    }
  });

  it("source が 'layout-derived' である", () => {
    for (const kb of config.bindings.n) {
      expect(kb.source).toBe(KEYBINDING_SOURCE_LAYOUT_DERIVED);
    }
  });

  it("customKeymap が保存される", () => {
    expect(config.customKeymap).toEqual(customKeymap);
  });

  it("単純な1文字キーが逆引きされた lhs を持つ（q→x なら Vim 'x' の lhs は 'q'）", () => {
    // customKeymap: q→x なので inverse は x→q
    // Vim コマンド "x"（1文字削除）の lhs はカスタムキーボード上の "q" になるべき
    const xBinding = config.bindings.n.find((kb) => kb.commandId === "x");
    expect(xBinding).toBeDefined();
    expect(xBinding?.lhs).toBe("q");
  });
});
