import { describe, expect, it } from "vitest";
import { resolveChar, resolveVimKey } from "./vim-key-resolver";

const simpleKeymap: Record<string, string> = {
  a: "a",
  b: "b",
  h: "h",
  j: "j",
  q: "x",
  s: "s",
  f: "f",
};

describe("resolveChar", () => {
  it("ベースレイヤーにある小文字キーを解決できる", () => {
    const res = resolveChar("j", simpleKeymap);
    expect(res).not.toBeNull();
    expect(res?.qwertyKey).toBe("j");
    expect(res?.requiresShift).toBe(false);
    expect(res?.requiresLayer).toBe(false);
    expect(res?.displayLabel).toBe("j");
  });

  it("大文字キーは Shift 付きで解決される", () => {
    const res = resolveChar("A", simpleKeymap);
    expect(res).not.toBeNull();
    expect(res?.qwertyKey).toBe("a");
    expect(res?.requiresShift).toBe(true);
    expect(res?.displayLabel).toBe("A");
  });

  it("カスタムキーマップの出力文字が displayLabel に反映される", () => {
    // q → x なので、qwertyKey は "q"、displayLabel は "x"
    const res = resolveChar("q", simpleKeymap);
    expect(res).not.toBeNull();
    expect(res?.qwertyKey).toBe("q");
    expect(res?.displayLabel).toBe("x");
  });

  it("キーマップにないキーは null を返す", () => {
    const res = resolveChar("z", simpleKeymap);
    expect(res).toBeNull();
  });

  it("VIA 情報なしでも動作する", () => {
    const res = resolveChar("a", simpleKeymap, null);
    expect(res).not.toBeNull();
    expect(res?.qwertyKey).toBe("a");
  });
});

describe("resolveVimKey", () => {
  it("単一文字を解決できる", () => {
    const res = resolveVimKey("j", simpleKeymap);
    expect(res.chars).toHaveLength(1);
    expect(res.chars[0].qwertyKey).toBe("j");
    expect(res.ctrl).toBeUndefined();
  });

  it("複数文字のキーシーケンスを1文字ずつ解決する", () => {
    const res = resolveVimKey("jj", simpleKeymap);
    expect(res.chars).toHaveLength(2);
    expect(res.chars[0].qwertyKey).toBe("j");
    expect(res.chars[1].qwertyKey).toBe("j");
  });

  it("Ctrl 系コマンドを解決できる", () => {
    const res = resolveVimKey("<C-f>", simpleKeymap);
    expect(res.chars).toHaveLength(0);
    expect(res.ctrl).toBeDefined();
    expect(res.ctrl?.type).toBe("ctrl");
    expect(res.ctrl?.baseChar).toBe("f");
    expect(res.ctrl?.qwertyKey).toBe("f");
  });

  it("解決できない文字はそのまま返す", () => {
    const res = resolveVimKey("1", simpleKeymap);
    expect(res.chars).toHaveLength(1);
    expect(res.chars[0].qwertyKey).toBe("1");
    expect(res.chars[0].displayLabel).toBe("1");
    expect(res.chars[0].requiresShift).toBe(false);
    expect(res.chars[0].requiresLayer).toBe(false);
  });
});
