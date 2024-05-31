import ModelContext from "@/contexts/ModelContext";
import UiStateContext from "@/contexts/UiStateContext";
import { useContext, useEffect, useRef } from "react";

/**
 * サーバーからのメッセージを受け取るコンポーネント
 */
export default function ServerSideEvents() {
  const { model } = useContext(ModelContext);
  const { initialized, setServerFailed, setRootDirectoryChanged } =
    useContext(UiStateContext);
  const eventSource = useRef<EventSource>();

  useEffect(() => {
    eventSource.current = model.getEventSource();
    if (!eventSource.current) return;
    eventSource.current.onerror = () => {
      setServerFailed(true);
    };
    eventSource.current.onmessage = (e) => {
      if (!initialized) return; // 初期化に失敗しているときはファイルツリーも表示されてないので更新しない
      setServerFailed(false);
      if (e.data === "reload") {
        setRootDirectoryChanged(true);
      }
    };
    return () => {
      document.oncontextmenu = null;
      eventSource.current?.close();
    };
  }, [model, initialized, setServerFailed, setRootDirectoryChanged]);

  return undefined;
}
