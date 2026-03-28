import { describe, expect, it } from "vitest";
import { parseNvimMapOutput } from "./nvim-map-parser";

describe("parseNvimMapOutput", () => {
  it("基本的なマッピング行をパースできる", () => {
    const raw = `n  j           * k`;
    const result = parseNvimMapOutput(raw);
    expect(result).toHaveLength(1);
    expect(result[0].mode).toBe("n");
    expect(result[0].lhs).toBe("j");
    expect(result[0].rhs).toBe("k");
    expect(result[0].noremap).toBe(true);
  });

  it("noremap でないマッピングを正しく判定する", () => {
    const raw = `n  j             k`;
    const result = parseNvimMapOutput(raw);
    expect(result).toHaveLength(1);
    expect(result[0].noremap).toBe(false);
  });

  it("description 行を取り込める", () => {
    const raw = [
      `n  [d          * <Lua 29: vim/_defaults.lua:0>`,
      `                  Jump to the previous diagnostic`,
    ].join("\n");
    const result = parseNvimMapOutput(raw);
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe("Jump to the previous diagnostic");
  });

  it("source 行から出自を分類できる", () => {
    const raw = [
      `n  [d          * <Lua 29: vim/_defaults.lua:0>`,
      `                  Jump to the previous diagnostic`,
      `\tLast set from Lua (run Nvim with -V1 for more details)`,
    ].join("\n");
    const result = parseNvimMapOutput(raw);
    expect(result[0].source).toBe("nvim-default");
  });

  it("plugin source を正しく分類する", () => {
    const raw = [
      `n  gx          * <Lua: /runtime/lua/vim/_defaults.lua:0>`,
      `\tLast set from /runtime/plugin/netrwPlugin.vim`,
    ].join("\n");
    const result = parseNvimMapOutput(raw);
    expect(result[0].source).toBe("plugin");
  });

  it("user source を正しく分類する", () => {
    const raw = [
      `n  <leader>ff  * <Lua 42: init.lua:10>`,
      `                  Find files`,
      `\tLast set from ~/dotfiles/init.lua`,
    ].join("\n");
    const result = parseNvimMapOutput(raw);
    expect(result[0].source).toBe("user");
    expect(result[0].description).toBe("Find files");
  });

  it("<Plug> マッピングはスキップされる", () => {
    const raw = [
      `n  <Plug>(matchup-%)  * <Lua 5>`,
      `                         matchup jump`,
      `\tLast set from /pack/matchup.vim`,
      `n  j           * k`,
    ].join("\n");
    const result = parseNvimMapOutput(raw);
    expect(result).toHaveLength(1);
    expect(result[0].lhs).toBe("j");
  });

  it("複数のマッピングをパースできる", () => {
    const raw = [
      `n  j           * k`,
      `n  k           * j`,
      `n  gd          * <Lua 10>`,
    ].join("\n");
    const result = parseNvimMapOutput(raw);
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.lhs)).toEqual(["j", "k", "gd"]);
  });

  it("空文字列を渡すと空配列を返す", () => {
    const result = parseNvimMapOutput("");
    expect(result).toEqual([]);
  });

  it("マッチしない行は無視される", () => {
    const raw = [
      "--- some header ---",
      `n  j           * k`,
      "random garbage",
    ].join("\n");
    const result = parseNvimMapOutput(raw);
    expect(result).toHaveLength(1);
    expect(result[0].lhs).toBe("j");
  });
});
