import type { VimCommand } from "../types/vim";
import type {
  Keybinding,
  KeybindingConfig,
  VimMode,
} from "../types/keybinding";
import { emptyBindings } from "../types/keybinding";
import { vimCommands } from "../data/vim-commands";

/**
 * VimCommand → Keybinding 変換
 */
function commandToKeybinding(
  cmd: VimCommand,
  source: Keybinding["source"] = "default"
): Keybinding {
  return {
    lhs: cmd.key,
    commandId: cmd.key,
    name: cmd.name,
    description: cmd.description,
    category: cmd.category,
    source,
    noremap: true,
  };
}

/**
 * ハードコードされた vimCommands からデフォルトの KeybindingConfig を生成。
 * すべてのコマンドを Normal モードに配置する（現行と同じ動作）。
 */
export function createDefaultConfig(
  name = "QWERTY Default"
): KeybindingConfig {
  const bindings = emptyBindings();

  bindings.n = vimCommands.map((cmd) => commandToKeybinding(cmd));

  const now = new Date().toISOString();
  return {
    name,
    bindings,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * VimCommand 配列から指定モードの Keybinding 配列を生成
 */
export function commandsToBindings(
  commands: VimCommand[],
  mode: VimMode,
  source: Keybinding["source"] = "default"
): Keybinding[] {
  void mode; // 将来のモード別フィルタリング用
  return commands.map((cmd) => commandToKeybinding(cmd, source));
}
