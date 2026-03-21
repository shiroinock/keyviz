import type { VimCommand } from "../../types/vim";
import { categoryColors, categoryLabels } from "../../data/vim-commands";
import styles from "./CommandDetail.module.css";

interface CommandDetailProps {
  command: VimCommand | null;
  customKey: string | null;
}

export function CommandDetail({ command, customKey }: CommandDetailProps) {
  if (!command) {
    return (
      <div className={styles.panel}>
        <span className={styles.placeholder}>
          キーにホバーすると Vim コマンドの詳細が表示されます
        </span>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <span
        className={styles.categoryBadge}
        style={{ backgroundColor: categoryColors[command.category] }}
      >
        {categoryLabels[command.category]}
      </span>
      <div className={styles.info}>
        <span className={styles.commandName}>{command.name}</span>
        <span className={styles.description}>{command.description}</span>
        <span className={styles.keys}>
          Vim: <kbd>{command.key}</kbd>
          {customKey && (
            <>
              {" → "}あなたのキー: <kbd>{customKey}</kbd>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
