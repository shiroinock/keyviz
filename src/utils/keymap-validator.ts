export type KeymapValidationError = {
  type: "duplicate-output" | "invalid-qwerty" | "empty-output";
  keys: string[];
  message: string;
};

const QWERTY_KEYS = new Set([
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  ".",
  "/",
]);

export function validateKeymap(
  keymap: Record<string, string>,
): KeymapValidationError[] {
  const errors: KeymapValidationError[] = [];

  const invalidKeys = Object.keys(keymap).filter(
    (key) => !QWERTY_KEYS.has(key),
  );
  if (invalidKeys.length > 0) {
    errors.push({
      type: "invalid-qwerty",
      keys: invalidKeys,
      message: `サポート外の QWERTY キーが含まれています: ${invalidKeys.join(", ")}`,
    });
  }

  const emptyKeys = Object.entries(keymap)
    .filter(([, output]) => output === "")
    .map(([key]) => key);
  if (emptyKeys.length > 0) {
    errors.push({
      type: "empty-output",
      keys: emptyKeys,
      message: `出力文字が空のキーが含まれています: ${emptyKeys.join(", ")}`,
    });
  }

  const emptyKeySet = new Set(emptyKeys);
  const outputToKeys = new Map<string, string[]>();
  for (const [key, output] of Object.entries(keymap)) {
    if (emptyKeySet.has(key)) continue;
    const group = outputToKeys.get(output) ?? [];
    group.push(key);
    outputToKeys.set(output, group);
  }

  for (const [output, keys] of outputToKeys) {
    if (keys.length > 1) {
      errors.push({
        type: "duplicate-output",
        keys,
        message: `出力文字 "${output}" が複数のキーに割り当てられています: ${keys.join(", ")}`,
      });
    }
  }

  return errors;
}
