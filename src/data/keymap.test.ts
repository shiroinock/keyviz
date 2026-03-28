import { describe, expect, it } from "vitest";
import { defaultCustomKeymap, invertKeymap } from "./keymap";

describe("defaultCustomKeymap", () => {
  it("30キー（top row 10 + home row 10 + bottom row 10）を持つ", () => {
    const keys = Object.keys(defaultCustomKeymap);
    expect(keys).toHaveLength(30);
  });
});

describe("invertKeymap", () => {
  it("キーと値を逆引きしたマップを返す", () => {
    const result = invertKeymap({ a: "x", b: "y" });
    expect(result).toEqual({ x: "a", y: "b" });
  });

  it("単一エントリでも正しく逆引きする", () => {
    const result = invertKeymap({ a: "x" });
    expect(result).toEqual({ x: "a" });
  });

  it("空のマップには空のマップを返す", () => {
    const result = invertKeymap({});
    expect(result).toEqual({});
  });

  it("defaultCustomKeymap を逆引きして再逆引きすると元のマップに戻る（双方向性）", () => {
    const inverted = invertKeymap(defaultCustomKeymap);
    const restored = invertKeymap(inverted);
    expect(restored).toEqual(defaultCustomKeymap);
  });
});
