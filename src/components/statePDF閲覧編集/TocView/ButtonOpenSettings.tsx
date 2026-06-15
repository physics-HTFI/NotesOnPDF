import { Settings } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { modelUI } from "@/models/modelUI/modelUI";
import TooltipIconButton from "@/components/share/TooltipIconButton";

export function ButtonOpenSettings() {
  const [openDrawer, setOpenDrawer] = modelUI.openDrawer_settings.use();
  return (
    <TooltipIconButton
      icon={<Settings />}
      onClick={() => setOpenDrawer(!openDrawer)}
      sx={{
        position: "sticky",
        bottom: 0,
        ml: "auto",
        width: "fit-content",
        visibility: openDrawer ? "hidden" : "visible",
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
