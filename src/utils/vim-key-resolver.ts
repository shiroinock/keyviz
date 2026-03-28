import { invertKeymap } from "../data/keymap";
import { decomposeVimKey } from "../data/vim-commands";
import type { VIAKeymapFull } from "../types/vim";
import { shiftMap } from "./via-keymap-parser";

/**
 * 1文字の Vim キー（QWERTY 基準）を物理入力に解決した結果
 */
export interface CharResolution {
  /** 押す物理キーの QWERTY 位置 */
  qwertyKey: string;
  /** Shift が必要か */
  requiresShift: boolean;
  /** Shift キーのマトリクス位置（VIA 情報がある場合） */
  shiftMatrixKey?: string;
  /** レイヤー切替が必要か */
  requiresLayer: boolean;
  /** レイヤーキーのマトリクス位置 */
  layerMatrixKey?: string;
  /** レイヤーキーの表示ラベル（"space長押し" 等） */
  layerLabel?: string;
  /** ユーザーのキーボード上で見えるラベル */
  displayLabel: string;
}

/**
 * Ctrl 系コマンドを解決した結果
 */
export interface CtrlResolution {
  type: "ctrl";
  baseChar: string;
  qwertyKey: string;
  ctrlMatrixKey?: string;
  displayLabel: string;
}

/**
 * Vim キー全体の解決結果
 */
export interface VimKeyResolution {
  /** 個々の文字の解決結果（Ctrl 系は chars が空で ctrl が入る） */
  chars: CharResolution[];
  ctrl?: CtrlResolution;
}

/**
 * 1文字の Vim キーを物理入力に解決する
 *
 * 1. ベースレイヤー（customKeymap）にあれば直接 or Shift+キー
 * 2. VIA レイヤー上にあればレイヤーキー + キー（+ Shift）
 * 3. どちらにもなければ null
 */
export function resolveChar(
  ch: string,
  customKeymap: Record<string, string>,
  viaKeymapFull?: VIAKeymapFull | null,
): CharResolution | null {
  const { base, shifted } = decomposeVimKey(ch);

  // --- 1. ベースレイヤーにある場合 ---
  if (base in customKeymap) {
    const outputChar = customKeymap[base];
    const shiftMod = shifted
      ? viaKeymapFull?.modifiers.find((m) => m.modifier === "shift")
      : null;

    let displayLabel: string;
    if (shifted) {
      displayLabel = /^[a-z]$/.test(outputChar)
        ? outputChar.toUpperCase()
        : (shiftMap[outputChar] ?? outputChar);
    } else {
      displayLabel = outputChar;
    }

    return {
      qwertyKey: base,
      requiresShift: shifted,
      shiftMatrixKey: shiftMod?.matrixKey,
      requiresLayer: false,
      displayLabel,
    };
  }

  // --- 2. VIA レイヤー上を探索 ---
  if (viaKeymapFull) {
    const inverseCustom = invertKeymap(customKeymap);

    for (
      let layerIdx = 0;
      layerIdx < viaKeymapFull.layerKeys.length;
      layerIdx++
    ) {
      const layerMap = viaKeymapFull.layerKeys[layerIdx];
      const targetLayer = layerIdx + 1;

      // コマンド文字が直接レイヤーにある
      for (const [matrixKey, outputChar] of Object.entries(layerMap)) {
        if (outputChar !== ch) continue;

        const layerKey = viaKeymapFull.layerTaps.find(
          (lt) => lt.layer === targetLayer,
        );
        if (!layerKey) continue;

        const baseOutputAtPos = viaKeymapFull.baseKeys[matrixKey];
        const qwertyPos = baseOutputAtPos
          ? (inverseCustom[baseOutputAtPos] ?? baseOutputAtPos)
          : matrixKey;

        return {
          qwertyKey: qwertyPos,
          requiresShift: false,
          requiresLayer: true,
          layerMatrixKey: layerKey.matrixKey,
          layerLabel: layerKey.label,
          displayLabel: ch,
        };
      }

      // Shift 分解したベースキーがレイヤー上にある場合
      if (shifted) {
        for (const [matrixKey, outputChar] of Object.entries(layerMap)) {
          if (outputChar !== base) continue;

          const layerKey = viaKeymapFull.layerTaps.find(
            (lt) => lt.layer === targetLayer,
          );
          if (!layerKey) continue;

          const shiftMod = viaKeymapFull.modifiers.find(
            (m) => m.modifier === "shift",
          );
          const baseOutputAtPos = viaKeymapFull.baseKeys[matrixKey];
          const qwertyPos = baseOutputAtPos
            ? (inverseCustom[baseOutputAtPos] ?? baseOutputAtPos)
            : matrixKey;

          const displayLabel = /^[a-z]$/.test(base)
            ? base.toUpperCase()
            : (shiftMap[base] ?? base);

          return {
            qwertyKey: qwertyPos,
            requiresShift: true,
            shiftMatrixKey: shiftMod?.matrixKey,
            requiresLayer: true,
            layerMatrixKey: layerKey.matrixKey,
            layerLabel: layerKey.label,
            displayLabel,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Vim キー文字列全体を解決する
 */
export function resolveVimKey(
  vimKey: string,
  customKeymap: Record<string, string>,
  viaKeymapFull?: VIAKeymapFull | null,
): VimKeyResolution {
  // Ctrl 系
  const ctrlMatch = vimKey.match(/^<C-(\w)>$/);
  if (ctrlMatch) {
    const base = ctrlMatch[1].toLowerCase();
    const charRes = resolveChar(base, customKeymap, viaKeymapFull);
    const ctrlMod = viaKeymapFull?.modifiers.find((m) => m.modifier === "ctrl");

    return {
      chars: [],
      ctrl: {
        type: "ctrl",
        baseChar: base,
        qwertyKey: charRes?.qwertyKey ?? base,
        ctrlMatrixKey: ctrlMod?.matrixKey,
        displayLabel: charRes?.displayLabel ?? base,
      },
    };
  }

  // 1文字ずつ解決
  const chars: CharResolution[] = [];
  for (const ch of vimKey) {
    const res = resolveChar(ch, customKeymap, viaKeymapFull);
    if (res) {
      chars.push(res);
    } else {
      // 解決できない文字はそのまま（数字キーなど customKeymap にない場合）
      chars.push({
        qwertyKey: ch,
        requiresShift: false,
        requiresLayer: false,
        displayLabel: ch,
      });
    }
  }

  return { chars };
}
