import ModelContext from "@/contexts/ModelContext";
import UiStateContext from "@/contexts/UiStateContext";
import { useContext, useEffect, useRef } from "react";

/**
 * サーバーからのメッセージを受け取るコンポーネント
 */
export default function ServerSideEvents() {
  const { model } = useContext(ModelContext);
  const { setServerFailed, setRootDirectoryChanged } =
    useContext(UiStateContext);
  const eventSource = useRef<EventSource>();

  useEffect(() => {
    eventSource.current = model.getEventSource();
    if (!eventSource.current) return;
    eventSource.current.onerror = () => {
      setServerFailed(true);
    };
    eventSource.current.onmessage = (e) => {
      setServerFailed(false);
      if (e.data === "reload") {
        setRootDirectoryChanged(true);
      }
    };
    return () => {
      document.oncontextmenu = null;
      eventSource.current?.close();
    };
  }, [model, setServerFailed, setRootDirectoryChanged]);

  return undefined;
}
