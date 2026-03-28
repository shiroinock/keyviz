import { useEffect, useRef, useState } from "react";
import { normalizeKeyEvent } from "../../utils/key-event";
import styles from "./KeyCapture.module.css";

export interface KeyCaptureProps {
  onConfirm: (key: string) => void;
  onCancel: () => void;
}

export function KeyCapture({ onConfirm, onCancel }: KeyCaptureProps) {
  const capturedKeyRef = useRef<string | null>(null);
  const [capturedKey, setCapturedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const vimKey = normalizeKeyEvent(e);

      if (vimKey === "") return;

      e.preventDefault();

      if (e.key === "Escape") {
        onCancel();
        return;
      }

      if (e.key === "Enter" && capturedKeyRef.current !== null) {
        onConfirm(capturedKeyRef.current);
        return;
      }

      if (vimKey === capturedKeyRef.current) {
        onConfirm(capturedKeyRef.current);
        return;
      }

      capturedKeyRef.current = vimKey;
      setCapturedKey(vimKey);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onConfirm, onCancel]);

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
