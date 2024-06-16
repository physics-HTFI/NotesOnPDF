import { useContext } from "react";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import { Mode } from "../../SpeedDial";

export default function useCursor(mode?: Mode, disableEditable?: boolean) {
  const { appSettings } = useContext(ModelContext);

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

  const isMove =
    mode === "move" ||
    appSettings?.rightClick === "move" ||
    appSettings?.middleClick === "move";

  return { cursor, isMove };
}
