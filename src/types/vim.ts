export type VimCommandCategory =
  | "motion"
  | "edit"
  | "search"
  | "insert"
  | "visual"
  | "operator"
  | "misc";

export interface VimCommand {
  /** Vim のキー (QWERTY基準) */
  key: string;
  /** コマンド名 */
  name: string;
  /** 説明 */
  description: string;
  /** カテゴリ */
  category: VimCommandCategory;
}

/** QWERTY キー → カスタム配列キー のマッピング */
export interface KeyMapping {
  /** QWERTY のキー */
  qwerty: string;
  /** カスタム配列で出力されるキー */
  custom: string;
}
