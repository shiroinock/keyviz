import { createContext, useContext } from "react";
import { useKeybindingConfig } from "../hooks/useKeybindingConfig";
import type {
  Keybinding,
  KeybindingConfig,
  VimMode,
} from "../types/keybinding";
import { loadKeybindingConfig } from "../utils/storage";

interface KeybindingContextValue {
  config: KeybindingConfig;
  dispatch: ReturnType<typeof useKeybindingConfig>["dispatch"];
  getBinding: (mode: VimMode, lhs: string) => Keybinding | undefined;
  bindingsByLhs: ReturnType<typeof useKeybindingConfig>["bindingsByLhs"];
}

const KeybindingContext = createContext<KeybindingContextValue | null>(null);

export function KeybindingProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: KeybindingConfig;
}) {
  // initial が指定されていない場合、localStorage から復元を試みる
  const resolvedInitial = initial ?? loadKeybindingConfig() ?? undefined;
  const value = useKeybindingConfig(resolvedInitial);
  return (
    <KeybindingContext.Provider value={value}>
      {children}
    </KeybindingContext.Provider>
  );
}

export function useKeybindingContext(): KeybindingContextValue {
  const ctx = useContext(KeybindingContext);
  if (!ctx) {
    throw new Error(
      "useKeybindingContext must be used within a KeybindingProvider",
    );
  }
  return ctx;
}
