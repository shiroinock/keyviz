import { useCallback, useState } from "react";
import defaultLayoutJSON from "../data/default-layout.json";
import type { KeyboardLayout } from "../types/keyboard";
import { parseKLE, parseVIAorKLE } from "../utils/kle-parser";

export function useKeyboardLayout() {
  const [layout, setLayout] = useState<KeyboardLayout>(() =>
    parseKLE(defaultLayoutJSON.layouts.keymap, defaultLayoutJSON.name),
  );
  const [error, setError] = useState<string | null>(null);

  const loadFromJSON = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const newLayout = parseVIAorKLE(parsed);
      setLayout(newLayout);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON の解析に失敗しました");
    }
  }, []);

  return { layout, loadFromJSON, error };
}
