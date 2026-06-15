import { useCallback, useState } from "react";
import { type Mode } from "../../SpeedDial";
import { modelファイル } from "@/models/modelファイル/modelファイル";

export default function useCursor(mode?: Mode, disableEditable?: boolean) {
  const appSettings = modelファイル.appSettings.useValue();
  const [hover, setHover] = useState(false);

  const isAlias = disableEditable
    ? appSettings?.rightClick === "move" ||
      appSettings?.rightClick === "delete" ||
      appSettings?.middleClick === "move" ||
      appSettings?.middleClick === "delete"
    : (appSettings?.rightClick ?? appSettings?.middleClick);

  const cursor =
    mode === "move"
      ? "move"
      : (!disableEditable && mode === "edit") || mode === "delete"
        ? "pointer"
        : isAlias
          ? "alias"
          : undefined;

  const onMouseEnter = useCallback(() => {
    setHover(!!cursor);
  }, [cursor]);

  const onMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  return { cursor, hover, onMouseEnter, onMouseLeave };
}
