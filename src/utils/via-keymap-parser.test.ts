import { describe, expect, it } from "vitest";
import {
  inverseShiftMap,
  parseVIAKeymap,
  parseVIAKeymapFull,
  shiftMap,
} from "./via-keymap-parser";

// ============================================================
// shiftMap / inverseShiftMap
// ============================================================

describe("shiftMap", () => {
  it("基本マッピングが正しいこと", () => {
    expect(shiftMap["1"]).toBe("!");
    expect(shiftMap["2"]).toBe("@");
    expect(shiftMap["3"]).toBe("#");
    expect(shiftMap[";"]).toBe(":");
    expect(shiftMap["'"]).toBe('"');
    expect(shiftMap["-"]).toBe("_");
    expect(shiftMap["="]).toBe("+");
    expect(shiftMap["["]).toBe("{");
    expect(shiftMap["]"]).toBe("}");
    expect(shiftMap["\\"]).toBe("|");
    expect(shiftMap["`"]).toBe("~");
    expect(shiftMap[","]).toBe("<");
    expect(shiftMap["."]).toBe(">");
    expect(shiftMap["/"]).toBe("?");
  });
});

describe("inverseShiftMap", () => {
  it("shiftMap の逆引きであること", () => {
    for (const [base, shifted] of Object.entries(shiftMap)) {
      expect(inverseShiftMap[shifted]).toBe(base);
    }
  });

  it("shiftMap と同じエントリ数であること", () => {
    expect(Object.keys(inverseShiftMap)).toHaveLength(
      Object.keys(shiftMap).length,
    );
  });
});

// ============================================================
// parseVIAKeymap
// ============================================================

describe("parseVIAKeymap", () => {
  it("基本的なキーコード（KC_A, KC_B 等）を正しく変換すること", () => {
    const json = {
      layers: [["KC_A", "KC_B", "KC_C", "KC_D"]],
    };
    const result = parseVIAKeymap(json, 4);
    expect(result).toEqual({
      "0,0": "a",
      "0,1": "b",
      "0,2": "c",
      "0,3": "d",
    });
  });

  it("レイヤーキー（MO, LT）や KC_NO 等は null で除外されること", () => {
    const json = {
      layers: [["KC_A", "MO(1)", "LT(2, KC_SPC)", "KC_NO", "KC_TRNS"]],
    };
    const result = parseVIAKeymap(json, 5);
    // KC_A → "a" のみ残る。MO(1) → null, KC_NO → null, KC_TRNS → null
    // LT(2, KC_SPC) は tap キーが取れるので "space"
    expect(result["0,0"]).toBe("a");
    expect(result["0,1"]).toBeUndefined(); // MO(1) → null → 除外
    expect(result["0,2"]).toBe("space"); // LT の tap キー
    expect(result["0,3"]).toBeUndefined(); // KC_NO → null → 除外
    expect(result["0,4"]).toBeUndefined(); // KC_TRNS → null → 除外
  });

  it("matrixCols に基づいてマトリクス座標が正しく計算されること", () => {
    const json = {
      layers: [["KC_A", "KC_B", "KC_C", "KC_D", "KC_E", "KC_F"]],
    };
    // matrixCols=3 → 2行3列
    const result = parseVIAKeymap(json, 3);
    expect(result["0,0"]).toBe("a");
    expect(result["0,1"]).toBe("b");
    expect(result["0,2"]).toBe("c");
    expect(result["1,0"]).toBe("d");
    expect(result["1,1"]).toBe("e");
    expect(result["1,2"]).toBe("f");
  });
});

// ============================================================
// parseVIAKeymapFull
// ============================================================

describe("parseVIAKeymapFull", () => {
  it("baseKeys が正しく抽出されること", () => {
    const json = {
      layers: [["KC_A", "KC_B", "KC_SPC"]],
    };
    const result = parseVIAKeymapFull(json, 3);
    expect(result.baseKeys).toEqual({
      "0,0": "a",
      "0,1": "b",
      "0,2": "space",
    });
  });

  it("modifiers（KC_LSFT, MT 等）が正しく抽出されること", () => {
    const json = {
      layers: [["KC_LSFT", "MT(MOD_LCTL, KC_A)", "LSFT_T(KC_Z)"]],
    };
    const result = parseVIAKeymapFull(json, 3);
    expect(result.modifiers).toHaveLength(3);

    // KC_LSFT: 単独修飾キー
    expect(result.modifiers[0]).toEqual({
      matrixKey: "0,0",
      modifier: "shift",
      tapKey: null,
      label: "shift",
    });

    // MT(MOD_LCTL, KC_A): Mod-Tap
    expect(result.modifiers[1]).toEqual({
      matrixKey: "0,1",
      modifier: "ctrl",
      tapKey: "a",
      label: "a長押し",
    });

    // LSFT_T(KC_Z): shorthand Mod-Tap
    expect(result.modifiers[2]).toEqual({
      matrixKey: "0,2",
      modifier: "shift",
      tapKey: "z",
      label: "z長押し",
    });
  });

  it("layerTaps（LT）が正しく抽出されること", () => {
    const json = {
      layers: [["LT(1, KC_SPC)", "MO(2)", "KC_A"]],
    };
    const result = parseVIAKeymapFull(json, 3);
    expect(result.layerTaps).toHaveLength(2);

    // LT(1, KC_SPC)
    expect(result.layerTaps[0]).toEqual({
      matrixKey: "0,0",
      layer: 1,
      tapKey: "space",
      label: "space長押し",
    });

    // MO(2)
    expect(result.layerTaps[1]).toEqual({
      matrixKey: "0,1",
      layer: 2,
      tapKey: null,
      label: "Layer 2",
    });
  });

  it("不正な入力（layers 無し）でエラーをスローすること", () => {
    expect(() => parseVIAKeymapFull({}, 4)).toThrow(
      "Invalid VIA keymap: missing layers array",
    );
    expect(() => parseVIAKeymapFull({ layers: [] }, 4)).toThrow(
      "Invalid VIA keymap: missing layers array",
    );
    expect(() => parseVIAKeymapFull({ layers: "not-array" }, 4)).toThrow(
      "Invalid VIA keymap: missing layers array",
    );
  });
});

// ============================================================
// resolveKeycode（内部関数だが parseVIAKeymap 経由でテスト）
// ============================================================

describe("resolveKeycode (parseVIAKeymap 経由)", () => {
  it("MT() からタップキーが取れること", () => {
    const json = {
      layers: [["MT(MOD_LCTL, KC_A)"]],
    };
    const result = parseVIAKeymap(json, 1);
    expect(result["0,0"]).toBe("a");
  });

  it("LT() からタップキーが取れること", () => {
    const json = {
      layers: [["LT(2, KC_ENT)"]],
    };
    const result = parseVIAKeymap(json, 1);
    expect(result["0,0"]).toBe("enter");
  });

  it("LSFT_T() からタップキーが取れること", () => {
    const json = {
      layers: [["LSFT_T(KC_A)"]],
    };
    const result = parseVIAKeymap(json, 1);
    expect(result["0,0"]).toBe("a");
  });

  it("RCTL_T() からタップキーが取れること", () => {
    const json = {
      layers: [["RCTL_T(KC_SCLN)"]],
    };
    const result = parseVIAKeymap(json, 1);
    expect(result["0,0"]).toBe(";");
  });

  it("S(KC_xxx) でアルファベットの場合は大文字が返ること", () => {
    const json = {
      layers: [["S(KC_A)", "S(KC_Z)"]],
    };
    const result = parseVIAKeymap(json, 2);
    expect(result["0,0"]).toBe("A");
    expect(result["0,1"]).toBe("Z");
  });

  it("S(KC_xxx) で記号の場合は Shift 文字が返ること", () => {
    const json = {
      layers: [["S(KC_1)", "S(KC_SCLN)", "S(KC_LBRC)"]],
    };
    const result = parseVIAKeymap(json, 3);
    expect(result["0,0"]).toBe("!"); // S(KC_1) → "1" → shiftMap["1"] = "!"
    expect(result["0,1"]).toBe(":"); // S(KC_SCLN) → ";" → shiftMap[";"] = ":"
    expect(result["0,2"]).toBe("{"); // S(KC_LBRC) → "[" → shiftMap["["] = "{"
  });
});
