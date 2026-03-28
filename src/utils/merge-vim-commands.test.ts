import { describe, expect, it } from "vitest";
import type { NvimMapping, VimCommand } from "../types/vim";
import { mergeWithNvimMaps } from "./merge-vim-commands";

const baseCommands: VimCommand[] = [
  { key: "j", name: "↓", description: "下に移動", category: "motion" },
  { key: "k", name: "↑", description: "上に移動", category: "motion" },
  { key: "dd", name: "行削除", description: "行を削除", category: "edit" },
];

function makeNvimMap(
  overrides: Partial<NvimMapping> & { lhs: string },
): NvimMapping {
  return {
    mode: "n",
    rhs: "",
    noremap: true,
    description: overrides.description ?? "test",
    source: "user",
    sourceDetail: "init.lua",
    ...overrides,
  };
}

describe("mergeWithNvimMaps", () => {
  it("nvim マップが空なら hardcoded をそのまま返す", () => {
    const result = mergeWithNvimMaps(baseCommands, []);
    expect(result).toHaveLength(3);
    expect(result.every((c) => c.source === "hardcoded")).toBe(true);
  });

  it("既存キーに一致する nvim マップは source を更新する", () => {
    const nvimMaps = [makeNvimMap({ lhs: "j", source: "user" })];
    const result = mergeWithNvimMaps(baseCommands, nvimMaps);

    const j = result.find((c) => c.key === "j");
    expect(j?.source).toBe("user");
    expect(j?.nvimOverride).toBe(true);
  });

  it("新規キーの nvim マップはマージ結果に追加される", () => {
    const nvimMaps = [
      makeNvimMap({ lhs: "gd", description: "Go to definition" }),
    ];
    const result = mergeWithNvimMaps(baseCommands, nvimMaps);

    expect(result).toHaveLength(4);
    const gd = result.find((c) => c.key === "gd");
    expect(gd).toBeDefined();
    expect(gd?.description).toBe("Go to definition");
    expect(gd?.category).toBe("misc");
  });

  it("description が空の nvim マップはスキップされる", () => {
    const nvimMaps = [makeNvimMap({ lhs: "gx", description: "" })];
    const result = mergeWithNvimMaps(baseCommands, nvimMaps);
    expect(result).toHaveLength(3);
  });

  it("<Plug> で始まるマップはスキップされる", () => {
    const nvimMaps = [
      makeNvimMap({ lhs: "<Plug>(something)", description: "plugin" }),
    ];
    const result = mergeWithNvimMaps(baseCommands, nvimMaps);
    expect(result).toHaveLength(3);
  });

  it("normal mode 以外のマップはスキップされる", () => {
    const nvimMaps = [
      makeNvimMap({ lhs: "jk", mode: "i", description: "escape" }),
    ];
    const result = mergeWithNvimMaps(baseCommands, nvimMaps);
    expect(result).toHaveLength(3);
  });

  it("<C-X> を <C-x> に正規化してマッチする", () => {
    const commands: VimCommand[] = [
      {
        key: "<C-f>",
        name: "Scroll",
        description: "前方スクロール",
        category: "scroll",
      },
    ];
    const nvimMaps = [
      makeNvimMap({ lhs: "<C-F>", source: "default", description: "scroll" }),
    ];
    const result = mergeWithNvimMaps(commands, nvimMaps);

    const cf = result.find((c) => c.key === "<C-f>");
    expect(cf?.source).toBe("default");
    expect(cf?.nvimOverride).toBe(true);
  });

  it("同じキーの重複 nvim マップは最初のもののみ反映される", () => {
    const nvimMaps = [
      makeNvimMap({ lhs: "gd", description: "first", source: "user" }),
      makeNvimMap({ lhs: "gd", description: "second", source: "default" }),
    ];
    const result = mergeWithNvimMaps(baseCommands, nvimMaps);

    const gds = result.filter((c) => c.key === "gd");
    expect(gds).toHaveLength(1);
    expect(gds[0].description).toBe("first");
  });
});
