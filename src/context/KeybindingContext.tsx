import { createContext, useContext } from "react";
import { useKeybindingConfig } from "../hooks/useKeybindingConfig";
import type {
  Keybinding,
  KeybindingConfig,
  VimMode,
} from "../types/keybinding";

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
  const value = useKeybindingConfig(initial);
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
