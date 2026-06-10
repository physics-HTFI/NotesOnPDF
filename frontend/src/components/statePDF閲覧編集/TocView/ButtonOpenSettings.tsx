import { Settings } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { useAtom } from "jotai";
import { modelUI } from "@/models/modelUI";
import TooltipIconButton from "@/components/share/TooltipIconButton";

export function ButtonOpenSettings() {
  const [openDrawer, setOpenDrawer] = useAtom(
    modelUI.openDrawer.pdfFileTree.atom,
  );
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
