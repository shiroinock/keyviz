/** KLE JSON のキープロパティ（オブジェクト部分） */
export interface KLEKeyProperties {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  x2?: number;
  y2?: number;
  w2?: number;
  h2?: number;
  r?: number;
  rx?: number;
  ry?: number;
  c?: string;
  t?: string;
  a?: number;
}

/** KLE JSON の1行: プロパティオブジェクトまたはキーラベル文字列の配列 */
export type KLERow = (KLEKeyProperties | string)[];

/** KLE JSON 全体 */
export type KLEJSON = KLERow[];

/** VIA キーボード定義 JSON */
export interface VIADefinition {
  name: string;
  vendorId?: string;
  productId?: string;
  matrix?: { rows: number; cols: number };
  layouts: {
    keymap: KLEJSON;
    labels?: (string | string[])[];
  };
}

/** パース後の内部キーデータ */
export interface KeyData {
  /** キーボード上のX座標 (u単位) */
  x: number;
  /** キーボード上のY座標 (u単位) */
  y: number;
  /** キー幅 (u単位, デフォルト1) */
  w: number;
  /** キー高さ (u単位, デフォルト1) */
  h: number;
  /** 回転角度 */
  r: number;
  /** 回転中心X */
  rx: number;
  /** 回転中心Y */
  ry: number;
  /** KLE上のラベル（マトリクス座標 "row,col" など） */
  label: string;
  /** 背景色 */
  color: string;
  /** テキスト色 */
  textColor: string;
}

/** パース後のキーボードレイアウト */
export interface KeyboardLayout {
  keys: KeyData[];
  name: string;
}
