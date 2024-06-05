import { useCallback, useContext } from "react";
import { Mode } from "../SpeedDial";
import ModelContext from "@/contexts/ModelContext/ModelContext";

export default function useCursor(mode?: Mode) {
  const { appSettings } = useContext(ModelContext);

  const getCursor = useCallback(
    () =>
      mode === "move"
        ? "move"
        : mode === "edit" || mode === "delete"
        ? "pointer"
        : appSettings?.rightClick ?? appSettings?.middleClick
        ? "alias"
        : undefined,
    [appSettings?.middleClick, appSettings?.rightClick, mode]
  );

  const isMove =
    mode === "move" ||
    appSettings?.rightClick === "move" ||
    appSettings?.middleClick === "move";

  return { getCursor, isMove };
}
