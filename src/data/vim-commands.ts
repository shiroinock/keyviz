import type { VimCommand } from "../types/vim";
import type { VimMode } from "../types/keybinding";
import { inverseShiftMap } from "../utils/via-keymap-parser";

/** モーション: ノーマル・ビジュアル・オペレータ待ち */
const nvo: VimMode[] = ["n", "v", "o"];
/** オペレータ: ノーマル・ビジュアル */
const nv: VimMode[] = ["n", "v"];
/** テキストオブジェクト: ビジュアル・オペレータ待ち */
const vo: VimMode[] = ["v", "o"];

/**
 * Vim コマンド網羅一覧
 * key は QWERTY 基準、modes 省略時は ["n"]
 */
export const vimCommands: VimCommand[] = [
  // =============================================
  // Motion — 基本移動
  // =============================================
  { key: "h", name: "←", description: "左に移動", category: "motion", modes: nvo },
  { key: "j", name: "↓", description: "下に移動", category: "motion", modes: nvo },
  { key: "k", name: "↑", description: "上に移動", category: "motion", modes: nvo },
  { key: "l", name: "→", description: "右に移動", category: "motion", modes: nvo },

  // Motion — 単語移動
  { key: "w", name: "word→", description: "次の単語の先頭へ", category: "motion", modes: nvo },
  { key: "W", name: "WORD→", description: "次のWORD（空白区切り）の先頭へ", category: "motion", modes: nvo },
  { key: "b", name: "word←", description: "前の単語の先頭へ", category: "motion", modes: nvo },
  { key: "B", name: "WORD←", description: "前のWORD（空白区切り）の先頭へ", category: "motion", modes: nvo },
  { key: "e", name: "end→", description: "単語の末尾へ", category: "motion", modes: nvo },
  { key: "E", name: "END→", description: "WORD（空白区切り）の末尾へ", category: "motion", modes: nvo },
  { key: "ge", name: "end←", description: "前の単語の末尾へ", category: "motion", modes: nvo },
  { key: "gE", name: "END←", description: "前のWORD（空白区切り）の末尾へ", category: "motion", modes: nvo },

  // Motion — 行内移動
  { key: "0", name: "行頭", description: "行頭に移動", category: "motion", modes: nvo },
  { key: "^", name: "行頭(非空白)", description: "行頭の非空白文字に移動", category: "motion", modes: nvo },
  { key: "$", name: "行末", description: "行末に移動", category: "motion", modes: nvo },
  { key: "|", name: "桁移動", description: "[count] 桁目に移動", category: "motion", modes: nvo },
  { key: "f", name: "find→", description: "行内で指定文字まで移動", category: "motion", modes: nvo },
  { key: "F", name: "find←", description: "行内で指定文字まで逆方向に移動", category: "motion", modes: nvo },
  { key: "t", name: "till→", description: "行内で指定文字の手前まで移動", category: "motion", modes: nvo },
  { key: "T", name: "till←", description: "行内で指定文字の手前まで逆方向に移動", category: "motion", modes: nvo },
  { key: ";", name: "ft繰り返し", description: "直前の f/t/F/T を同方向に繰り返す", category: "motion", modes: nvo },
  { key: ",", name: "ft逆繰り返し", description: "直前の f/t/F/T を逆方向に繰り返す", category: "motion", modes: nvo },

  // Motion — 行移動
  { key: "gg", name: "先頭行", description: "ファイルの先頭行に移動（[count]行目）", category: "motion", modes: nvo },
  { key: "G", name: "最終行", description: "ファイルの最終行に移動（[count]行目）", category: "motion", modes: nvo },
  { key: "+", name: "次行先頭", description: "次の行の最初の非空白文字へ", category: "motion", modes: nvo },
  { key: "-", name: "前行先頭", description: "前の行の最初の非空白文字へ", category: "motion", modes: nvo },
  { key: "_", name: "現行先頭", description: "現在行の最初の非空白文字へ（[count]-1行下）", category: "motion", modes: nvo },

  // Motion — 段落・文・括弧
  { key: "{", name: "段落↑", description: "前の段落（空行）に移動", category: "motion", modes: nvo },
  { key: "}", name: "段落↓", description: "次の段落（空行）に移動", category: "motion", modes: nvo },
  { key: "(", name: "文↑", description: "前の文の先頭に移動", category: "motion", modes: nvo },
  { key: ")", name: "文↓", description: "次の文の先頭に移動", category: "motion", modes: nvo },
  { key: "[[", name: "セクション↑", description: "前のセクション（{ で始まる行）に移動", category: "motion", modes: nvo },
  { key: "]]", name: "セクション↓", description: "次のセクション（{ で始まる行）に移動", category: "motion", modes: nvo },
  { key: "[]", name: "セクション末↑", description: "前のセクション末尾（} で始まる行）に移動", category: "motion", modes: nvo },
  { key: "][", name: "セクション末↓", description: "次のセクション末尾（} で始まる行）に移動", category: "motion", modes: nvo },
  { key: "%", name: "対応括弧", description: "対応する括弧に移動", category: "motion", modes: nvo },

  // Motion — スクロール・画面内移動
  { key: "H", name: "画面上端", description: "画面の最上行に移動", category: "motion", modes: nvo },
  { key: "M", name: "画面中央", description: "画面の中央行に移動", category: "motion", modes: nvo },
  { key: "L", name: "画面下端", description: "画面の最下行に移動", category: "motion", modes: nvo },
  { key: "<C-f>", name: "1頁↓", description: "1ページ下にスクロール", category: "motion", modes: nvo },
  { key: "<C-b>", name: "1頁↑", description: "1ページ上にスクロール", category: "motion", modes: nvo },
  { key: "<C-d>", name: "半頁↓", description: "半ページ下にスクロール", category: "motion", modes: nvo },
  { key: "<C-u>", name: "半頁↑", description: "半ページ上にスクロール", category: "motion", modes: nvo },
  { key: "<C-e>", name: "scroll↓", description: "画面を1行下にスクロール", category: "motion", modes: nvo },
  { key: "<C-y>", name: "scroll↑", description: "画面を1行上にスクロール", category: "motion", modes: nvo },

  // Motion — マーク・ジャンプ
  { key: "'", name: "マーク行", description: "マーク位置の行頭に移動", category: "motion", modes: nvo },
  { key: "`", name: "マーク位置", description: "マーク位置（行+桁）に移動", category: "motion", modes: nvo },
  { key: "''", name: "前位置行", description: "直前のジャンプ位置の行頭に戻る", category: "motion", modes: nvo },
  { key: "``", name: "前位置", description: "直前のジャンプ位置（行+桁）に戻る", category: "motion", modes: nvo },
  { key: "<C-o>", name: "jumplist←", description: "ジャンプリストを戻る", category: "motion" },
  { key: "<C-i>", name: "jumplist→", description: "ジャンプリストを進む", category: "motion" },

  // =============================================
  // Operator — オペレータ（モーション/テキストオブジェクトと組み合わせ）
  // =============================================
  { key: "d", name: "delete", description: "削除（モーションと組み合わせ: dw, dd 等）", category: "operator", modes: nv },
  { key: "c", name: "change", description: "削除してインサートモードへ（cw, cc 等）", category: "operator", modes: nv },
  { key: "y", name: "yank", description: "ヤンク/コピー（yw, yy 等）", category: "operator", modes: nv },
  { key: ">", name: "indent→", description: "インデントを増やす（>>, >w 等）", category: "operator", modes: nv },
  { key: "<", name: "indent←", description: "インデントを減らす（<<, <w 等）", category: "operator", modes: nv },
  { key: "=", name: "auto indent", description: "自動インデント（==, =G 等）", category: "operator", modes: nv },
  { key: "gq", name: "整形", description: "テキストを整形（gqq, gqap 等）", category: "operator", modes: nv },
  { key: "gw", name: "整形(カーソル固定)", description: "テキストを整形しカーソル位置を維持", category: "operator", modes: nv },
  { key: "gu", name: "小文字化", description: "小文字に変換（guw, guu 等）", category: "operator", modes: nv },
  { key: "gU", name: "大文字化", description: "大文字に変換（gUw, gUU 等）", category: "operator", modes: nv },
  { key: "g~", name: "大小反転", description: "大文字/小文字を反転（g~w, g~~ 等）", category: "operator", modes: nv },
  { key: "!", name: "外部フィルタ", description: "外部コマンドでフィルタ（!!, !G 等）", category: "operator", modes: nv },

  // Operator — 行操作ショートカット
  { key: "dd", name: "行削除", description: "現在行を削除", category: "operator" },
  { key: "cc", name: "行変更", description: "現在行を削除してインサートモードへ", category: "operator" },
  { key: "yy", name: "行ヤンク", description: "現在行をヤンク（コピー）", category: "operator" },
  { key: ">>", name: "行indent→", description: "現在行のインデントを増やす", category: "operator" },
  { key: "<<", name: "行indent←", description: "現在行のインデントを減らす", category: "operator" },
  { key: "==", name: "行auto indent", description: "現在行を自動インデント", category: "operator" },
  { key: "Y", name: "行ヤンク(Vi)", description: "行末までヤンク（Neovim: yy と同等）", category: "operator" },
  { key: "D", name: "行末まで削除", description: "カーソルから行末まで削除", category: "operator" },
  { key: "C", name: "行末まで変更", description: "カーソルから行末まで削除してインサートモードへ", category: "operator" },
  { key: "S", name: "行置換", description: "行全体を削除してインサートモードへ（cc と同等）", category: "operator" },

  // =============================================
  // Edit — 編集コマンド
  // =============================================
  { key: "x", name: "1字削除", description: "カーソル位置の1文字を削除", category: "edit", modes: nv },
  { key: "X", name: "1字削除←", description: "カーソルの左の1文字を削除", category: "edit" },
  { key: "r", name: "replace", description: "カーソル位置の1文字を置換", category: "edit", modes: nv },
  { key: "R", name: "Replace mode", description: "置換モード（上書き入力）", category: "edit" },
  { key: "p", name: "paste↓", description: "カーソルの後ろ/下にペースト", category: "edit" },
  { key: "P", name: "paste↑", description: "カーソルの前/上にペースト", category: "edit" },
  { key: "gp", name: "paste↓(末尾)", description: "ペーストしてカーソルをペースト末尾に移動", category: "edit" },
  { key: "gP", name: "paste↑(末尾)", description: "前にペーストしてカーソルをペースト末尾に移動", category: "edit" },
  { key: "u", name: "undo", description: "元に戻す", category: "edit" },
  { key: "<C-r>", name: "redo", description: "やり直す（undo の取り消し）", category: "edit" },
  { key: "U", name: "行undo", description: "行全体の変更を元に戻す", category: "edit" },
  { key: "J", name: "join", description: "次の行を現在の行に結合（スペース挿入）", category: "edit", modes: nv },
  { key: "gJ", name: "join(スペースなし)", description: "次の行を結合（スペースなし）", category: "edit", modes: nv },
  { key: "~", name: "大小変換", description: "大文字/小文字を切り替えて1文字進む", category: "edit" },
  { key: ".", name: "繰り返し", description: "直前の変更コマンドを繰り返す", category: "edit" },
  { key: "<C-a>", name: "数値+1", description: "カーソル下/後の数値をインクリメント", category: "edit", modes: nv },
  { key: "<C-x>", name: "数値-1", description: "カーソル下/後の数値をデクリメント", category: "edit", modes: nv },

  // =============================================
  // Insert — インサートモード開始
  // =============================================
  { key: "i", name: "insert", description: "カーソル位置でインサートモードへ", category: "insert" },
  { key: "I", name: "Insert行頭", description: "行頭の非空白文字でインサートモードへ", category: "insert" },
  { key: "a", name: "append", description: "カーソルの後ろでインサートモードへ", category: "insert" },
  { key: "A", name: "Append行末", description: "行末でインサートモードへ", category: "insert" },
  { key: "o", name: "open↓", description: "下に行を挿入してインサートモードへ", category: "insert" },
  { key: "O", name: "Open↑", description: "上に行を挿入してインサートモードへ", category: "insert" },
  { key: "s", name: "substitute", description: "1文字削除してインサートモードへ", category: "insert" },
  { key: "gi", name: "insert(前回位置)", description: "前回インサートモードを抜けた位置でインサートモードへ", category: "insert" },
  { key: "gI", name: "Insert桁1", description: "行の1桁目でインサートモードへ", category: "insert" },

  // =============================================
  // Search — 検索・置換
  // =============================================
  { key: "/", name: "検索→", description: "前方検索", category: "search", modes: nv },
  { key: "?", name: "検索←", description: "後方検索", category: "search", modes: nv },
  { key: "n", name: "次の一致", description: "次の検索結果に移動", category: "search", modes: nvo },
  { key: "N", name: "前の一致", description: "前の検索結果に移動", category: "search", modes: nvo },
  { key: "*", name: "単語検索→", description: "カーソル下の単語を前方検索", category: "search", modes: nv },
  { key: "#", name: "単語検索←", description: "カーソル下の単語を後方検索", category: "search", modes: nv },
  { key: "g*", name: "部分検索→", description: "カーソル下の文字列を前方部分一致検索", category: "search", modes: nv },
  { key: "g#", name: "部分検索←", description: "カーソル下の文字列を後方部分一致検索", category: "search", modes: nv },
  { key: "gd", name: "ローカル定義", description: "カーソル下の単語のローカル定義に移動", category: "search" },
  { key: "gD", name: "グローバル定義", description: "カーソル下の単語のグローバル定義に移動", category: "search" },

  // =============================================
  // Visual — ビジュアルモード
  // =============================================
  { key: "v", name: "visual", description: "文字単位ビジュアルモード", category: "visual" },
  { key: "V", name: "Visual行", description: "行単位ビジュアルモード", category: "visual" },
  { key: "<C-v>", name: "Visual矩形", description: "矩形（ブロック）ビジュアルモード", category: "visual" },
  { key: "gv", name: "再選択", description: "前回のビジュアル選択範囲を再選択", category: "visual" },
  { key: "o", name: "選択端切替", description: "ビジュアルモードで選択範囲の反対端に移動", category: "visual", modes: ["v"] },

  // =============================================
  // Misc — その他
  // =============================================
  { key: ":", name: "コマンド", description: "コマンドラインモードへ", category: "misc", modes: nv },
  { key: "m", name: "mark", description: "マークを設定（ma, mb 等）", category: "misc" },
  { key: "q", name: "マクロ記録", description: "マクロの記録開始/停止（qa, q で停止）", category: "misc" },
  { key: "@", name: "マクロ実行", description: "マクロを実行（@a, @@ で前回再実行）", category: "misc" },
  { key: "@@", name: "マクロ再実行", description: "直前に実行したマクロを再実行", category: "misc" },
  { key: "&", name: ":s繰り返し", description: "直前の :s 置換を繰り返す", category: "misc" },
  { key: "\"", name: "レジスタ指定", description: "次のコマンドで使うレジスタを指定（\"a 等）", category: "misc", modes: nv },
  { key: "K", name: "キーワード検索", description: "カーソル下の単語を man/help で検索", category: "misc" },
  { key: "Q", name: "Exモード", description: "Exモードに切替（Neovim: マクロ再生）", category: "misc" },
  { key: "<C-l>", name: "再描画", description: "画面を再描画", category: "misc" },
  { key: "<C-g>", name: "ファイル情報", description: "ファイル名と位置情報を表示", category: "misc" },
  { key: "ga", name: "文字コード", description: "カーソル下の文字コードを表示", category: "misc" },
  { key: "g8", name: "UTF-8バイト", description: "カーソル下の文字のUTF-8バイト列を表示", category: "misc" },
  { key: "<C-z>", name: "サスペンド", description: "Vim をサスペンド（fg で復帰）", category: "misc" },

  // Misc — z コマンド（スクロール・折りたたみ）
  { key: "zz", name: "中央スクロール", description: "現在行を画面中央にスクロール", category: "misc" },
  { key: "zt", name: "上端スクロール", description: "現在行を画面上端にスクロール", category: "misc" },
  { key: "zb", name: "下端スクロール", description: "現在行を画面下端にスクロール", category: "misc" },
  { key: "zo", name: "折りたたみ開", description: "折りたたみを開く", category: "misc" },
  { key: "zc", name: "折りたたみ閉", description: "折りたたみを閉じる", category: "misc" },
  { key: "za", name: "折りたたみ切替", description: "折りたたみの開閉を切り替え", category: "misc" },
  { key: "zO", name: "全折りたたみ開", description: "再帰的にすべての折りたたみを開く", category: "misc" },
  { key: "zC", name: "全折りたたみ閉", description: "再帰的にすべての折りたたみを閉じる", category: "misc" },
  { key: "zA", name: "全折りたたみ切替", description: "再帰的に折りたたみの開閉を切り替え", category: "misc" },
  { key: "zR", name: "全開", description: "すべての折りたたみを開く", category: "misc" },
  { key: "zM", name: "全閉", description: "すべての折りたたみを閉じる", category: "misc" },

  // Misc — [ ] ジャンプ
  { key: "[{", name: "未対応{↑", description: "対応する閉じ括弧がない直前の { に移動", category: "misc" },
  { key: "]}", name: "未対応}↓", description: "対応する開き括弧がない次の } に移動", category: "misc" },
  { key: "[(", name: "未対応(↑", description: "対応する閉じ括弧がない直前の ( に移動", category: "misc" },
  { key: "])", name: "未対応)↓", description: "対応する開き括弧がない次の ) に移動", category: "misc" },
  { key: "[m", name: "メソッド先頭↑", description: "前のメソッド/関数の先頭に移動", category: "misc" },
  { key: "]m", name: "メソッド先頭↓", description: "次のメソッド/関数の先頭に移動", category: "misc" },
  { key: "[M", name: "メソッド末尾↑", description: "前のメソッド/関数の末尾に移動", category: "misc" },
  { key: "]M", name: "メソッド末尾↓", description: "次のメソッド/関数の末尾に移動", category: "misc" },

  // Misc — g コマンド（その他）
  { key: "g;", name: "変更位置←", description: "変更リストの前の位置に移動", category: "misc" },
  { key: "g,", name: "変更位置→", description: "変更リストの次の位置に移動", category: "misc" },
  { key: "gn", name: "検索→選択", description: "次の検索一致をビジュアル選択", category: "misc", modes: nvo },
  { key: "gN", name: "検索←選択", description: "前の検索一致をビジュアル選択", category: "misc", modes: nvo },

  // =============================================
  // Text Objects（オペレータ/ビジュアルモード内で使用）
  // =============================================
  { key: "iw", name: "inner word", description: "単語の内側", category: "textobj", modes: vo },
  { key: "aw", name: "a word", description: "単語（前後の空白含む）", category: "textobj", modes: vo },
  { key: "iW", name: "inner WORD", description: "WORD（空白区切り）の内側", category: "textobj", modes: vo },
  { key: "aW", name: "a WORD", description: "WORD（前後の空白含む）", category: "textobj", modes: vo },
  { key: "is", name: "inner sentence", description: "文の内側", category: "textobj", modes: vo },
  { key: "as", name: "a sentence", description: "文（前後の空白含む）", category: "textobj", modes: vo },
  { key: "ip", name: "inner paragraph", description: "段落の内側", category: "textobj", modes: vo },
  { key: "ap", name: "a paragraph", description: "段落（前後の空行含む）", category: "textobj", modes: vo },
  { key: "i(", name: "inner ()", description: "() の内側", category: "textobj", modes: vo },
  { key: "a(", name: "a ()", description: "() を含む範囲", category: "textobj", modes: vo },
  { key: "i[", name: "inner []", description: "[] の内側", category: "textobj", modes: vo },
  { key: "a[", name: "a []", description: "[] を含む範囲", category: "textobj", modes: vo },
  { key: "i{", name: "inner {}", description: "{} の内側", category: "textobj", modes: vo },
  { key: "a{", name: "a {}", description: "{} を含む範囲", category: "textobj", modes: vo },
  { key: "i<", name: "inner <>", description: "<> の内側", category: "textobj", modes: vo },
  { key: "a<", name: "a <>", description: "<> を含む範囲", category: "textobj", modes: vo },
  { key: "i\"", name: "inner \"\"", description: "\"\" の内側", category: "textobj", modes: vo },
  { key: "a\"", name: "a \"\"", description: "\"\" を含む範囲", category: "textobj", modes: vo },
  { key: "i'", name: "inner ''", description: "'' の内側", category: "textobj", modes: vo },
  { key: "a'", name: "a ''", description: "'' を含む範囲", category: "textobj", modes: vo },
  { key: "i`", name: "inner ``", description: "`` の内側", category: "textobj", modes: vo },
  { key: "a`", name: "a ``", description: "`` を含む範囲", category: "textobj", modes: vo },
  { key: "it", name: "inner tag", description: "HTMLタグの内側", category: "textobj", modes: vo },
  { key: "at", name: "a tag", description: "HTMLタグを含む範囲", category: "textobj", modes: vo },
];

/**
 * QWERTY キー → VimCommand の引き当て（単一キーのみ）
 */
export function getVimCommandByKey(key: string): VimCommand | undefined {
  return vimCommands.find((cmd) => cmd.key === key);
}

/** カテゴリ別の色 */
export const categoryColors: Record<string, string> = {
  motion: "#4fc3f7",
  edit: "#ff8a65",
  search: "#aed581",
  insert: "#ce93d8",
  visual: "#fff176",
  operator: "#f48fb1",
  textobj: "#80cbc4",
  misc: "#90a4ae",
};

export const categoryLabels: Record<string, string> = {
  motion: "移動",
  edit: "編集",
  search: "検索",
  insert: "挿入",
  visual: "ビジュアル",
  operator: "オペレータ",
  textobj: "テキストオブジェクト",
  misc: "その他",
};

export const sourceLabels: Record<string, string> = {
  hardcoded: "Vim 標準",
  "nvim-default": "Neovim",
  plugin: "プラグイン",
  user: "ユーザー設定",
};

export const sourceColors: Record<string, string> = {
  hardcoded: "#6c7086",
  "nvim-default": "#89b4fa",
  plugin: "#f9e2af",
  user: "#a6e3a1",
};

/**
 * Vim キーを Shift 分解する
 * "G" → { base: "g", shifted: true }
 * "$" → { base: "4", shifted: true }
 * "j" → { base: "j", shifted: false }
 */
export function decomposeVimKey(key: string): { base: string; shifted: boolean } {
  if (key.length !== 1) return { base: key, shifted: false };

  // 大文字アルファベット
  if (/^[A-Z]$/.test(key)) {
    return { base: key.toLowerCase(), shifted: true };
  }

  // Shift 記号 → ベースキーに分解
  if (inverseShiftMap[key]) {
    return { base: inverseShiftMap[key], shifted: true };
  }

  return { base: key, shifted: false };
}
