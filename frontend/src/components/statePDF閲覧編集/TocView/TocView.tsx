import { Box } from "@mui/material";
import SettingsDrawer from "./SettingsDrawer/SettingsDrawer";
import { grey } from "@mui/material/colors";
import { ButtonOpenSettings } from "./ButtonOpenSettings";
import { ToC } from "./Toc/Toc";

/**
 * 目次を表示するコンポーネント
 */
export default function TocView() {
  return (
    <Box
      sx={{
        background: grey[100],
        height: "100vh",
        overflowWrap: "break-word",
        fontSize: "70%",
        overflow: "hidden",
        position: "relative", // 設定ドロワー用
      }}
    >
      <Box
        sx={{
          p: 0.5,
          lineHeight: 1,
          overflowY: "auto",
          overflowX: "hidden",
          height: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
        onWheel={(e) => {
          const target = e.currentTarget;
          const isScrollBarVisible = target.scrollHeight > target.clientHeight;
          if (isScrollBarVisible) e.stopPropagation();
        }}
      >
        <Box>
          <ToC />
        </Box>
        <ButtonOpenSettings />
      </Box>
      <SettingsDrawer />
    </Box>
  );
}
