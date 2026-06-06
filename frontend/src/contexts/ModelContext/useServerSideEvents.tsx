import type IModel from "@/models/IModel";
import { useEffect, useRef, useState } from "react";
import { modelUi } from "@/global/modelUi";

/**
 * サーバーからのメッセージを受け取るカスタムフック
 */
export default function useServerSideEvents(model: IModel) {
  const clearAlert = modelUi.alert.useClear();
  const [serverFailed, setServerFailed] = useState(false);
  const [rootDirectoryChanged, setRootDirectoryChanged] = useState(false);
  const eventSource = useRef<EventSource>(undefined);

  useEffect(() => {
    if (eventSource.current) return;
    eventSource.current = model.getEventSource();
    if (!eventSource.current) return;
    eventSource.current.onerror = () => {
      setServerFailed(true);
      setTimeout(clearAlert, 500); // 読み込み失敗エラーを消す
    };
    eventSource.current.onmessage = (e) => {
      setServerFailed(false);
      if (e.data === "reload") {
        setRootDirectoryChanged(true);
        clearAlert();
      }
    };
    return () => {
      eventSource.current?.close();
      eventSource.current = undefined; // devモードだとuseEffectが2回実行されることへの対応：https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development
    };
  }, [model, clearAlert]);

  return { serverFailed, rootDirectoryChanged };
}
