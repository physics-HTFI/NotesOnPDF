import { AppSettingsContext } from "@/contexts/AppSettingsContext";
import { useContext } from "react";
import { Mode } from "../SpeedDial";

export const useCursor = (mode?: Mode) => {
  const { appSettings } = useContext(AppSettingsContext);

  const getCursor = () =>
    mode === "move"
      ? "move"
      : mode === "edit" || mode === "delete"
      ? "pointer"
      : appSettings?.rightClick ?? appSettings?.middleClick
      ? "alias"
      : undefined;

  const isMove =
    mode === "move" ||
    appSettings?.rightClick === "move" ||
    appSettings?.middleClick === "move";

  return { getCursor, isMove };
};
