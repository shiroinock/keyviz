import { useEffect, useState } from "react";
import { normalizeKeyEvent } from "../../utils/key-event";
import styles from "./KeyCapture.module.css";

export interface KeyCaptureProps {
  onConfirm: (key: string) => void;
  onCancel: () => void;
}

export function KeyCapture({ onConfirm, onCancel }: KeyCaptureProps) {
  // 現在キャプチャしているキーの Vim 表記
  const [capturedKey, setCapturedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const vimKey = normalizeKeyEvent(e);

      // 修飾キー単体は無視
      if (vimKey === "") return;

      // Escape はキャンセル操作
      if (e.key === "Escape") {
        onCancel();
        return;
      }

      // Enter で確定（キャプチャ済みの場合のみ）
      if (e.key === "Enter" && capturedKey !== null) {
        onConfirm(capturedKey);
        return;
      }

      // 同じキーを再度押した場合は確定
      if (vimKey === capturedKey) {
        onConfirm(capturedKey);
        return;
      }

      // 新しいキーをキャプチャ
      setCapturedKey(vimKey);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [capturedKey, onConfirm, onCancel]);

  return (
    <div className={styles.container}>
      {capturedKey === null ? (
        <span className={styles.placeholder}>キーを押してください…</span>
      ) : (
        <div className={styles.preview}>
          <kbd className={styles.keyBadge}>{capturedKey}</kbd>
          <span className={styles.hint}>
            Enter または同じキーで確定 / Escape でキャンセル
          </span>
        </div>
      )}
    </div>
  );
}
