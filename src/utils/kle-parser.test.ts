import { describe, expect, it } from "vitest";
import type { KLEJSON } from "../types/keyboard";
import { parseKLE, parseVIAorKLE } from "./kle-parser";

describe("parseKLE", () => {
  it("単純な3キー1行をパースして正しいキー数・座標・ラベルを返す", () => {
    const kle: KLEJSON = [["0,0", "0,1", "0,2"]];
    const result = parseKLE(kle);

    expect(result.keys).toHaveLength(3);
    expect(result.name).toBe("Keyboard");

    expect(result.keys[0]).toMatchObject({ x: 0, y: 0, label: "0,0" });
    expect(result.keys[1]).toMatchObject({ x: 1, y: 0, label: "0,1" });
    expect(result.keys[2]).toMatchObject({ x: 2, y: 0, label: "0,2" });

    // デフォルトの幅・高さ
    for (const key of result.keys) {
      expect(key.w).toBe(1);
      expect(key.h).toBe(1);
    }
  });

  it("プロパティオブジェクトで幅(w)が正しく反映される", () => {
    const kle: KLEJSON = [[{ w: 1.5 }, "0,0", "0,1"]];
    const result = parseKLE(kle);

    expect(result.keys).toHaveLength(2);

    // 最初のキーは w=1.5
    expect(result.keys[0]).toMatchObject({ x: 0, y: 0, w: 1.5, label: "0,0" });

    // 2番目のキーは x が 1.5 だけ進んでいる
    expect(result.keys[1]).toMatchObject({ x: 1.5, y: 0, w: 1, label: "0,1" });
  });

  it("レイアウトオプション choice !== 0 のキーがスキップされる", () => {
    // ラベル "0,0\n\n\n1,1" は position 3 が "1,1" → layoutOption=1, layoutChoice=1
    const kle: KLEJSON = [["0,0\n\n\n1,1", "0,1\n\n\n1,0", "0,2"]];
    const result = parseKLE(kle);

    // choice=1 のキーはスキップ、choice=0 と option なしは残る
    expect(result.keys).toHaveLength(2);
    expect(result.keys[0]).toMatchObject({ label: "0,1", x: 1 });
    expect(result.keys[1]).toMatchObject({ label: "0,2", x: 2 });
  });

  it("回転 (r, rx, ry) が正しく反映される", () => {
    const kle: KLEJSON = [[{ r: 15, rx: 3, ry: 1 }, "0,0", "0,1"]];
    const result = parseKLE(kle);

    expect(result.keys).toHaveLength(2);

    // 回転プロパティが設定される
    expect(result.keys[0]).toMatchObject({
      r: 15,
      rx: 3,
      ry: 1,
      x: 3,
      y: 1,
      label: "0,0",
    });

    expect(result.keys[1]).toMatchObject({
      r: 15,
      rx: 3,
      ry: 1,
      x: 4,
      y: 1,
      label: "0,1",
    });
  });
});

describe("parseVIAorKLE", () => {
  it("VIA 定義 JSON（{name, layouts: {keymap}}）を正しくパースする", () => {
    const viaJson = {
      name: "MyKeyboard",
      layouts: {
        keymap: [["0,0", "0,1"]] as KLEJSON,
      },
    };
    const result = parseVIAorKLE(viaJson);

    expect(result.name).toBe("MyKeyboard");
    expect(result.keys).toHaveLength(2);
    expect(result.keys[0]).toMatchObject({ label: "0,0" });
    expect(result.keys[1]).toMatchObject({ label: "0,1" });
  });

  it("配列をそのまま KLE として受け入れる", () => {
    const kleJson: KLEJSON = [["0,0", "0,1", "0,2"]];
    const result = parseVIAorKLE(kleJson);

    expect(result.name).toBe("Keyboard");
    expect(result.keys).toHaveLength(3);
  });

  it("不正な形式で例外をスローする", () => {
    expect(() => parseVIAorKLE("invalid")).toThrow(
      "Unsupported JSON format: expected VIA definition or KLE array",
    );
    expect(() => parseVIAorKLE(42)).toThrow();
    expect(() => parseVIAorKLE({ foo: "bar" })).toThrow();
    expect(() => parseVIAorKLE(null)).toThrow();
  });
});
