import { Settings } from "@mui/icons-material";
import TooltipIconButton from "../common/TooltipIconButton";
import { grey } from "@mui/material/colors";
import UiContext from "@/contexts/UiContext";
import { useContext } from "react";

export function ButtonOpenSettings() {
  const { openSettingsDrawer, setOpenSettingsDrawer } = useContext(UiContext);
  return (
    <TooltipIconButton
      icon={<Settings />}
      onClick={() => {
        setOpenSettingsDrawer(!openSettingsDrawer);
      }}
      sx={{
        position: "sticky",
        bottom: 0,
        ml: "auto",
        width: "fit-content",
        visibility: openSettingsDrawer ? "hidden" : "visible",
        color: "green",
        background: "#f5f5f5c0",
        borderRadius: "100%",
        mt: "auto",
        "&:hover": {
          background: grey[300],
        },
      }}
      tooltipTitle="設定パネルを開きます"
      tooltipPlacement="top"
    />
  );
}
