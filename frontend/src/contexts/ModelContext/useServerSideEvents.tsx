import IModel from "@/models/IModel";
import { useContext, useEffect, useRef, useState } from "react";
import UiContext from "../UiContext";

/**
 * サーバーからのメッセージを受け取るカスタムフック
 */
export default function useServerSideEvents(model: IModel) {
  const { setAlert } = useContext(UiContext);
  const [serverFailed, setServerFailed] = useState(false);
  const [rootDirectoryChanged, setRootDirectoryChanged] = useState(false);
  const eventSource = useRef<EventSource>();

  useEffect(() => {
    if (eventSource.current) return;
    eventSource.current = model.getEventSource();
    if (!eventSource.current) return;
    eventSource.current.onerror = () => {
      setServerFailed(true);
      setTimeout(setAlert, 500); // 読み込み失敗エラーを消す
    };
    eventSource.current.onmessage = (e) => {
      setServerFailed(false);
      if (e.data === "reload") {
        setRootDirectoryChanged(true);
        setAlert();
      }
    };
    return () => {
      eventSource.current?.close();
      eventSource.current = undefined; // devモードだとuseEffectが2回実行されることへの対応：https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development
    };
  }, [model, setAlert]);

  return { serverFailed, rootDirectoryChanged };
}
