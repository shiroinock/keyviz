import { describe, expect, it } from "vitest";
import type { VimCommandCategory } from "../types/vim";
import {
  categoryColors,
  categoryLabels,
  decomposeVimKey,
  vimCommands,
} from "./vim-commands";

const validCategories: VimCommandCategory[] = [
  "motion",
  "edit",
  "search",
  "insert",
  "visual",
  "operator",
  "textobj",
  "misc",
];

const validModes = ["n", "v", "x", "o", "i", "s", "c", "t"];

describe("vimCommands データ整合性", () => {
  it("コマンドが1つ以上存在する", () => {
    expect(vimCommands.length).toBeGreaterThan(0);
  });

  it("同一モード内で key が重複していない", () => {
    const seen = new Map<string, string[]>();
    for (const cmd of vimCommands) {
      const modes = cmd.modes ?? ["n"];
      for (const mode of modes) {
        const compositeKey = `${mode}:${cmd.key}`;
        if (!seen.has(compositeKey)) {
          seen.set(compositeKey, []);
        }
        seen.get(compositeKey)?.push(cmd.name);
      }
    }
    const duplicates = [...seen.entries()].filter(
      ([, names]) => names.length > 1,
    );
    expect(duplicates, `重複: ${JSON.stringify(duplicates)}`).toEqual([]);
  });

  it("全コマンドが必須フィールドを持つ", () => {
    for (const cmd of vimCommands) {
      expect(cmd.key, `key が空: ${JSON.stringify(cmd)}`).toBeTruthy();
      expect(cmd.name, `name が空: key=${cmd.key}`).toBeTruthy();
      expect(cmd.description, `description が空: key=${cmd.key}`).toBeTruthy();
      expect(cmd.category, `category が空: key=${cmd.key}`).toBeTruthy();
    }
  });

  it("全コマンドの category が有効な値である", () => {
    for (const cmd of vimCommands) {
      expect(
        validCategories,
        `不正な category "${cmd.category}": key=${cmd.key}`,
      ).toContain(cmd.category);
    }
  });

  it("modes が指定されている場合は有効な値のみ含む", () => {
    for (const cmd of vimCommands) {
      if (cmd.modes) {
        for (const mode of cmd.modes) {
          expect(validModes, `不正な mode "${mode}": key=${cmd.key}`).toContain(
            mode,
          );
        }
      }
    }
  });
});

describe("categoryColors", () => {
  it("全カテゴリに色が定義されている", () => {
    for (const cat of validCategories) {
      expect(categoryColors[cat], `色が未定義: ${cat}`).toBeTruthy();
    }
  });
});

describe("categoryLabels", () => {
  it("全カテゴリにラベルが定義されている", () => {
    for (const cat of validCategories) {
      expect(categoryLabels[cat], `ラベルが未定義: ${cat}`).toBeTruthy();
    }
  });
});

describe("decomposeVimKey", () => {
  it("小文字はそのまま返す", () => {
    expect(decomposeVimKey("j")).toEqual({ base: "j", shifted: false });
  });

  it("大文字は小文字 + shifted で返す", () => {
    expect(decomposeVimKey("A")).toEqual({ base: "a", shifted: true });
  });

  it("Shift 記号はベースキー + shifted で返す", () => {
    expect(decomposeVimKey("$")).toEqual({ base: "4", shifted: true });
    expect(decomposeVimKey("^")).toEqual({ base: "6", shifted: true });
  });

  it("複数文字のキーはそのまま返す", () => {
    expect(decomposeVimKey("dd")).toEqual({ base: "dd", shifted: false });
    expect(decomposeVimKey("<C-f>")).toEqual({
      base: "<C-f>",
      shifted: false,
    });
  });

  it("数字はそのまま返す", () => {
    expect(decomposeVimKey("0")).toEqual({ base: "0", shifted: false });
  });
});
