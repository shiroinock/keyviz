import { useCallback, useEffect, useRef, useState } from "react";
import type { KLEJSON, VIADefinition } from "../types/keyboard";
import type { VialDevice } from "../types/vial";
import {
  connectVialDevice,
  disconnectVialDevice,
  getKeyboardDefinition,
  getKeymapData,
  isWebHIDSupported,
} from "../utils/vial-protocol";

type VialConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

const DEFAULT_LAYERS = 4;
const DEFAULT_MATRIX = { rows: 1, cols: 1 } as const;
const CONNECT_ERROR_MESSAGE = "接続に失敗しました";

interface UseVialDeviceOptions {
  onLoadLayout: (json: string) => void;
  onLoadKeymap: (json: string) => void;
}

interface UseVialDeviceReturn {
  status: VialConnectionStatus;
  error: string | null;
  deviceName: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isSupported: boolean;
}

/**
 * VIADefinition かどうかを判定する型ガード
 * getKeyboardDefinition の戻り値が KLEJSON（配列）か VIADefinition（オブジェクト）かを区別する
 */
function isVIADefinitionResult(
  value: KLEJSON | VIADefinition,
): value is VIADefinition {
  return (
    !Array.isArray(value) &&
    "matrix" in value &&
    typeof value.matrix === "object"
  );
}

export function useVialDevice(
  options: UseVialDeviceOptions,
): UseVialDeviceReturn {
  const { onLoadLayout, onLoadKeymap } = options;

  const [status, setStatus] = useState<VialConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);

  // disconnect 時に参照できるようデバイスを ref で保持
  const deviceRef = useRef<VialDevice | null>(null);
  const disconnectHandlerRef = useRef<(() => void) | null>(null);

  const connect = useCallback(async () => {
    setStatus("connecting");
    setError(null);

    // 既存デバイスがあれば先に切断
    if (deviceRef.current !== null) {
      if (disconnectHandlerRef.current !== null) {
        deviceRef.current.hid.removeEventListener(
          "disconnect",
          disconnectHandlerRef.current,
        );
        disconnectHandlerRef.current = null;
      }
      await disconnectVialDevice(deviceRef.current);
      deviceRef.current = null;
    }

    try {
      const device = await connectVialDevice();
      deviceRef.current = device;

      const definition = await getKeyboardDefinition(device);

      let layers: number;
      let matrixSize: number;

      if (isVIADefinitionResult(definition)) {
        // VIADefinition の場合: matrix からサイズを計算
        const matrix = definition.matrix ?? DEFAULT_MATRIX;
        matrixSize = matrix.rows * matrix.cols;
        layers =
          definition.layouts.labels !== undefined
            ? definition.layouts.labels.length + 1
            : DEFAULT_LAYERS;
      } else {
        // KLE JSON（配列）の場合: キー数をカウントしてデフォルトレイヤーを使用
        const flatKeys = definition.flat();
        matrixSize = flatKeys.filter((item) => typeof item === "string").length;
        layers = DEFAULT_LAYERS;
      }

      const keymapData = await getKeymapData(device, layers, matrixSize);

      onLoadLayout(JSON.stringify(definition));
      onLoadKeymap(JSON.stringify(keymapData));

      setDeviceName(device.productName);
      setStatus("connected");

      // 物理切断イベントを検知して状態をリセットする
      const handleDisconnect = () => {
        setStatus("disconnected");
        setDeviceName(null);
        setError(null);
        deviceRef.current = null;
        disconnectHandlerRef.current = null;
      };
      device.hid.addEventListener("disconnect", handleDisconnect);
      disconnectHandlerRef.current = handleDisconnect;
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : CONNECT_ERROR_MESSAGE);
    }
  }, [onLoadLayout, onLoadKeymap]);

  const disconnect = useCallback(async () => {
    if (deviceRef.current !== null) {
      if (disconnectHandlerRef.current !== null) {
        deviceRef.current.hid.removeEventListener(
          "disconnect",
          disconnectHandlerRef.current,
        );
        disconnectHandlerRef.current = null;
      }
      await disconnectVialDevice(deviceRef.current);
      deviceRef.current = null;
    }
    setStatus("disconnected");
    setDeviceName(null);
    setError(null);
  }, []);

  // アンマウント時にイベントリスナーをクリーンアップ
  useEffect(() => {
    return () => {
      if (deviceRef.current !== null && disconnectHandlerRef.current !== null) {
        deviceRef.current.hid.removeEventListener(
          "disconnect",
          disconnectHandlerRef.current,
        );
      }
    };
  }, []);

  return {
    status,
    error,
    deviceName,
    connect,
    disconnect,
    isSupported: isWebHIDSupported(),
  };
}
