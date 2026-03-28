import { describe, expect, it } from "vitest";
import type { VimMode } from "../types/keybinding";
import type { VimCommand } from "../types/vim";
import { commandsToBindings, createDefaultConfig } from "./keybinding-defaults";

describe("createDefaultConfig", () => {
  const config = createDefaultConfig();

  it("正しい KeybindingConfig 構造を持つ（name, bindings, createdAt, updatedAt）", () => {
    expect(config).toHaveProperty("name");
    expect(config).toHaveProperty("bindings");
    expect(config).toHaveProperty("createdAt");
    expect(config).toHaveProperty("updatedAt");
    expect(config.name).toBe("QWERTY Default");
    expect(config.createdAt).toBeTruthy();
    expect(config.updatedAt).toBeTruthy();
  });

  it("bindings が全 VimMode キーを持つ（n, v, x, o, i, s, c, t）", () => {
    const expectedModes: VimMode[] = ["n", "v", "x", "o", "i", "s", "c", "t"];
    for (const mode of expectedModes) {
      expect(config.bindings).toHaveProperty(mode);
      expect(Array.isArray(config.bindings[mode])).toBe(true);
    }
  });

  it("n モードにバインディングが存在する（空でない）", () => {
    expect(config.bindings.n.length).toBeGreaterThan(0);
  });

  it("各バインディングが正しいフィールドを持つ（lhs, name, description, category, source, noremap）", () => {
    for (const kb of config.bindings.n) {
      expect(kb).toHaveProperty("lhs");
      expect(kb).toHaveProperty("name");
      expect(kb).toHaveProperty("description");
      expect(kb).toHaveProperty("category");
      expect(kb.source).toBe("default");
      expect(kb.noremap).toBe(true);
    }
  });

  it("modes が ['n', 'v', 'o'] のコマンドが n, v, o の全モードに含まれる", () => {
    // h, j, k, l は modes: nvo = ["n", "v", "o"] として定義されている
    const targetKey = "h";
    for (const mode of ["n", "v", "o"] as VimMode[]) {
      const found = config.bindings[mode].some((kb) => kb.lhs === targetKey);
      expect(found, `"${targetKey}" が ${mode} モードに存在すべき`).toBe(true);
    }
  });
});

describe("commandsToBindings", () => {
  const testCommands: VimCommand[] = [
    {
      key: "j",
      name: "↓",
      description: "下に移動",
      category: "motion",
      modes: ["n", "v", "o"],
    },
    {
      key: "dd",
      name: "行削除",
      description: "行を削除",
      category: "edit",
    },
  ];

  it("VimCommand 配列を Keybinding 配列に変換できる", () => {
    const result = commandsToBindings(testCommands, "n");
    expect(result).toHaveLength(2);
    expect(result[0].lhs).toBe("j");
    expect(result[0].name).toBe("↓");
    expect(result[1].lhs).toBe("dd");
    expect(result[1].name).toBe("行削除");
  });

  it("source パラメータが反映される", () => {
    const result = commandsToBindings(testCommands, "n", "nvim-import");
    for (const kb of result) {
      expect(kb.source).toBe("nvim-import");
    }
  });
});
