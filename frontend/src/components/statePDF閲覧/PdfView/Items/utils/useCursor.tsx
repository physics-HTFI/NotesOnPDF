import { useCallback, useState } from "react";
import { type Mode } from "../../SpeedDial";
import { modelPDF閲覧 } from "@/models/modelPDF閲覧";
import { useAtomValue } from "jotai";

export default function useCursor(mode?: Mode, disableEditable?: boolean) {
  const appSettings = useAtomValue(modelPDF閲覧.appSettings.atom);
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
