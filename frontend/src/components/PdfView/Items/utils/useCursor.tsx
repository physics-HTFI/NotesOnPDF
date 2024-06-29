import { useCallback, useContext, useState } from "react";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import { Mode } from "../../SpeedDial";

export default function useCursor(mode?: Mode, disableEditable?: boolean) {
  const { appSettings } = useContext(ModelContext);
  const [hover, setHover] = useState(false);

  const isAlias = disableEditable
    ? appSettings?.rightClick === "move" ||
      appSettings?.rightClick === "delete" ||
      appSettings?.middleClick === "move" ||
      appSettings?.middleClick === "delete"
    : appSettings?.rightClick ?? appSettings?.middleClick;

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
